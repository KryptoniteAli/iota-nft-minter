import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY!,
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
