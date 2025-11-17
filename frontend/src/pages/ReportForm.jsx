import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/clerk-react'

export default function ReportForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [message, setMessage] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [imagePreviews, setImagePreviews] = useState([])

  const { getToken } = useAuth();
  const { user } = useUser();

  const submit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken({ template: 'integration' }).catch(() => null)

      const headers = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      if (user && user.id) headers['x-user-id'] = user.id

      const body = { title, description, location, anonymous }
      if (latitude != null) body.latitude = latitude
      if (longitude != null) body.longitude = longitude
      if (imagePreviews.length > 0) {
        body.images = imagePreviews.map((preview) => ({
          name: preview.name,
          data: preview.data,
        }))
      }

      await axios.post(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/reports`,
        body,
        { headers }
      )
      setMessage('Report submitted — thank you.')
      setTitle('')
      setDescription('')
      setLocation('')
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
      setImagePreviews([])
    } catch (err) {
      console.error(err)
      setMessage('Error submitting report')
    }
  }

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [imagePreviews])

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4)
    const previews = await Promise.all(files.map(async (file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      data: await toBase64(file),
    })))

    setImagePreviews((prev) => {
      prev.forEach((preview) => URL.revokeObjectURL(preview.url))
      return previews
    })
  }
  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-2">Report an Incident</h2>
        <p className="text-sm text-slate-600 mb-4">You can submit anonymously. Allow location to attach approximate coordinates (optional).</p>

        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col items-center">
            <label className="block text-lg font-semibold mb-4">Title of the incident</label>

            <div className="w-full flex justify-center">
              <div className="mx-auto w-[min(640px,80%)]">
                <div className="relative">
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-3xl opacity-90"></div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    aria-label="Incident title"
                    placeholder="Short title (e.g., Harassment on bus)"
                    style={{ paddingLeft: 72 }}
                    className="block mx-auto w-full h-28 text-center text-3xl p-6 rounded-3xl bg-gradient-to-r from-white to-indigo-50 border border-indigo-100 shadow-2xl placeholder:italic placeholder:text-2xl placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:shadow-2xl transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">Make it short and clear — this appears on the map and in the admin list.</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={8} className="mt-1 block w-full rounded-xl border border-transparent bg-white/80 shadow-inner-lg p-4 focus:ring-2 focus:ring-primary/40 placeholder:text-black" placeholder="Describe what happened, approximate time and any details that help responders" />
          </div>

          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium mb-3">Location (optional)</label>

            <div className="w-full flex justify-center">
              <div className="mx-auto w-[min(760px,90%)]">
                <div className="relative">
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-2xl opacity-90"></div>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="interactive-glow block mx-auto w-full h-16 text-center text-xl p-4 rounded-2xl bg-white border border-gray-200 shadow-md placeholder:italic placeholder:text-lg placeholder:text-slate-400 focus:outline-none transition-all duration-200"
                    placeholder="Location name or landmark (e.g., Central Station)"
                    style={{ paddingLeft: 56, paddingRight: 140 }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) return setMessage('Geolocation not supported');
                      navigator.geolocation.getCurrentPosition((pos) => {
                        setLatitude(pos.coords.latitude);
                        setLongitude(pos.coords.longitude);
                        setMessage('Location captured');
                        // optionally fill location string with coords
                        setLocation(prev => prev || `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
                      }, (err) => setMessage('Unable to get location'))
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-accent px-4 py-3 text-sm rounded-xl shadow"
                  >
                    � Use my location
                  </button>
                </div>

                <div className="mt-3 text-center text-sm text-slate-600">{latitude && longitude ? `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'Coordinates not captured'}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="mr-2" />
              <span className="text-sm">Submit anonymously</span>
            </label>
          </div>

          <div className="image-uploader">
            <label className="block text-sm font-medium mb-2">Attach photos (optional, max 4)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="image-upload-input" />

            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((preview) => (
                  <figure key={preview.url} className="image-preview-card">
                    <img src={preview.url} alt={`Preview of ${preview.name}`} loading="lazy" />
                    <figcaption>{preview.name}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>

          <div>
            <button type="submit" className="btn btn-primary">✅ Submit report</button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>
    </main>
  )
}
