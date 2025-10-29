import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons when bundling
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/reports`)
        setReports(res.data || [])
      } catch (err) {
        console.error(err)
      } finally { setLoading(false) }
    }
    fetchReports()
  }, [])

  // Default center: try to center on the average of available coordinates
  const coords = reports.filter(r => r.latitude && r.longitude)
  const center = coords.length
    ? [coords.reduce((s, r) => s + r.latitude, 0) / coords.length, coords.reduce((s, r) => s + r.longitude, 0) / coords.length]
    : [0, 0]

  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Report Map</h2>
        <div className="text-sm text-gray-500">Showing {reports.length} reports</div>
      </header>

      {loading && <p className="text-gray-600">Loading map…</p>}

      <div className="h-[70vh] rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coords.map(r => (
            <Marker key={r._id} position={[r.latitude, r.longitude]}>
              <Popup>
                <div className="text-sm">
                  <strong className="block text-gray-800">{r.title}</strong>
                  <p className="text-gray-600 mt-1">{r.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Status: <span className="font-medium">{r.status}</span></p>
                  <p className="text-xs text-gray-500">{r.anonymous ? 'Anonymous' : 'Identified'}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  )
}
