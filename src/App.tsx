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
