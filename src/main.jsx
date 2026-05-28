import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/Home'
import NonCommercial from './pages/NonCommercial'
import Photography from './pages/Photography'
import Freexyz from './pages/Freexyz'
import CrosshairCursor from './components/CrosshairCursor'
import IntroSlam from './components/IntroSlam'
import PageTransitionSlam from './components/PageTransitionSlam'
import AudioToggle from './components/AudioToggle'
import './styles/global.css'

/**
 * Module-level raw navigator. Exposed on window so PageTransitionSlam
 * can wrap it before Router's effect runs (effects fire child-first,
 * which would otherwise leave `window.__el4sNav` undefined when the
 * wrapper installs itself).
 */
let _setPath = null

function rawNav(to) {
  if (typeof window === 'undefined') return
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  if (_setPath) _setPath(to)
  window.scrollTo({
    top: 0,
    behavior: 'instant' in window ? 'instant' : 'auto',
  })
}

if (typeof window !== 'undefined') {
  window.__el4sNav = rawNav
  // Default: direct navigation. PageTransitionSlam replaces this with
  // an animated wrapper once it mounts.
  if (typeof window.navigate !== 'function') {
    window.navigate = rawNav
  }
}

function Router() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  )

  useEffect(() => {
    _setPath = setPath
    const onPop = () => {
      setPath(window.location.pathname)
      window.scrollTo({
        top: 0,
        behavior: 'instant' in window ? 'instant' : 'auto',
      })
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      _setPath = null
    }
  }, [])

  let page
  if (path === '/photography') page = <Photography />
  else if (path === '/non-commercial') page = <NonCommercial />
  else if (path === '/freexyz') page = <Freexyz />
  else page = <Home />

  return (
    <>
      {page}
      <PageTransitionSlam onNavigate={rawNav} />
      <CrosshairCursor />
      <AudioToggle />
      <IntroSlam />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
