import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const ADMIN_SECRET = '0000'

export default function ReportsList() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [expandedReportId, setExpandedReportId] = useState(null)
  const [modalImage, setModalImage] = useState(null)
  const { getToken } = useAuth()

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken({ template: 'integration' }).catch(() => null)
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/reports`, { headers })
      setReports(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    if (!authorized) {
      setReports([])
      setLoading(false)
      return
    }

    fetchReports()
  }, [authorized, fetchReports])

  const resolveReport = async (id) => {
    try {
      const token = await getToken({ template: 'integration' }).catch(() => null)
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await axios.patch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/reports/${id}`, { status: 'resolved' }, { headers })
      fetchReports()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    if (adminCode.trim() === ADMIN_SECRET) {
      setAuthorized(true)
      setCodeError('')
    } else {
      setAuthorized(false)
      setCodeError('❌ Invalid secret code. Please try again.')
      setAdminCode('')
    }
  }

  useEffect(() => {
    const original = document.body.style.overflow
    if (modalImage) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [modalImage])

  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-4xl space-y-6 flex flex-col items-center justify-center">
        {!authorized && (
          <section className="bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-800/60 shadow-2xl shadow-slate-950/40 p-6 text-center flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold mb-2 text-slate-100">Admin access</h2>
            <p className="text-sm text-slate-300 mb-4">Enter the secret admin code to unlock the dashboard.</p>
            <form className="flex flex-col items-center gap-3 w-full" onSubmit={handleCodeSubmit}>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Secret code"
                className="admin-code-input"
              />
              <button type="submit" className="btn btn-primary px-6 py-2">Unlock reports</button>
            </form>
            {codeError && <p className="mt-2 admin-error">{codeError}</p>}
          </section>
        )}

        {authorized ? (
          <div className="w-full flex flex-col items-center justify-center gap-6">
            {loading ? (
              <p className="text-slate-200">Loading reports…</p>
            ) : (
              <div className="w-full space-y-6">
                <header className="flex flex-col items-center justify-between gap-3 mb-6 lg:flex-row">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-slate-50">All Reports</h2>
                    <p className="text-xs text-slate-300 tracking-wide uppercase">Click the report title to view the full report.</p>
                  </div>
                  <button
                    onClick={fetchReports}
                    className="text-sm bg-slate-900/80 text-slate-100 px-3 py-1 rounded border border-slate-700 hover:bg-slate-900"
                  >
                    Refresh
                  </button>
                </header>

                {reports.length === 0 && <p className="text-slate-300">No reports yet.</p>}

                <ul className="grid gap-4 w-full reports-scroll">
                {reports.map((r) => {
                  const isExpanded = expandedReportId === r._id
                  return (
                    <li
                      key={r._id}
                      className="bg-slate-950 border border-slate-800 rounded-lg shadow-lg shadow-slate-950/40 p-4 transition-transform duration-180 ease-in-out hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <button
                            type="button"
                            className="text-left w-full"
                            onClick={() => setExpandedReportId((prev) => (prev === r._id ? null : r._id))}
                          >
                            <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                              <span className={`status-dot ${r.status}`} />
                              {r.title}{' '}
                              {r.anonymous && <span className="text-sm text-slate-200/80">(anonymous)</span>}
                            </h3>
                          </button>
                          <p className="mt-2 text-slate-100">{r.description}</p>
                          {r.location && <p className="mt-2 text-sm text-slate-300">Location: {r.location}</p>}
                        </div>

                        <div className="text-right">
                          <div className="mb-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                r.status === 'resolved'
                                  ? 'bg-green-100 text-green-800'
                                  : r.status === 'in_progress'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300">{new Date(r.createdAt).toLocaleString()}</div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 bg-slate-900/70 rounded-xl p-4 border border-slate-800 space-y-3">
                          <p className="text-sm text-slate-200"><strong>Full details:</strong> {r.fullDetails || r.description}</p>
                          {r.latitude && r.longitude && (
                            <p className="text-sm text-slate-300">
                              Coordinates: {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                            </p>
                          )}
                          <p className="text-sm text-slate-300">Submitted {r.anonymous ? 'anonymously' : 'with account'}</p>
                          {r.images && r.images.length > 0 && (
                            <div className="detail-images">
                              {r.images.map((image) => (
                                <figure key={image.name} className="detail-image-card">
                                  <img src={image.data} alt={image.name} onClick={() => setModalImage(image)} />
                                  <figcaption>{image.name}</figcaption>
                                </figure>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-end gap-2">
                        {r.status !== 'resolved' && (
                          <button onClick={() => resolveReport(r._id)} className="btn btn-accent">Mark resolved</button>
                        )}
                      </div>
                    </li>
                  )
                })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-300 text-center">Admin access is required to view reports.</p>
        )}
      </div>
        {modalImage && (
          <div className="modal-overlay" onClick={() => setModalImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="modal-close" onClick={() => setModalImage(null)}>×</button>
              <img src={modalImage.data} alt={modalImage.name} />
              <p className="text-xs text-white/80">{modalImage.name}</p>
            </div>
          </div>
        )}
    </main>
  )
}
