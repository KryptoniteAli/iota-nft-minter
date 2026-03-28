# 🚀 Kryptonite IOTA NFT Minter

![IOTA](https://img.shields.io/badge/IOTA-Mainnet-blue)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB)
![IPFS](https://img.shields.io/badge/IPFS-Pinata-green)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack Web3 dApp that enables users to mint NFTs on the **IOTA blockchain**, using **Move smart contracts, IPFS storage, and a modern React frontend**.

---

## 🌐 Live App
👉 https://kryptoniteminter.vercel.app  

---

## 🎯 What This Project Proves

✔ End-to-end Web3 development  
✔ Smart contract deployment (Move / IOTA)  
✔ Wallet integration (Nightly)  
✔ Decentralized storage (IPFS)  
✔ Production deployment (Vercel)  

---

## ✨ Core Features

- 🔗 Wallet connection (IOTA Nightly)
- 🖼 Image upload → IPFS (Pinata)
- 📄 Metadata generation (wallet-ready)
- ⚡ On-chain NFT minting
- 📦 NFT gallery display
- 🔍 Transaction tracking (IOTAScan)
- 🧩 Modular architecture (frontend + Move)

---

## 🧱 Architecture



---

## 🛠 Tech Stack

### Frontend
- React + TypeScript
- Vite
- IOTA dApp Kit
- TanStack Query

### Blockchain
- IOTA Move
- Smart Contracts (NFT minting)

### Storage
- IPFS via Pinata

### Deployment
- Vercel

---

## 📂 Project Structure


---

## ⚙️ Setup

### Clone


### Install


### Environment

Create `.env`:


### Run


---

## 🔄 Minting Flow

1. Connect wallet  
2. Upload image → IPFS  
3. Generate metadata JSON  
4. Call Move contract  
5. Sign transaction  
6. NFT minted on-chain  
7. Display in UI  

---

## 📄 Metadata Standard

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://gateway.pinata.cloud/ipfs/...",
  "attributes": [
    { "trait_type": "Collection", "value": "Kryptonite NFT" },
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

👨‍💻 Author

KryptoniteAli
https://github.com/KryptoniteAli

⭐ Support

If this helped you:

⭐ Star the repo
🚀 Fork & build
🧠 Learn Web3 with IOTA
