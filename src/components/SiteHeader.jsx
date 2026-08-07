import React, { useEffect, useState } from 'react'
import styles from './SiteHeader.module.css'

export default function SiteHeader({ current }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function nav(e, to) {
    e.preventDefault()
    window.navigate(to)
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a
          href="/"
          className={styles.mark}
          onClick={(e) => nav(e, '/')}
          aria-label="el4s — home"
        >
          <span className={styles.markGlyph}>el4s</span>
          <span className={styles.markDot} aria-hidden="true" />
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <a
            href="/blog"
            className={`${styles.link} ${current && current.startsWith('/blog') ? styles.active : ''}`}
            onClick={(e) => nav(e, '/blog')}
          >
            Blog
          </a>
          <a
            href="/photography"
            className={`${styles.link} ${current === '/photography' ? styles.active : ''}`}
            onClick={(e) => nav(e, '/photography')}
          >
            Photography
          </a>
          <a
            href="/non-commercial"
            className={`${styles.link} ${current === '/non-commercial' ? styles.active : ''}`}
            onClick={(e) => nav(e, '/non-commercial')}
          >
            Non-commercial
          </a>
          <a
            href="mailto:el4s@el4s.dev"
            className={`${styles.link} ${styles.linkCta}`}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  )
}
