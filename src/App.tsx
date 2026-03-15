import { useEffect, useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useIotaClient,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";

const PACKAGE_ID =
  "0x02bd1cad27faa2e5b757a199c579d7e128c5b725d976ceb37234e907b3a7f7a1";

type MintedNft = {
  objectId: string;
  name: string;
  description: string;
  url: string;
};

export default function App() {
  const account = useCurrentAccount();
  const client = useIotaClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [nfts, setNfts] = useState<MintedNft[]>([]);

  async function loadMyNfts() {
    if (!account) return;

    try {
      const owned = await client.getOwnedObjects({
        owner: account.address,
        options: {
          showContent: true,
          showType: true,
        },
      });

      const items: MintedNft[] = [];

      for (const item of owned.data) {
        const data = item.data;

        if (!data) continue;
        if (data.type !== `${PACKAGE_ID}::kryptonite_nft::NFT`) continue;

        const fields = (data.content as any)?.fields;
        if (!fields) continue;

        items.push({
          objectId: data.objectId,
          name: fields.name || "Unnamed NFT",
          description: fields.description || "",
          url: fields.url || "",
        });
      }

      setNfts(items);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMyNfts();
  }, [account]);

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
        onSuccess: async () => {
          setStatus("NFT minted successfully");
          setMinting(false);
          setName("");
          setDescription("");
          setUrl("");
          await loadMyNfts();
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
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Kryptonite NFT Minter</h1>
      <ConnectButton />

      <div style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2>Mint NFT</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NFT Name"
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }}
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }}
        />

        <button onClick={handleMint} disabled={minting}>
          {minting ? "Minting..." : "Mint NFT"}
        </button>

        <p style={{ marginTop: 12 }}>{status}</p>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>My Minted NFTs</h2>

        {nfts.length === 0 ? (
          <p>No NFTs found yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {nfts.map((nft) => (
              <div
                key={nft.objectId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 16,
                  padding: 12,
                  background: "#fff",
                }}
              >
                {nft.url && (


function resolveIpfs(url: string) {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return `https://gateway.pinata.cloud/ipfs/${url.replace("ipfs://", "")}`;
  }
  return url;
}

<img
  src={resolveIpfs(nft.url)}
  alt={nft.name}
  style={{ width: "100%", borderRadius: "12px" }}
/>








                )}

                <h3 style={{ margin: "0 0 8px 0" }}>{nft.name}</h3>
                <p style={{ margin: "0 0 8px 0" }}>{nft.description}</p>
                <small style={{ wordBreak: "break-all" }}>{nft.objectId}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
