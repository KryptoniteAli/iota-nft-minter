import { ConnectButton, useCurrentAccount } from "@iota/dapp-kit";

export default function App() {
  const account = useCurrentAccount();

  function handleMint() {
    if (!account) {
      alert("Connect wallet first");
      return;
    }

    alert("Minting NFT from: " + account.address);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Kryptonite NFT Minter</h1>

      <ConnectButton />

      <p>Wallet:</p>
      <p>{account ? account.address : "Not connected"}</p>

      <button onClick={handleMint}>Mint NFT</button>
    </div>
  );
}
