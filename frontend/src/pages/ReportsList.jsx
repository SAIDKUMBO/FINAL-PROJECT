import { useEffect, useState } from 'react'
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
  const { getToken } = useAuth()

  const fetchReports = async () => {
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
  }

  useEffect(() => {
    if (!authorized) {
      setReports([])
      setLoading(false)
      return
    }

    fetchReports()
  }, [authorized])

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
      setCodeError('Invalid secret code')
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-500/30 p-6">
        <h2 className="text-xl font-semibold mb-2">Admin access</h2>
        <p className="text-sm text-gray-500 mb-4">Enter the secret admin code to unlock the dashboard.</p>
        {!authorized ? (
          <form className="flex flex-wrap gap-2" onSubmit={handleCodeSubmit}>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Secret code"
              className="px-3 py-2 border rounded-lg focus:outline-none"
            />
            <button type="submit" className="btn btn-primary">Unlock reports</button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-green-600">Admin access granted. Refreshing reports...</p>
        )}
        {codeError && <p className="mt-2 text-sm text-red-600">{codeError}</p>}
      </section>

      {authorized ? (
        loading ? (
          <p className="text-gray-600">Loading reports…</p>
        ) : (
          <>
            <header className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Reports</h2>
              <button onClick={fetchReports} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100">Refresh</button>
            </header>

            {reports.length === 0 && <p className="text-gray-500">No reports yet.</p>}

            <ul className="grid gap-4">
              {reports.map((r) => {
                const isExpanded = expandedReportId === r._id
                return (
                  <li key={r._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 hover:shadow-lg transition-transform duration-180 ease-in-out hover:-translate-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <button
                          type="button"
                          className="text-left w-full"
                          onClick={() => setExpandedReportId((prev) => (prev === r._id ? null : r._id))}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span className={`status-dot ${r.status}`} />
                            {r.title}{' '}
                            {r.anonymous && <span className="text-sm text-gray-400">(anonymous)</span>}
                          </h3>
                        </button>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{r.description}</p>
                        {r.location && <p className="mt-2 text-sm text-gray-500">Location: {r.location}</p>}
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
                        <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 bg-slate-50 dark:bg-gray-900/60 rounded-xl p-4 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Full details:</strong> {r.fullDetails || r.description}</p>
                        {r.latitude && r.longitude && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Coordinates: {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                          </p>
                        )}
                        <p className="text-sm text-slate-500 dark:text-slate-400">Submitted {r.anonymous ? 'anonymously' : 'with account'}</p>
                        {r.images && r.images.length > 0 && (
                          <div className="detail-images">
                            {r.images.map((image) => (
                              <figure key={image.name} className="detail-image-card">
                                <img src={image.data} alt={image.name} />
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
          </>
        )
      ) : (
        <p className="text-sm text-gray-500">Admin access is required to view reports.</p>
      )}
    </main>
  )
}
