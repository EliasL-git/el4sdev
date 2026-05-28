import React, { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../lib/useReducedMotion'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  const year = new Date().getFullYear()
  const [revealed, setRevealed] = useState(false)
  const slabRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = slabRef.current
    if (!node) return
    if (reduced) {
      setRevealed(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRevealed(true)
            obs.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [reduced])

  function nav(e, to) {
    e.preventDefault()
    window.navigate(to)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.topRule} aria-hidden="true" />

      <div className={styles.indexRow}>
        <div className={styles.col}>
          <span className={styles.label}>EL4S / VOL · IV · {year}</span>
          <p className={styles.tag}>Photographer · Actor · Developer.</p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <a href="/photography" onClick={(e) => nav(e, '/photography')} data-cursor="open">
            <span className={styles.linkNo}>01</span>
            <span>Photography</span>
          </a>
          <a href="/non-commercial" onClick={(e) => nav(e, '/non-commercial')} data-cursor="open">
            <span className={styles.linkNo}>02</span>
            <span>Non-commercial</span>
          </a>
          <a href="/freexyz" onClick={(e) => nav(e, '/freexyz')} data-cursor="open">
            <span className={styles.linkNo}>03</span>
            <span>Free .xyz</span>
          </a>
          <a href="mailto:el4s@el4s.dev" data-cursor="email">
            <span className={styles.linkNo}>→</span>
            <span>el4s@el4s.dev</span>
          </a>
        </nav>
      </div>

      <div
        ref={slabRef}
        className={`${styles.slab} ${revealed ? styles.revealed : ''}`}
        aria-hidden="true"
      >
        <span className={styles.slabText}>EL4S.</span>
      </div>

      <div className={styles.bottomRow}>
        <span className={styles.bottomMeta}>
          &copy; {year} EL4S · ALL RIGHTS RESERVED
        </span>
        <span className={styles.bottomMeta}>
          NO TRAINING · NO REUSE
        </span>
        <span className={styles.bottomMeta}>
          BUILT W/ CODE &amp; CAFFEINE
        </span>
      </div>
    </footer>
  )
}
