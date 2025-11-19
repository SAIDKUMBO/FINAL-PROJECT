import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
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
import Purpose from './pages/Purpose'
import Donate from './pages/Donate'
import Community from './pages/Community'
import unityLogo from './assets/unity-against-gbv-logo.svg'
import './App.css'

function AdminSection() {
  return (
    <>
      <SignedIn>
        <ReportsList />
      </SignedIn>
      <SignedOut>
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Admin access required</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Please sign in before viewing the admin dashboard.</p>
            <OfflineAwareSignIn className="btn btn-primary">Sign in</OfflineAwareSignIn>
          </div>
        </main>
      </SignedOut>
    </>
  )
}

function OfflineAwareSignIn({ children, className, ...props }) {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    function onOnline() { setOnline(true); setShowNotice(false) }
    function onOffline() { setOnline(false) }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (online) {
    return (
      <SignInButton {...props} mode={props.mode || 'modal'} className={className}>{children}</SignInButton>
    )
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setShowNotice(true)}>{children}</button>
      {showNotice && (
        <div className="offline-modal" role="dialog" aria-modal="true">
          <div className="offline-modal-content">
            <h3 className="text-lg font-semibold">You appear to be offline</h3>
            <p className="text-sm mt-2">An internet connection is required to sign in. Please reconnect and try again.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button className="btn btn-primary" onClick={() => {
                if (navigator.onLine) {
                  setShowNotice(false)
                } else {
                  // trigger a short re-check
                  setTimeout(() => { if (navigator.onLine) setShowNotice(false) }, 700)
                }
              }}>Retry</button>
              <button className="btn btn-ghost" onClick={() => setShowNotice(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

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
      <div className="app-window">
        <div className="app-container">
          <header className="app-header">
        <div className="header-left" style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <Link to="/" className="logo" aria-label="Unity Against GBV">
            <img src={unityLogo} alt="Unity Against GBV logo" />
          </Link>
          <nav>
            <NavLink to="/" className={({ isActive }) => `btn btn-ghost nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
            <NavLink to="/report" className={({ isActive }) => `btn btn-ghost nav-link${isActive ? ' active' : ''}`}>Report</NavLink>
            <NavLink to="/map" className={({ isActive }) => `btn btn-ghost nav-link${isActive ? ' active' : ''}`}>Map</NavLink>
            <NavLink to="/admin" className={({ isActive }) => `btn btn-ghost nav-link${isActive ? ' active' : ''}`}>Admin</NavLink>
            <NavLink to="/purpose" className={({ isActive }) => `btn btn-ghost nav-link${isActive ? ' active' : ''}`}>What this site does</NavLink>
            <NavLink to="/donate" className={({ isActive }) => `btn btn-ghost nav-link${isActive ? ' active' : ''}`}>Donate now</NavLink>
            <NavLink to="/community" className={({ isActive }) => `btn btn-ghost nav-link${isActive ? ' active' : ''}`}>Team &amp; Community</NavLink>
          </nav>
        </div>

        <div className="auth-controls">
          <button
            type="button"
            className="theme-toggle btn-ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="5" />
                <g>
                  <line x1="12" y1="1.5" x2="12" y2="4.5" />
                  <line x1="12" y1="19.5" x2="12" y2="22.5" />
                  <line x1="1.5" y1="12" x2="4.5" y2="12" />
                  <line x1="19.5" y1="12" x2="22.5" y2="12" />
                  <line x1="4.25" y1="4.25" x2="6.75" y2="6.75" />
                  <line x1="17.25" y1="17.25" x2="19.75" y2="19.75" />
                  <line x1="4.25" y1="19.75" x2="6.75" y2="17.25" />
                  <line x1="17.25" y1="6.75" x2="19.75" y2="4.25" />
                </g>
              </svg>
            </span>
            <span className="sr-only">Toggle {nextTheme === 'dark' ? 'dark' : 'light'} mode</span>
          </button>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <OfflineAwareSignIn className="btn btn-ghost">Sign in</OfflineAwareSignIn>
          </SignedOut>
        </div>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<ReportForm />} />
              <Route path="/admin" element={<AdminSection />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/purpose" element={<Purpose />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
