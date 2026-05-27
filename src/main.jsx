import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider, useApp } from './lib/AppContext'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import NonCommercial from './pages/NonCommercial'
import Photography from './pages/Photography'
import Freexyz from './pages/Freexyz'
import './styles/global.css'

function Router() {
  const { path } = useApp()
  if (path === '/photography') return <Photography />
  if (path === '/non-commercial') return <NonCommercial />
  if (path === '/freexyz') return <Freexyz />
  return <Home />
}

function App() {
  return (
    <AppProvider>
      <Loader />
      <Cursor />
      <PageTransition />
      <Router />
    </AppProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
