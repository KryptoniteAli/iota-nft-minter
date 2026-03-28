type GalleryItem = {
  name: string;
  description: string;
  imageUrl: string;
  metadataUrl?: string;
  digest?: string;
};

type GalleryProps = {
  items: GalleryItem[];
};

export default function Gallery({ items }: GalleryProps) {
  return (
    <section>
      <h2>My Minted NFTs</h2>

      {items.length === 0 ? (
        <div>No minted NFTs yet.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item, index) => (
            <div
              key={`${item.digest ?? item.metadataUrl ?? item.name}-${index}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: 16,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div style={{ padding: 16 }}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div style={{ display: "grid", gap: 8 }}>
                  <a href={item.imageUrl} target="_blank" rel="noreferrer">
                    View Image
                  </a>

                  {item.metadataUrl && (
                    <a href={item.metadataUrl} target="_blank" rel="noreferrer">
                      View Metadata
                    </a>
                  )}

                  {item.digest && (
                    <a
                      href={`https://iotascan.com/tx/${item.digest}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Transaction
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
