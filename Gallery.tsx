import { useIotaClient } from '@iota/dapp-kit'
import { useQuery } from '@tanstack/react-query'
import { ipfsToHttp } from '../lib/pinata'

const PACKAGE_ID = '0x02bd1cad27faa2e5b757a199c579d7e128c5b725d976ceb37234e907b3a7f7a1'

interface NFTItem {
  objectId: string
  name: string
  description: string
  image_url: string
  metadata_url: string
}

// Decode vector<u8> stored as number array or Uint8Array back to string
function decodeField(val: unknown): string {
  if (typeof val === 'string') return val
  if (Array.isArray(val)) return new TextDecoder().decode(new Uint8Array(val))
  return ''
}

export default function Gallery({ address }: { address: string }) {
  const client = useIotaClient()

  const { data: nfts, isLoading, refetch } = useQuery({
    queryKey: ['nfts', address],
    queryFn: async (): Promise<NFTItem[]> => {
      const objects = await client.getOwnedObjects({
        owner: address,
        // Correct struct type matching your Move contract
        filter: { StructType: `${PACKAGE_ID}::kryptonite_nft::NFT` },
        options: { showContent: true },
      })

      return objects.data.flatMap(obj => {
        const content = obj.data?.content
        if (content?.dataType !== 'moveObject') return []
        const f = content.fields as any
        return [{
          objectId: obj.data!.objectId,
          name: decodeField(f.name),
          description: decodeField(f.description),
          image_url: decodeField(f.image_url),
          metadata_url: decodeField(f.metadata_url),
        }]
      })
    },
    refetchInterval: 8000,
  })

  return (
    <section className="gallery">
      <div className="gallery-header">
        <h2>Your NFTs</h2>
        <button onClick={() => refetch()} className="refresh-btn">Refresh</button>
      </div>

      {isLoading && <p className="gallery-loading">Loading your NFTs...</p>}

      {!isLoading && !nfts?.length && (
        <p className="gallery-empty">No NFTs yet — mint your first one above!</p>
      )}

      <div className="gallery-grid">
        {nfts?.map(nft => (
          <div className="nft-card" key={nft.objectId}>
            <img
              src={ipfsToHttp(nft.image_url)}
              alt={nft.name}
              onError={e => {
                (e.target as HTMLImageElement).src = '/placeholder.png'
              }}
            />
            <div className="nft-info">
              <h3>{nft.name}</h3>
              {nft.description && <p>{nft.description}</p>}
              <div className="nft-links">
                
                  href={`https://iotascan.com/mainnet/object/${nft.objectId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Object ↗
                </a>
                {nft.metadata_url && (
                  
                    href={ipfsToHttp(nft.metadata_url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Metadata ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
