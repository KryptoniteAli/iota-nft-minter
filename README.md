<h1 align="center">🚀 Kryptonite IOTA NFT Minter</h1>

<p align="center">
  A full-stack Web3 NFT minting dApp built on the IOTA blockchain  
</p>

<p align="center">
  <a href="https://kryptoniteminter.vercel.app">
    🔴 <b>Live Demo</b>
  </a> • 
  <a href="https://github.com/KryptoniteAli/iota-nft-minter">
    📂 <b>Source Code</b>
  </a>
</p>

---

## 🧠 Overview

Kryptonite NFT Minter is a **production-ready Web3 application** that allows users to:

- Connect their IOTA wallet
- Upload images to IPFS
- Generate NFT metadata
- Mint NFTs directly on-chain
- View NFTs inside the app

---

## ✨ Features

- 🔗 Wallet integration (Nightly Wallet)
- 🖼 IPFS image upload (Pinata)
- 📄 Dynamic metadata generation
- ⚡ Smart contract NFT minting (Move)
- 📦 NFT gallery UI
- 🔍 Transaction tracking (IOTAScan)
- 🌐 Fully deployed (Vercel)

---

## 🧱 Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | React + TypeScript + Vite |
| Blockchain   | IOTA Move |
| Wallet       | Nightly Wallet |
| Storage      | IPFS (Pinata) |
| Deployment   | Vercel |

---

## 🏗 Architecture

```text
User → React App → Pinata (IPFS)
                → IOTA Move Contract
                → Wallet (Sign Tx)


⚙️ Setup
1. Clone
git clone https://github.com/KryptoniteAli/iota-nft-minter.git
cd iota-nft-minter
2. Install
npm install
3. Environment

Create .env:

VITE_PINATA_JWT=your_pinata_jwt
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud
VITE_PACKAGE_ID=your_package_id
4. Run
npm run dev


🔄 Minting Flow
Connect wallet
Upload image → IPFS
Generate metadata
Call Move contract
Sign transaction
NFT minted on-chain
Display in UI

📄 Metadata Example
{
  "name": "Kryptonite NFT",
  "description": "First NFT on IOTA",
  "image": "https://gateway.pinata.cloud/ipfs/...",
  "attributes": [
    { "trait_type": "Collection", "value": "Kryptonite" },
    { "trait_type": "Network", "value": "IOTA" },
    { "trait_type": "Creator", "value": "KryptoniteAli" }
  ]
}


⚠️ Challenges Solved
❌ Wallet not rendering NFT → fixed metadata structure
❌ IPFS gateway errors (401/404) → switched gateway
❌ Git + deployment conflicts → resolved CI/CD flow
❌ Package ID mismatch → dynamic env config


🚀 Roadmap (Pro Version)
🔥 On-chain Display Standard
🧩 NFT Collections
🏪 Marketplace (Kiosk Standard)
📊 Analytics dashboard
⚡ Batch minting


📸 Screenshots

Add your screenshots here 👇

![App Screenshot](./assets/app.png)


👨‍💻 Author

KryptoniteAli
🔗 https://github.com/KryptoniteAli


⭐ Support

If this project helped you:

⭐ Star the repo
🚀 Fork & build
🧠 Learn Web3 with IOTA

🪪 License

MIT License
🔥 Built with passion on IOTA 🔥 


