import { ConnectButton, useCurrentAccount } from "@iota/dapp-kit";

export default function App() {
  const account = useCurrentAccount();

  function handleMint() {
    if (!account) {
      alert("Connect wallet first");
      return;
    }

    alert(`Ready to mint from: ${account.address}`);
  }

  return (
    <div style={{ padding: 30, background: "#fff", minHeight: "100vh", color: "#000" }}>
      <h1>Kryptonite NFT Minter</h1>
      <p>Wallet connection test.</p>

      <div style={{ marginBottom: 20 }}>
        <ConnectButton />
      </div>

      <p>{account ? account.address : "Not connected"}</p>

      <button onClick={handleMint}>Mint NFT</button>
    </div>
  );
}
