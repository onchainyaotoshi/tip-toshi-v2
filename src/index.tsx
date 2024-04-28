import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { getFrogApp, neynar, publishCast } from "./utils/app";
import TipController from "./controllers/tip";
import { CastParamType } from "@neynar/nodejs-sdk";
import Style1 from "./components/style-1";

import {
  getAmountTip,
  ABI,
  CA,
} from "./utils/web3/wallet";

import { Button, FrameContext, TransactionContext, parseEther } from "frog";

const getToUsername = async (c: TransactionContext | FrameContext) => {
  const { frameData } = c;
  const { castId } = frameData;

  const data = await neynar.lookUpCastByHashOrWarpcastUrl(
    castId.hash,
    CastParamType.Hash,
  );

  if (!data.cast.parent_author.fid) {
    throw new Error("Caster has no verified address");
  }

  const toUser = await neynar.lookupUserByFid(data.cast.parent_author.fid);
  // @ts-ignore
  const addresses = toUser.result.user.verifiedAddresses.eth_addresses;
  if (addresses.length === 0) {
    throw new Error("Caster has no verified address");
  }

  return {
    username:toUser.result.user.username,
    address:addresses[0]
  }
};

const tippingFeature = async (c: TransactionContext, amount: number) => {
  const data = await getToUsername(c);
  const amountToshi = await getAmountTip(amount);

  return c.contract({
    abi: ABI,
    chainId: "eip155:8453",
    functionName: "transfer",
    args: [data.address, parseEther(amountToshi + "", "wei")],
    to: CA,
  });
};

export const app = getFrogApp({
  browserLocation: "https://poll.cool",
});

app.use("/*", serveStatic({ root: "./public" }));

app.frame("/", async (c) => {
  return TipController(c, "/finish");
});

app.frame("/finish", async (c) => {
  const { transactionId, frameData, buttonValue } = c;
  const fid = frameData?.fid;
  const dataTo = await getToUsername(c);
  const dataFrom = await neynar.lookupUserByFid(fid!);
  const fromUsername = dataFrom.result.user.username;

  await publishCast(
    `@${fromUsername} tipped /toshi to @${dataTo.username} with transactionId: ${transactionId}`,
  );

  return c.res({
    image: Style1(c, `Transaction id: ${transactionId}`),
    intents: [
      <Button.Link href={`https://base.blockscout.com/tx/${transactionId}`}>basescan</Button.Link>,
      ]
  });
});

app.transaction("/tip1", async (c) => {
  try {
    return await tippingFeature(c, 1);
  } catch (err) {
    console.error("tip1", err);
    return new Response(err.message, { status: 400 });
  }
});
app.transaction("/tip3", async (c) => {
  try {
    return await tippingFeature(c, 3);
  } catch (err) {
    console.error("tip3", err);
    return new Response(err.message, { status: 400 });
  }
});
app.transaction("/tip5", async (c) => {
  try {
    return await tippingFeature(c, 5);
  } catch (err) {
    console.error("tip5", err);
    return new Response(err.message, { status: 400 });
  }
});
app.transaction("/tip8", async (c) => {
  try {
    return await tippingFeature(c, 8);
  } catch (err) {
    console.error("tip8", err);
    return new Response(err.message, { status: 400 });
  }
});

const port: number | undefined = process.env.PORT
  ? +process.env.PORT
  : undefined;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on port ${port}`);
