import { Frog, FrogConstructorParameters } from 'frog'
import { neynar as NeynarHub } from 'frog/hubs'
import _ from 'lodash';
import axios from 'axios';

import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const frogAppArgs: FrogConstructorParameters = {
    imageOptions: {
        format: 'png',
    },
}

// // this is not working, throw errors:
// // Error: message is invalid. invalid signer: signer 0x268741c9a443f52192636054ce2b7b746300b3fbba72185a1e23793e9d2f5e81 not found for fid 1
frogAppArgs.hub = NeynarHub({ apiKey: process.env.NEYNAR_API_KEY || '' });
frogAppArgs.verify = false;

export const getFrogApp = (opts: FrogConstructorParameters<{}> = {}) => new Frog(_.merge(frogAppArgs,opts));

export const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

export const publishCast = async(text: string)=>{
  const response = await axios.request({
     method: 'POST',
     url: 'https://api.neynar.com/v2/farcaster/cast',
     headers: {
       accept: 'application/json',
       api_key: process.env.NEYNAR_API_KEY!,
       'content-type': 'application/json'
     },
     data: {
       signer_uuid: process.env.SIGNER_UUID!,
       text: text,
       channel_id: 'toshi'
     }
  })

  // console.log('response:', response.data);
}