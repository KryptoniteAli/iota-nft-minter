const GATEWAY = import.meta.env.VITE_PINATA_GATEWAY ?? 'https://gateway.pinata.cloud'

// Upload image file → returns ipfs:// URI
export async function uploadImageToPinata(file: File): Promise<string> {
  const jwt = import.meta.env.VITE_PINATA_JWT
  const formData = new FormData()
  formData.append('file', file)
  formData.append('pinataMetadata', JSON.stringify({ name: file.name }))

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  })
  if (!res.ok) throw new Error(`Pinata image upload failed: ${res.statusText}`)
  const { IpfsHash } = await res.json()
  return `ipfs://${IpfsHash}`
}

// Upload JSON metadata → returns ipfs:// URI
export async function uploadMetadataToPinata(metadata: object): Promise<string> {
  const jwt = import.meta.env.VITE_PINATA_JWT
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pinataContent: metadata, pinataMetadata: { name: 'nft-metadata.json' } }),
  })
  if (!res.ok) throw new Error(`Pinata metadata upload failed: ${res.statusText}`)
  const { IpfsHash } = await res.json()
  return `ipfs://${IpfsHash}`
}

// Resolve ipfs:// to a gateway URL for display
export function ipfsToHttp(uri: string): string {
  if (uri.startsWith('ipfs://')) {
    return `${GATEWAY}/ipfs/${uri.slice(7)}`
  }
  return uri
}
