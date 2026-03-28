/// <reference types="node" />

import { PinataSDK } from "pinata";

const jwt = import.meta.env.PINATA_JWT;
const gateway = import.meta.env.PINATA_GATEWAY ?? "gateway.pinata.cloud";

if (!jwt) {
  throw new Error("Missing PINATA_JWT");
}

const pinata = new PinataSDK({
  pinataJwt: jwt,
  pinataGateway: gateway,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const name =
      typeof req.query.name === "string" ? req.query.name : "upload-file";

    const url = await pinata.upload.public.createSignedURL({
      expires: 60,
      name,
    });

    return res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create signed URL" });
  }
}
