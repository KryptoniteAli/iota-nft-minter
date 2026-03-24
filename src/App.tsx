import React, { useState } from 'react';
import axios from 'axios';

const NFTMinter = () => {
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState({
        name: '',
        description: '',
        image: '',
        attributes: [],
        displayProperties: {},
    });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleMetadataChange = (e) => {
        const { name, value } = e.target;
        setMetadata({ ...metadata, [name]: value });
    };

    const uploadToPinata = async () => {
        const formData = new FormData();
        formData.append('file', file);

        // Pinata API endpoint and key
        const PINATA_API_KEY = 'YOUR_PINATA_API_KEY';
        const PINATA_SECRET_API_KEY = 'YOUR_PINATA_SECRET_API_KEY';

        try {
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                maxBodyLength: 'Infinity', 
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_API_KEY,
                },
            });
            return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        } catch (error) {
            console.error('Error uploading file:', error);
            return '';
        }
    };

    const mintNFT = async () => {
        const imageUrl = await uploadToPinata();
        const nftMetadata = { ...metadata, image: imageUrl };

        // Logic for Minting on Nightly Wallet or IOTA Wallet goes here
        console.log('Minting NFT with metadata:', nftMetadata);
        // You would replace this log with actual transaction logic
    };

    return (
        <div>
            <h1>Mint Your NFT</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <input type="text" name="name" placeholder="NFT Name" onChange={handleMetadataChange} />
            <input type="text" name="description" placeholder="Description" onChange={handleMetadataChange} />
            {/* Additional fields for attributes and display properties should be added here */}
            <button onClick={mintNFT}>Mint NFT</button>
        </div>
    );
};

export default NFTMinter;


// Add this helper function at the top
function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const types: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
  };
  return types[ext || ''] || 'image/jpeg';
}

// Update the handleMint function - replace lines 193-198 with:
setStatus("Creating metadata...");
const mimeType = getMimeType(file.name);
const imageCid = uploadedImage.cid; // Make sure you extract this

const metadata = {
  // Core metadata fields (required)
  name: name.trim(),
  description: description.trim(),
  image: imageGatewayUrl,
  
  // IPFS direct URI (some wallets prefer this)
  image_ipfs: `ipfs://${imageCid}`,
  
  // For Nightly Wallet
  properties: {
    creator: "Kryptonite",
    network: "IOTA Mainnet",
    mimeType: mimeType,
  },
  
  // For IOTA Wallet  
  display: {
    width: 512,
    height: 512,
    background_color: "#FFFFFF",
  },
  
  // Attributes (both wallets)
  attributes: [
    { trait_type: "Creator", value: "Kryptonite" },
    { trait_type: "Network", value: "IOTA Mainnet" },
    { trait_type: "Image Format", value: mimeType },
  ],
  
  // Additional
  external_url: "https://iotascan.com/mainnet",
  animation_url: imageGatewayUrl,
};
