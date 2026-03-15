import { useMemo, useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";

const PACKAGE_ID =
  "0x02bd1cad27faa2e5b757a199c579d7e128c5b725d976ceb37234e907b3a7f7a1";

const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || "";

export default function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [name, setName] = useState("Kryptonite NFT");
  const [description, setDescription] = useState("Minted from Kryptonite Minter");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("Ready");
  const [digest, setDigest] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [minting, setMinting] = useState(false);

  const canMint = useMemo(() => {
    return !!account && !!name.trim() && !!description.trim() && !!imageFile && !minting;
  }, [account, name, description, imageFile, minting]);

  function onImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);

    if (!file) {
      setImagePreview("");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  }

  async function getSignedUploadUrl(fileName: string): Promise<string> {
    const response = await fetch(`/api/pinata-url?name=${encodeURIComponent(fileName)}`);
    if (!response.ok) {
      throw new Error("Failed to get signed upload URL");
    }

    const data = await response.json();
    return data.url;
  }

async function uploadFileToPinata(file: File) {
  const response = await fetch(`/api/pinata-url?name=${encodeURIComponent(file.name)}`);
  const { url } = await response.json();

  const formData = new FormData();
  formData.append("file", file);

  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!upload.ok) {
    throw new Error("Pinata upload failed");
  }

  const data = await upload.json();
  return data.IpfsHash;

}


















  



  async function uploadMetadataToPinata(metadata: Record<string, unknown>) {
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: "application/json",
    });

    const metadataFile = new File([metadataBlob], "metadata.json", {
      type: "application/json",
    });

    return uploadFileToPinata(metadataFile);
  }

  async function handleMint() {
    try {
      if (!account) {
        alert("Connect wallet first");
        return;
      }

      if (!imageFile) {
        alert("Choose an image first");
        return;
      }

      setMinting(true);
      setDigest("");
      setMetadataUrl("");
      setImageUrl("");

      setStatus("Uploading image to IPFS...");
      const uploadedImage = await uploadFileToPinata(imageFile);
      setImageUrl(uploadedImage.url);

      const metadata = {
        name: name.trim(),
        description: description.trim(),
        image: uploadedImage.url,
        attributes: [
          {
            trait_type: "Collection",
            value: "Kryptonite",
          },
        ],
      };

      setStatus("Uploading metadata to IPFS...");
      const uploadedMetadata = await uploadMetadataToPinata(metadata);
      setMetadataUrl(uploadedMetadata.url);

      setStatus("Waiting for wallet approval...");

      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::kryptonite_nft::mint_to_sender`,
        arguments: [
          tx.pure.string(name.trim()),
          tx.pure.string(description.trim()),
          tx.pure.string(uploadedMetadata.url),
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setDigest(result.digest);
            setStatus("NFT minted successfully");
            setMinting(false);
          },
          onError: (error) => {
            console.error(error);
            setStatus(error.message || "Mint failed");
            setMinting(false);
          },
        }
      );
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "Unexpected error");
      setMinting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111111",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>Kryptonite NFT Minter</h1>
        <p style={{ marginTop: 0, marginBottom: 24 }}>
          Mainnet NFT minting with IPFS metadata.
        </p>

        <div style={{ marginBottom: 20 }}>
          <ConnectButton />
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <p style={{ marginTop: 0, fontWeight: 700 }}>Connected wallet</p>
          <p style={{ marginBottom: 0, wordBreak: "break-all" }}>
            {account ? account.address : "Not connected"}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <label style={{ display: "grid", gap: 8 }}>
            <span>NFT Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kryptonite NFT"
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #bbb",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your NFT"
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #bbb",
                fontSize: 16,
                resize: "vertical",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Image File</span>
            <input type="file" accept="image/*" onChange={onImageChange} />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                maxWidth: 320,
                borderRadius: 16,
                border: "1px solid #ddd",
              }}
            />
          )}

          <button
            onClick={handleMint}
            disabled={!canMint}
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              border: "1px solid #111",
              background: canMint ? "#111" : "#999",
              color: "#fff",
              fontSize: 16,
              cursor: canMint ? "pointer" : "not-allowed",
            }}
          >
            {minting ? "Minting..." : "Mint NFT"}
          </button>
        </div>

        <div
          style={{
            marginTop: 20,
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <p style={{ marginTop: 0, fontWeight: 700 }}>Status</p>
          <p>{status}</p>

          {imageUrl && (
            <p style={{ wordBreak: "break-all" }}>
              <strong>Image URL:</strong> {imageUrl}
            </p>
          )}

          {metadataUrl && (
            <p style={{ wordBreak: "break-all" }}>
              <strong>Metadata URL:</strong> {metadataUrl}
            </p>
          )}

          {digest && (
            <p style={{ wordBreak: "break-all" }}>
              <strong>Transaction Digest:</strong> {digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
