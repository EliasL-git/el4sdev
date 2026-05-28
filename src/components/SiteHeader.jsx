import React, { useEffect, useState } from 'react'
import styles from './SiteHeader.module.css'

const SECTION_LABEL = {
  '/': 'INDEX · 00',
  '/photography': 'FRAMES · 01',
  '/non-commercial': 'LICENSE · 02',
  '/freexyz': 'GRANTS · 03',
}

export default function SiteHeader({ current }) {
  const [scrolled, setScrolled] = useState(false)
  const [now, setNow] = useState(() => fmtTime(new Date()))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(fmtTime(new Date())), 1000)
    return () => window.clearInterval(id)
  }, [])

  function nav(e, to) {
    e.preventDefault()
    window.navigate(to)
  }

  const sectionLabel = SECTION_LABEL[current] || `SEC · ${current?.replace(/^\//, '').toUpperCase()}`

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a
          href="/"
          className={styles.mark}
          onClick={(e) => nav(e, '/')}
          aria-label="el4s — home"
          data-cursor="home"
        >
          <span className={styles.markGlyph}>EL4S</span>
          <span className={styles.markSlash} aria-hidden="true">/</span>
          <span className={styles.markSection}>{sectionLabel}</span>
        </a>

        <div className={styles.meta} aria-hidden="true">
          <span className={styles.metaDot} />
          <span className={styles.metaTime}>{now}</span>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <a
            href="/photography"
            className={`${styles.link} ${current === '/photography' ? styles.active : ''}`}
            onClick={(e) => nav(e, '/photography')}
            data-cursor="open"
          >
            <span className={styles.linkNo}>01</span>
            <span className={styles.linkLabel}>Photography</span>
          </a>
          <a
            href="/non-commercial"
            className={`${styles.link} ${current === '/non-commercial' ? styles.active : ''}`}
            onClick={(e) => nav(e, '/non-commercial')}
            data-cursor="open"
          >
            <span className={styles.linkNo}>02</span>
            <span className={styles.linkLabel}>Non-commercial</span>
          </a>
          <a
            href="mailto:el4s@el4s.dev"
            className={`${styles.link} ${styles.linkCta}`}
            data-cursor="email"
          >
            <span className={styles.linkNo}>→</span>
            <span className={styles.linkLabel}>Contact</span>
          </a>
        </nav>
      </div>
      <div className={styles.rule} aria-hidden="true" />
    </header>
  )
}

function fmtTime(d) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}
