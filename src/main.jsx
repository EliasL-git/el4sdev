import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/Home'
import NonCommercial from './pages/NonCommercial'
import Photography from './pages/Photography'
import Freexyz from './pages/Freexyz'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import './styles/global.css'

function Router() {
  const [path, setPath] = useState(location.pathname)

  useEffect(() => {
    const onPop = () => {
      setPath(location.pathname)
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
    window.addEventListener('popstate', onPop)
    window.navigate = (to) => {
      if (to === location.pathname) return
      history.pushState({}, '', to)
      setPath(to)
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Blog post route: /blog/:slug
  const blogPostMatch = path.match(/^\/blog\/([^/]+)$/)
  if (blogPostMatch) return <BlogPost slug={blogPostMatch[1]} />
  if (path === '/blog') return <Blog />
  if (path === '/photography') return <Photography />
  if (path === '/non-commercial') return <NonCommercial />
  if (path === '/freexyz') return <Freexyz />
  return <Home />
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
