import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function ReportsList() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => { fetchReports() }, [])

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

  if (loading) return (
    <div className="max-w-4xl mx-auto p-6">
      <p className="text-gray-600">Loading reports…</p>
    </div>
  )

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Reports</h2>
        <button onClick={fetchReports} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100">Refresh</button>
      </header>

      {reports.length === 0 && <p className="text-gray-500">No reports yet.</p>}

      <ul className="grid gap-4">
        {reports.map(r => (
          <li key={r._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 hover:shadow-lg transition-transform duration-180 ease-in-out hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  <span className={`status-dot ${r.status}`} />
                  {r.title} {r.anonymous ? <span className="text-sm text-gray-400">(anonymous)</span> : null}
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{r.description}</p>
                {r.location && <p className="mt-2 text-sm text-gray-500">Location: {r.location}</p>}
              </div>

              <div className="text-right">
                <div className="mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${r.status === 'resolved' ? 'bg-green-100 text-green-800' : r.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {r.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              {r.status !== 'resolved' && (
                <button onClick={() => resolveReport(r._id)} className="btn btn-accent">Mark resolved</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
