import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const stepDefinitions = [
  {
    id: 'report',
    title: 'Report discreetly',
    details: 'Submit events anonymously or with saved credentials. Every report is timestamped, optionally geo-tagged, and stored so responders can triage quickly.',
    action: 'Report an incident',
  },
  {
    id: 'respond',
    title: 'Enable responders',
    details: 'Share sanitized summaries with trusted admins and community responders so they can verify, follow-up, and update status without compromising victims.',
    action: 'View admin workflow',
  },
  {
    id: 'insights',
    title: 'Visualize impact',
    details: 'The interactive map surfaces clusters, so advocates understand where to dispatch mobile clinics, safe housing, or legal aid.',
    action: 'Explore the map',
  },
]

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

export default function Home() {
  const navigate = useNavigate()
  const [selectedStepId, setSelectedStepId] = useState(stepDefinitions[0].id)
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  const selectedStep = useMemo(() => stepDefinitions.find((step) => step.id === selectedStepId) || stepDefinitions[0], [selectedStepId])

  useEffect(() => {
    let active = true
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/reports/summary`)
        if (!active) return
        setStats(res.data)
      } catch (error) {
        console.warn('Unable to load report summary', error)
      } finally {
        if (active) setStatsLoading(false)
      }
    }

    fetchSummary()
    return () => {
      active = false
    }
  }, [])

  function ActionButtons() {
    const handleNavigate = (e, path) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return
      e.preventDefault()
      navigate(path)
    }

    return (
      <>
        <Link
          to="/report"
          className="btn btn-primary"
          onClick={(e) => handleNavigate(e, '/report')}
        >
          📝 Report an Incident
        </Link>

        <Link
          to="/map"
          className="btn btn-accent"
          onClick={(e) => handleNavigate(e, '/map')}
        >
          🗺️ View the Map
        </Link>

        <Link to="/admin" className="btn btn-ghost">⚙️ Admin Dashboard</Link>
      </>
    )
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <section className="hero">
        <div className="gradient-blob" aria-hidden="true"></div>
        <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">GBV <span className="gradient-title">Reporting & Response</span></h1>
        <p className="subtitle mb-5">A privacy-first toolkit enabling survivors, allies, and responders to document events clearly, share essential context with trusted admins, and visualize emerging risks on a dynamic map.</p>

        <div className="flex flex-wrap gap-3 items-center">
          <ActionButtons />
        </div>

        <div className="badges">
          <span className="badge purple">Privacy-first</span>
          <span className="badge cyan">Geo-aware</span>
          <span className="badge soft">Supports SDG 5 &amp; 16</span>
        </div>
      </section>

      <section className="live-stats">
        <h2 className="text-lg font-semibold mb-3">Live report stats</h2>
        {statsLoading ? (
          <p className="text-sm text-slate-500">Loading totals…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="stat-card">
              <span className="stat-label">Total reports</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Open</span>
              <strong>{stats.open}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">In progress</span>
              <strong>{stats.in_progress}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Resolved</span>
              <strong>{stats.resolved}</strong>
            </div>
          </div>
        )}
      </section>

      <section className="feature-explorer bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="feature-grid">
            {stepDefinitions.map((step) => (
              <button
                key={step.id}
                type="button"
                className={`feature-card ${selectedStepId === step.id ? 'active' : ''}`}
                onClick={() => setSelectedStepId(step.id)}
              >
                <span className="feature-icon">{step.action === 'Report an incident' ? '📝' : step.action === 'View admin workflow' ? '📋' : '🗺️'}</span>
                <h3>{step.title}</h3>
                <p>{step.details}</p>
              </button>
            ))}
          </div>

          <div className="feature-detail">
            <p className="text-xs uppercase tracking-wide text-slate-400">How the platform works</p>
            <h3 className="text-2xl font-semibold mb-2">{selectedStep.title}</h3>
            <p className="text-slate-700 leading-relaxed">{selectedStep.details}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/report" className="btn btn-primary">Send report</Link>
              <Link to="/map" className="btn btn-accent">See insights</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-purpose grid gap-6 lg:grid-cols-[1.3fr_0.9fr] bg-slate-900 text-white rounded-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">What this site does</h2>
          <p className="text-slate-200">It collects well-structured incident reports, optionally captures safe locations, and surfaces them through admin dashboards so advocates can prioritize urgent responses.</p>
          <p className="text-slate-200">Every entry can be marked resolved, flagged for follow-up, and visualized on the shared map to spot emerging hotspots before they escalate.</p>
          <div className="focus-tabs">
            <button type="button" className="focus-pill">Track trends</button>
            <button type="button" className="focus-pill">Protect privacy</button>
            <button type="button" className="focus-pill">Coordinate care</button>
          </div>
        </div>
        <figure className="purpose-visual">
          <img src="https://images.unsplash.com/photo-1573166364524-6c8d5f1d0b0a?auto=format&fit=crop&w=900&q=60" alt="Community support network" />
          <figcaption>Stories from responders and survivors inform every feature.</figcaption>
        </figure>
      </section>

      <section className="support-gallery">
        <h2 className="text-2xl font-semibold mb-3">Team &amp; Community</h2>
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

      <footer className="mt-4 text-sm text-slate-500 text-center">Supports SDG 5 (Gender Equality) and SDG 16 (Peace, Justice &amp; Strong Institutions).</footer>
    </main>
  )
}
