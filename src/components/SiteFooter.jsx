import React from 'react'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  function nav(e, to) {
    e.preventDefault()
    window.navigate(to)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <span className={styles.mark}>
            <span className={styles.markGlyph}>el4s</span>
            <span className={styles.markDot} aria-hidden="true" />
          </span>
          <p className={styles.tag}>
            Photographer · Actor · Developer
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <a href="/photography" onClick={(e) => nav(e, '/photography')}>Photography</a>
          <a href="/non-commercial" onClick={(e) => nav(e, '/non-commercial')}>Non-commercial</a>
          <a href="mailto:hello@el4s.dev">hello@el4s.dev</a>
        </nav>

        <p className={styles.meta}>
          &copy; {year} el4s. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
