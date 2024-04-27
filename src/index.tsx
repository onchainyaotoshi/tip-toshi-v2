import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { getFrogApp, neynar } from "./utils/app";
import TipController from "./controllers/tip";

import {
  getBalanceOf,
  getAmountTip,
  ABI,
  CA,
  getAccountAddress,
} from "./utils/web3/wallet";

import { parseEther } from "frog";

import { CastParamType } from "@neynar/nodejs-sdk";

export const app = getFrogApp({
  browserLocation: "https://poll.cool",
});

app.use("/*", serveStatic({ root: "./public" }));

app.frame("/:id", async (c) => {
  return TipController(c, "/finish");
});

app.frame('/finish', async (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    )
  })
})

app.transaction("/tip1", async (c) => {
  try {
    const { frameData } = c;
    const fid = frameData?.fid;
    const {id} = c.req.param() as { id: string };
    console.log("interactor fid",fid);
    console.log("toFid",id);
    // return c.contract({
    //   abi: ABI,
    //   chainId: "eip155:8453",
    //   functionName: "transfer",
    //   args: [await getAccountAddress(fid), parseEther(amountTopup + "", "wei")],
    //   to: CA,
    // })
  } catch (err) {
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
