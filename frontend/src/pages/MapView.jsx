import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { GoogleMap, Marker as GMarker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'

// Leaflet fallback (free, OpenStreetMap tiles)
import { MapContainer, TileLayer, Marker as LMarker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default icon URLs when bundling Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const containerStyle = { width: '100%', height: '100%' }

export default function MapView() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)
  const [satellite, setSatellite] = useState(false)

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

  const coords = useMemo(
    () => reports.filter((r) => typeof r.latitude === 'number' && typeof r.longitude === 'number'),
    [reports]
  )

  const center = useMemo(() => {
    if (!coords.length) {
      return { lat: 39.8283, lng: -98.5795 }
    }

    const totalLat = coords.reduce((sum, report) => sum + report.latitude, 0)
    const totalLng = coords.reduce((sum, report) => sum + report.longitude, 0)

    return {
      lat: totalLat / coords.length,
      lng: totalLng / coords.length,
    }
  }, [coords])

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    id: 'report-map',
  })

  return (
    <main className="w-full max-w-[1200px] mx-auto p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Report Map</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">Showing {reports.length} reports</div>
          <button
            type="button"
            className="px-3 py-1 text-sm rounded-md border bg-white shadow-sm hover:bg-gray-50"
            onClick={() => setSatellite((s) => !s)}
            aria-pressed={satellite}
            aria-label="Toggle satellite view"
          >
            {satellite ? 'Satellite' : 'Map'}
          </button>
        </div>
      </header>

      {loading && <p className="text-gray-600">Loading map…</p>}

      <div className="map-panel h-[70vh] rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-gray-50">
        {apiKey ? (
          !isLoaded ? (
            <div className="w-full h-full flex items-center justify-center">Loading map…</div>
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={coords.length ? 12 : 2}
              options={{ mapTypeId: satellite ? 'satellite' : 'roadmap' }}
            >
              {coords.map((r) => (
                <GMarker key={r._id} position={{ lat: r.latitude, lng: r.longitude }} onClick={() => setActive(r)} />
              ))}

              {active && (
                <InfoWindow position={{ lat: active.latitude, lng: active.longitude }} onCloseClick={() => setActive(null)}>
                  <div style={{ maxWidth: 260 }}>
                    <strong>{active.title}</strong>
                    <p style={{ margin: '6px 0' }}>{active.description}</p>
                    <p style={{ fontSize: 12, color: '#475569' }}>Status: {active.status}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )
        ) : (
          <MapContainer center={[center.lat, center.lng]} zoom={coords.length ? 13 : 2} style={{ height: '100%', width: '100%' }}>
            {satellite ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
              />
            ) : (
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            )}

            {coords.map((r) => (
              <LMarker key={r._id} position={[r.latitude, r.longitude]} eventHandlers={{ click: () => setActive(r) }}>
                <Popup>
                  <div className="text-sm">
                    <strong className="block text-gray-800">{r.title}</strong>
                    <p className="text-gray-600 mt-1">{r.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Status: <span className="font-medium">{r.status}</span></p>
                    <p className="text-xs text-gray-500">{r.anonymous ? 'Anonymous' : 'Identified'}</p>
                  </div>
                </Popup>
              </LMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </main>
  )
}
