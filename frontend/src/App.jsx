import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import Home from './pages/Home'
import ReportForm from './pages/ReportForm'
import ReportsList from './pages/ReportsList'
import MapView from './pages/MapView'
import './App.css'

function App() {
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
