import mapInsights from '../assets/map-insights.svg'

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60',
    caption: 'Trusted local advocates',
  },
  {
    url: mapInsights,
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
        <p className="text-slate-600 mb-4">Local health workers, lawyers, and volunteer advocates rely on the insights this platform unlocks. We are trying to make the world a better place to exist. Don't hesitate to report any incident for quick and immediate action.</p>
        <p>Let's collectively bring an end to Gender Based Violence🤝</p>
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
