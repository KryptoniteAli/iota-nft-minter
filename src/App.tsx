import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction
} from "@iota/dapp-kit";

import { Transaction } from "@iota/iota-sdk/transactions";

export default function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  function mintNFT() {
    if (!account) {
      alert("Connect wallet first");
      return;
    }

    const tx = new Transaction();

    tx.moveCall({
      target: "0x2::nft::mint",
      arguments: [
        tx.pure.string("Kryptonite NFT"),
        tx.pure.string("Minted from Kryptonite Minter"),
        tx.pure.string("https://placekitten.com/400/400")
      ]
    });

    signAndExecute({
      transaction: tx
    });
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Kryptonite NFT Minter</h1>

      <ConnectButton />

      <p>{account ? account.address : "Not connected"}</p>

      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
}
