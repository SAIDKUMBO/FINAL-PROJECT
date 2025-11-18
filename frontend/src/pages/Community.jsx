const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60',
    caption: 'Trusted local advocates',
  },
  {
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=60',
    caption: 'Map-based insights',
  },
  {
    url: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=800&q=60',
    caption: 'Secure reporting portals',
  },
]

export default function Community() {
  return (
    <main className="space-y-8">
      <section className="support-gallery">
        <h1 className="text-3xl font-semibold mb-2">Team &amp; Community</h1>
        <p className="text-slate-600 mb-4">Local health workers, lawyers, and volunteer advocates rely on the insights this platform unlocks. Here are a few faces behind the response.</p>
        <div className="gallery-grid">
          {galleryImages.map((item) => (
            <figure key={item.url} className="support-card">
              <img src={item.url} alt={item.caption} />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
