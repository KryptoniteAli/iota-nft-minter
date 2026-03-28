const JWT = import.meta.env.VITE_PINATA_JWT
const GATEWAY = import.meta.env.VITE_PINATA_GATEWAY ?? 'https://gateway.pinata.cloud'

export async function uploadImageToPinata(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('name', file.name)
  formData.append('network', 'public')

  const res = await fetch('https://uploads.pinata.cloud/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Pinata image upload failed: ${err}`)
  }

  const data = await res.json()
  const cid = data.data?.cid
  if (!cid) throw new Error('No CID returned from Pinata')
  return `ipfs://${cid}`
}

export async function uploadMetadataToPinata(metadata: object): Promise<string> {
  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  const formData = new FormData()
  formData.append('file', blob, 'metadata.json')
  formData.append('name', 'nft-metadata.json')
  formData.append('network', 'public')

  const res = await fetch('https://uploads.pinata.cloud/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Pinata metadata upload failed: ${err}`)
  }

  const data = await res.json()
  const cid = data.data?.cid
  if (!cid) throw new Error('No CID returned from Pinata')
  return `ipfs://${cid}`
}

export function ipfsToHttp(uri: string): string {
  if (uri.startsWith('ipfs://')) {
    return `${GATEWAY}/ipfs/${uri.slice(7)}`
  }
  return uri
}
