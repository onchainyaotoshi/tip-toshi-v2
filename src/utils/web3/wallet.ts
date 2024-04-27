import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { ENTRYPOINT_ADDRESS_V07, bundlerActions } from "permissionless";
import { http, Hex, createPublicClient, zeroAddress, getContract, formatUnits, encodeFunctionData  } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { getKernelAddressFromECDSA } from "@zerodev/ecdsa-validator";
import Moralis from 'moralis';

import ABI from "./abi/toshi.json";

import {neynar} from '../app.ts';

import {parseEther} from 'frog';

const publicClient = createPublicClient({
  transport: http(process.env.BUNDLER_RPC),
});

const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);
const chain = base;
const entryPoint = ENTRYPOINT_ADDRESS_V07;
export const CA = "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4";

const MAX_TIP = parseFloat(process.env.FC_MAX_TIP_USD);

await Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export const getKernelClient = async (fid: number) => {
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer,
    entryPoint,
  });

  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    index: BigInt(fid),
    entryPoint,
  });

  const kernelClient = createKernelAccountClient({
    account,
    entryPoint,
    chain,
    bundlerTransport: http(process.env.BUNDLER_RPC),
    middleware: {
      sponsorUserOperation: async ({ userOperation }) => {
        const paymasterClient = createZeroDevPaymasterClient({
          chain,
          transport: http(process.env.PAYMASTER_RPC),
          entryPoint,
        });
        return paymasterClient.sponsorUserOperation({
          userOperation,
          entryPoint,
        });
      },
    },
  });

  return kernelClient;
};

export const getAccountAddress = async (fid: number) => {
  return await getKernelAddressFromECDSA({
    eoaAddress: process.env.ETH_ADDRESS as Hex,
    index: BigInt(fid),
    publicClient,
  });
};

export const getBalanceOf = async (fid: number) => {
  const address = await getAccountAddress(fid);

  const balance = await publicClient.readContract({
    address: CA,
    abi: ABI,
    functionName: "balanceOf",
    args: [address],
  });

  return Number(formatUnits(balance,18));
};

export const getAmountTip = async()=>{
  const response = await Moralis.EvmApi.token.getTokenPrice({
    "chain": "0x2105",
    "address": CA,
    "exchange": "sushiswap"
  });
  const max = Math.ceil(MAX_TIP/response.raw.usdPrice);

  if(isNaN(max)){
    throw new Error("There was a error with code 8");
  }

  return max;
}

export const tippingFeature = async(fromFid: number, toFid: number, amount: number)=>{
  const res = await neynar.lookupUserByFid(toFid);
  // @ts-ignore
  const addresses = res.result.user.verifiedAddresses.eth_addresses;
  if(addresses.length === 0){
    throw new Error("Caster has no verified address");
  }

  // console.log('address[0]: ',addresses[0]);
  // console.log('amount:',parseEther(amount+"",'wei'));
  
  const kernelClient = await getKernelClient(fromFid);
  const userOpHash = await kernelClient.sendUserOperation({
    userOperation: {
      callData: await kernelClient.account.encodeCallData({
        to: CA,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: ABI,
          functionName: "transfer",
          args: [addresses[0], parseEther(amount+"",'wei')],
          // args: [addresses[0], amount],
        }),
      }),
    },
  });

  // for now, let's not waiting for the tx to finish to avoid farcaster limit response time
  
  // console.log("userOp hash:", userOpHash)

  // const bundlerClient = kernelClient.extend(bundlerActions(entryPoint))
  // const _receipt = await bundlerClient.waitForUserOperationReceipt({
  //   hash: userOpHash,
  // })

  // console.log("userOp completed")

  return userOpHash;
}

export {ABI};