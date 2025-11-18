import IllustrationPurpose from '../assets/image2.jpg.jpg'

export default function Purpose() {
  return (
    <main className="space-y-8">
      <section className="site-purpose grid gap-6 lg:grid-cols-[1.3fr_0.9fr] rounded-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">What this site does</h1>
          <p className="text-slate-200">It collects well-structured incident reports, optionally captures safe locations, and surfaces them through admin dashboards so advocates can prioritize urgent responses.</p>
          <p className="text-slate-200">Every entry can be marked resolved, flagged for follow-up, and visualized on the shared map to spot emerging hotspots before they escalate.</p>
          <div className="focus-tabs">
            <button type="button" className="focus-pill">Track trends</button>
            <button type="button" className="focus-pill">Protect privacy</button>
            <button type="button" className="focus-pill">Coordinate care</button>
          </div>
        </div>
        <figure className="purpose-visual">
          <img src={IllustrationPurpose} alt="Portrait of a survivor advocate in vivid tones" />
          <figcaption>Stories from responders and survivors inform every feature.</figcaption>
        </figure>
      </section>
    </main>
  )
}
