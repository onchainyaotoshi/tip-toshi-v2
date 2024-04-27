import { Button, FrameContext, FrameResponse } from "frog"
import { type TypedResponse } from "../../node_modules/frog/types/response.js";

const ADD_URL =
  `https://warpcast.com/~/add-cast-action?url=${process.env.FC_DOMAIN}/tip`;

export default (c: FrameContext, a?: string): TypedResponse<FrameResponse> => c.res({
    action: a ? a : undefined,
    image: `${process.env.FC_DOMAIN}/images/tip.png?v=1`,
    intents: [
      <Button.Transaction target="/tip1">Tip $1 TOSHI</Button.Transaction>,
      <Button.Transaction target="/tip3">Tip $3 TOSHI</Button.Transaction>,
      <Button.Transaction target="/tip5">Tip $5 TOSHI</Button.Transaction>,
      <Button.Transaction target="/tip8">Tip $8 TOSHI</Button.Transaction>,
    ],
});