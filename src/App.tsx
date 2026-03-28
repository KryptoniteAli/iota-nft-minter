import { useEffect, useMemo, useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";

type MintedNft = {
  name: string;
  description: string;
  imageUrl: string;
  metadataUrl: string;
  digest?: string;
};

const PACKAGE_ID =
  "0xb756ebb60a8a763f15efb4da2adfc69c9abc402727c0d1a809e07cb25e4f5c62";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY = "https://gateway.pinata.cloud";

function gatewayUrlFromHash(hash: string): string {
  return `${PINATA_GATEWAY}/ipfs/${hash}`;
}

async function uploadFileToPinata(
  file: File,
): Promise<{ cid: string; url: string }> {
  if (!PINATA_JWT) {
    throw new Error("Missing VITE_PINATA_JWT");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataMetadata",
    JSON.stringify({ name: file.name || "nft-image" }),
  );

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      `Pinata image upload failed: ${text || res.statusText || "Unknown error"}`,
    );
  }

  const cid = data?.IpfsHash;
  if (!cid) {
    throw new Error("Pinata image upload succeeded but no IpfsHash was returned");
  }

  return {
    cid,
    url: gatewayUrlFromHash(cid),
  };
}

async function uploadJsonToPinata(
  metadata: Record<string, unknown>,
): Promise<{ cid: string; url: string }> {
  if (!PINATA_JWT) {
    throw new Error("Missing VITE_PINATA_JWT");
  }

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: "nft-metadata.json",
      },
    }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      `Pinata metadata upload failed: ${text || res.statusText || "Unknown error"}`,
    );
  }

  const cid = data?.IpfsHash;
  if (!cid) {
    throw new Error(
      "Pinata metadata upload succeeded but no IpfsHash was returned",
    );
  }

  return {
    cid,
    url: gatewayUrlFromHash(cid),
  };
}

export default function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);
  const [digest, setDigest] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [mintedNfts, setMintedNfts] = useState<MintedNft[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("minted_nfts");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as MintedNft[];
      if (Array.isArray(parsed)) {
        setMintedNfts(parsed);
      }
    } catch {
      // ignore bad local data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("minted_nfts", JSON.stringify(mintedNfts));
  }, [mintedNfts]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const walletAddress = useMemo(() => account?.address ?? "", [account]);

  function resetForm() {
    setName("");
    setDescription("");
    setFile(null);
    setPreviewUrl("");
  }

  async function handleMint() {
    try {
      if (!walletAddress) {
        setStatus("Connect Nightly Wallet first");
        return;
      }

      if (!name.trim()) {
        setStatus("Please enter NFT name");
        return;
      }

      if (!description.trim()) {
        setStatus("Please enter description");
        return;
      }

      if (!file) {
        setStatus("Please choose an image file");
        return;
      }

      setMinting(true);
      setDigest("");
      setImageUrl("");
      setMetadataUrl("");

      setStatus("Uploading image to Pinata...");
      const uploadedImage = await uploadFileToPinata(file);
      setImageUrl(uploadedImage.url);

      setStatus("Uploading metadata to Pinata...");
      const metadata = {
        name: name.trim(),
        description: description.trim(),
        image: uploadedImage.url,
        image_url: uploadedImage.url,
        thumbnail_url: uploadedImage.url,
        project_url: "https://kryptoniteminter.vercel.app",
        creator: "KryptoniteAli",
        attributes: [
          { trait_type: "Collection", value: "Kryptonite NFT" },
          { trait_type: "Network", value: "IOTA" },
          { trait_type: "Standard", value: "IOTA Display" },
        ],
      };

      const uploadedMetadata = await uploadJsonToPinata(metadata);
      setMetadataUrl(uploadedMetadata.url);

      setStatus("Opening wallet for mint transaction...");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::kryptonite_nft_clean::mint_to_sender`,
        arguments: [
          tx.pure.string(name.trim()),
          tx.pure.string(description.trim()),
          tx.pure.string(uploadedImage.url),
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setDigest(result.digest);

            const newNft: MintedNft = {
              name: name.trim(),
              description: description.trim(),
              imageUrl: uploadedImage.url,
              metadataUrl: uploadedMetadata.url,
              digest: result.digest,
            };

            setMintedNfts((prev) => [newNft, ...prev]);
            setStatus("NFT minted successfully");
            setMinting(false);
            resetForm();
          },
          onError: (error) => {
            console.error(error);
            setStatus(error.message || "Mint failed");
            setMinting(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "Unexpected error");
      setMinting(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>Kryptonite IOTA NFT Minter</h1>
        <ConnectButton />
      </div>

      <section
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <strong>Wallet:</strong> {walletAddress || "Not connected"}
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              htmlFor="nft-name"
              style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
            >
              NFT Name
            </label>
            <input
              id="nft-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter NFT name"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="nft-description"
              style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
            >
              Description
            </label>
            <textarea
              id="nft-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter NFT description"
              rows={4}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #ccc",
                fontSize: 16,
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="nft-file"
              style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
            >
              Image File
            </label>
            <input
              id="nft-file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {previewUrl && (
            <div>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxWidth: 500,
                  borderRadius: 20,
                  display: "block",
                }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleMint}
            disabled={minting}
            style={{
              width: "fit-content",
              padding: "16px 28px",
              borderRadius: 18,
              border: "none",
              background: "#081433",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              cursor: minting ? "not-allowed" : "pointer",
              opacity: minting ? 0.7 : 1,
            }}
          >
            {minting ? "Minting..." : "✨ Mint NFT"}
          </button>
        </div>

        {status && <p style={{ marginTop: 24, fontSize: 18 }}>{status}</p>}

        {imageUrl && (
          <p>
            <strong>IPFS Image:</strong>{" "}
            <a href={imageUrl} target="_blank" rel="noreferrer">
              {imageUrl}
            </a>
          </p>
        )}

        {metadataUrl && (
          <p>
            <strong>IPFS Metadata:</strong>{" "}
            <a href={metadataUrl} target="_blank" rel="noreferrer">
              {metadataUrl}
            </a>
          </p>
        )}

        {digest && (
          <p>
            <strong>IOTAScan Tx:</strong>{" "}
            <a
              href={`https://explorer.iota.org/transaction/${digest}?network=testnet`}
              target="_blank"
              rel="noreferrer"
            >
              {digest}
            </a>
          </p>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 48, marginBottom: 24 }}>📚 My Minted NFTs</h2>

        {mintedNfts.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
          >
            No minted NFTs yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {mintedNfts.map((item, index) => (
              <div
                key={`${item.digest ?? item.metadataUrl}-${index}`}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div style={{ padding: 16 }}>
                  <h3 style={{ marginTop: 0 }}>{item.name}</h3>
                  <p>{item.description}</p>

                  <div style={{ display: "grid", gap: 8 }}>
                    <a href={item.imageUrl} target="_blank" rel="noreferrer">
                      View Image
                    </a>

                    <a href={item.metadataUrl} target="_blank" rel="noreferrer">
                      View Metadata
                    </a>

                    {item.digest && (
                      <a
                        href={`https://explorer.iota.org/transaction/${item.digest}?network=testnet`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Transaction
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
