import { useState } from 'react'
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

  const { getToken } = useAuth();
  const { user } = useUser();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken({ template: 'integration' }).catch(() => null);

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (user && user.id) headers['x-user-id'] = user.id;

      const body = { title, description, location, anonymous };
      if (latitude != null) body.latitude = latitude;
      if (longitude != null) body.longitude = longitude;

      await axios.post(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/reports`,
        body,
        { headers }
      );
      setMessage('Report submitted — thank you.');
      setTitle('');
      setDescription('');
      setLocation('');
    } catch (err) {
      console.error(err);
      setMessage('Error submitting report');
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-2">Report an Incident</h2>
        <p className="text-sm text-slate-600 mb-4">You can submit anonymously. Allow location to attach approximate coordinates (optional).</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm p-3 focus:ring-2 focus:ring-primary/30" placeholder="Short title (e.g., Harassment on bus)" />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm p-3 focus:ring-2 focus:ring-primary/30" placeholder="Describe what happened, approximate time and any details that help responders" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Location (optional)</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Geolocation</label>
              <div className="mt-1 flex gap-2 items-center">
                <button type="button" onClick={() => {
                  if (!navigator.geolocation) return setMessage('Geolocation not supported');
                  navigator.geolocation.getCurrentPosition((pos) => {
                    setLatitude(pos.coords.latitude);
                    setLongitude(pos.coords.longitude);
                    setMessage('Location captured');
                  }, (err) => setMessage('Unable to get location'))
                }} className="btn btn-accent">📍 Capture my location</button>
                <div className="text-sm text-slate-600">{latitude && longitude ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'Not captured'}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="mr-2" />
              <span className="text-sm">Submit anonymously</span>
            </label>
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
