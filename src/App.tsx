import { useMemo, useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";

const PACKAGE_ID =
  "0x02bd1cad27faa2e5b757a199c579d7e128c5b725d976ceb37234e907b3a7f7a1";

export default function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [name, setName] = useState("Kryptonite NFT");
  const [description, setDescription] = useState("Minted from Kryptonite Minter");
  const [url, setUrl] = useState("https://placehold.co/600x600/png");
  const [digest, setDigest] = useState("");
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);

  const canMint = useMemo(() => {
    return !!account && !!name.trim() && !!description.trim() && !!url.trim() && !minting;
  }, [account, name, description, url, minting]);

  function handleMint() {
    if (!account) {
      alert("Connect wallet first");
      return;
    }

    setMinting(true);
    setStatus("Waiting for wallet approval...");

    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::kryptonite_nft::mint_to_sender`,
      arguments: [
        tx.pure.string(name.trim()),
        tx.pure.string(description.trim()),
        tx.pure.string(url.trim()),
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
          Mainnet NFT minting on IOTA.
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
            <span>Image URL</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #bbb",
                fontSize: 16,
              }}
            />
          </label>

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
          <p>{status || "Ready"}</p>
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
