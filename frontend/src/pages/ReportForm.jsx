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
      setMessage('Report submitted succesfully— thank you😊👌.')
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
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 report-card">
        <h2 className="text-2xl font-bold mb-2">Report an Incident</h2>
        <p className="text-sm text-slate-600 mb-4">You can submit anonymously. Allow location to attach approximate coordinates (optional).</p>

        <form onSubmit={submit} className="report-form space-y-6">
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
                    className="report-title-input"
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">Make it short and clear — this appears on the map and in the admin list.</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={10} className="report-textarea" placeholder="Describe what happened, approximate time and any details that help responders" />
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
                    className="report-location-input"
                    placeholder="Location name or landmark (e.g., Central Station)"
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
                    � Use my location📍
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

          <div className="text-center">
            <button type="submit" className="btn btn-primary">✅ Submit report</button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 report-message">{message}</p>}
      </div>
    </main>
  )
}
