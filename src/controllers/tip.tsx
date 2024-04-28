import { Button, FrameContext, FrameResponse } from "frog"
import { type TypedResponse } from "../../node_modules/frog/types/response.js";;

export default (c: FrameContext, a?: string): TypedResponse<FrameResponse> => c.res({
    action: a ? a : undefined,
    image: `${process.env.FC_DOMAIN}/images/tip.png?v=1`,
    intents: [
      <Button.Transaction target="/tip1" value="$1">$1 TOSHI</Button.Transaction>,
      <Button.Transaction target="/tip3" value="$3">$3 TOSHI</Button.Transaction>,
      <Button.Transaction target="/tip5" value="$5">$5 TOSHI</Button.Transaction>,
      <Button.Transaction target="/tip8" value="$8">$8 TOSHI</Button.Transaction>,
    ],
});