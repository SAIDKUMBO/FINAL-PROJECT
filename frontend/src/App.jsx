import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
import Home from './pages/Home'
import ReportForm from './pages/ReportForm'
import ReportsList from './pages/ReportsList'
import MapView from './pages/MapView'
import './App.css'

function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    try {
      window.localStorage.setItem('theme', theme)
    } catch (error) {
      console.warn('Unable to persist theme preference:', error.message)
    }
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="header-left" style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <Link to="/" className="logo" aria-label="GBV app">
            <span className="logo-mark" aria-hidden></span>
          </Link>
          <nav>
            <Link to="/" className="btn btn-ghost">Home</Link>
            <Link to="/report" className="btn btn-ghost">Report</Link>
            <Link to="/map" className="btn btn-ghost">Map</Link>
            <Link to="/admin" className="btn btn-ghost">Admin</Link>
          </nav>
        </div>

        <div className="auth-controls">
          <button
            type="button"
            className="theme-toggle btn-ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/admin" element={<ReportsList />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
