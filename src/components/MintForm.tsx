import { useState } from 'react'
import { useSignAndExecuteTransaction } from '@iota/dapp-kit'
import { Transaction } from '@iota/iota-sdk/transactions'
import { uploadImageToPinata, uploadMetadataToPinata } from '../lib/pinata'

const PACKAGE_ID = '0x02bd1cad27faa2e5b757a199c579d7e128c5b725d976ceb37234e907b3a7f7a1'

type Status = 'idle' | 'uploading-image' | 'uploading-metadata' | 'minting' | 'success' | 'error'

export default function MintForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [txDigest, setTxDigest] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleMint = async () => {
    if (!file || !name) return
    setError(null)
    try {
      // 1. Upload image
      setStatus('uploading-image')
      const imageUri = await uploadImageToPinata(file)

      // 2. Upload metadata
      setStatus('uploading-metadata')
      const metadataUri = await uploadMetadataToPinata({
        name,
        description,
        image: imageUri,
      })

      // 3. Build transaction
      setStatus('minting')
      const tx = new Transaction()
      tx.moveCall({
        target: `${PACKAGE_ID}::kryptonite_nft::mint`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(metadataUri),
        ],
      })

      const result = await signAndExecute({ transaction: tx })
      setTxDigest(result.digest)
      setStatus('success')
      setName('')
      setDescription('')
      setFile(null)
      setPreview(null)
    } catch (e: any) {
      setError(e.message ?? 'Unknown error')
      setStatus('error')
    }
  }

  const statusLabel: Record<Status, string> = {
    idle: 'Mint NFT',
    'uploading-image': 'Uploading image to IPFS...',
    'uploading-metadata': 'Uploading metadata to IPFS...',
    minting: 'Minting on IOTA...',
    success: 'Minted!',
    error: 'Try again',
  }

  return (
    <div className="mint-form">
      <h2>Mint a new NFT</h2>
      <div className="form-group">
        <label>Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="My NFT" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your NFT..." />
      </div>
      <div className="form-group">
        <label>Image *</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="preview" className="preview-img" />}
      </div>
      {error && <p className="error">{error}</p>}
      {status === 'success' && txDigest && (
        <p className="success">
          Minted!{' '}
          <a href={`https://iotascan.com/mainnet/tx/${txDigest}`} target="_blank" rel="noreferrer">
            View on explorer ↗
          </a>
        </p>
      )}
      <button
        onClick={handleMint}
        disabled={!file || !name || (status !== 'idle' && status !== 'error' && status !== 'success')}
      >
        {statusLabel[status]}
      </button>
    </div>
  )
}
