import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <section className="hero">
        <div className="gradient-blob" aria-hidden="true"></div>
        <h1 className="text-3xl font-extrabold mb-2">GBV <span style={{background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', WebkitBackgroundClip:'text', color:'transparent'}}>Reporting & Support</span></h1>
        <p className="subtitle mb-4">A privacy-first prototype for reporting and responding to gender-based violence (GBV). Sign in to save reports under your account, or submit anonymously to protect your identity.</p>

        <div className="flex flex-wrap gap-3 items-center">
          <Link to="/report" className="btn btn-primary">📝 Report an Incident</Link>
          <Link to="/map" className="btn btn-accent">🗺️ View Map</Link>
          <Link to="/admin" className="btn btn-ghost">⚙️ Admin Dashboard</Link>
        </div>

        <div className="badges">
          <span className="badge purple">Privacy-first</span>
          <span className="badge cyan">Geo-aware</span>
          <span className="badge soft">Supports SDG 5 & 16</span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold mb-2">Privacy & Safety</h2>
          <p className="text-slate-700">You may submit reports anonymously. Location is optional and used only to help responders locate incidents. This prototype uses Clerk for authentication; for production, enable server-side token verification and strong data protections.</p>
        </div>

        <aside className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-2">Emergency</h3>
          <p className="text-slate-700">If you are in immediate danger, contact local emergency services first.</p>
        </aside>
      </div>

      <footer className="mt-6 text-sm text-slate-500">Supports SDG 5 (Gender Equality) and SDG 16 (Peace, Justice & Strong Institutions).</footer>
    </main>
  )
}
