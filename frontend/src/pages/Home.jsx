import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import heroImage from '../assets/image1.jpg.jpg'

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
    <main className="space-y-8">
      <section className="hero">
        <div className="hero-content">
          <div className="gradient-blob" aria-hidden="true"></div>
          <p className="eyebrow">Secure, survivor-centered data</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold">GBV <span className="gradient-title">Reporting & Response</span></h1>
          <p className="subtitle mb-5">A privacy-first toolkit enabling survivors, allies, and responders to document events clearly, share essential context with trusted admins, and visualize emerging risks on a dynamic map.</p>

          <div className="flex flex-wrap gap-3 items-center">
            <ActionButtons />
          </div>

          <div className="badges">
            <span className="badge purple">Privacy-first</span>
            <span className="badge cyan">Geo-aware</span>
            <span className="badge soft">Supports SDG 5 &amp; 16</span>
          </div>
        </div>

        <figure className="hero-visual">
          <img src={heroImage} alt="Illustration celebrating solidarity against gender-based violence" />
          <figcaption>Trusted partners validate every response, mirroring humanitarian field teams.</figcaption>
        </figure>
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

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-lg">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-slate-400 mb-2">What GBV really is</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Understanding the harm it causes</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <article className="space-y-2">
            <h3 className="text-lg font-semibold">It targets identity</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">Gender-based violence hinges on power imbalances and biases about gender or sexual identity, shaping how a survivor is perceived, shamed, or silenced.</p>
          </article>
          <article className="space-y-2">
            <h3 className="text-lg font-semibold">It shapes daily life</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">Victims may lose transportation, housing, jobs, or access to medical care because abusers control finances, movement, or internet connectivity.</p>
          </article>
          <article className="space-y-2">
            <h3 className="text-lg font-semibold">It leaves invisible wounds</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">Survivors experience trauma, stigma, and isolation even after immediate threats end, requiring trusted people and systems to rebuild security.</p>
          </article>
        </div>
        <p className="text-sm text-slate-500">Our platform helps document incidents safely so advocates can understand the full impact—physical, psychological, and structural—and deliver informed, timely support.</p>
      </section>

      <section className="feature-explorer">
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

      <footer className="mt-4 text-sm text-slate-500 text-center">
        <div>Supports SDG 5 (Gender Equality) and SDG 16 (Peace, Justice &amp; Strong Institutions).</div>
        <div className="mt-1">© {new Date().getFullYear()} Empowered Communities Initiative</div>
      </footer>
    </main>
  )
}
