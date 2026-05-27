import React, { createContext, useContext, useEffect, useState } from 'react'

// Single shared state for the app shell:
//   - ready:         the intro Loader has finished
//   - transitioning: a SPA route transition sheet is currently sweeping in
//   - path:          current route (drives the lightweight router)
//   - navigate(to):  triggers a sheet, then commits the route change
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [path, setPath] = useState(() =>
    typeof location !== 'undefined' ? location.pathname : '/'
  )
  const [transitioning, setTransitioning] = useState(false)

  // History sync — back/forward buttons.
  useEffect(() => {
    const onPop = () => {
      setPath(location.pathname)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // navigate() — slide a sheet over the page, swap the route halfway, then
  // lift the sheet so the new page is revealed underneath.
  function navigate(to) {
    if (!to || to === location.pathname) return
    setTransitioning(true)
    window.setTimeout(() => {
      history.pushState({}, '', to)
      setPath(to)
      window.scrollTo({ top: 0, behavior: 'auto' })
      window.setTimeout(() => setTransitioning(false), 60)
    }, 520)
  }

  // Back-compat: keep window.navigate working so existing call sites
  // (Hero, SiteHeader, etc.) don't need to change.
  useEffect(() => {
    window.navigate = navigate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = { ready, setReady, path, navigate, transitioning }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
