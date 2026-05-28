import React, { useEffect, useRef, useState } from 'react'
import ShaderCanvas from './ShaderCanvas'
import GlitchText from './GlitchText'
import { featured } from '../lib/photos'
import useIsTouch from '../lib/useIsTouch'
import useReducedMotion from '../lib/useReducedMotion'
import { clack } from '../lib/audio'
import styles from './Hero.module.css'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 40)
    return () => window.clearTimeout(t)
  }, [])

  // Magnetic primary button
  useEffect(() => {
    if (isTouch || reduced) return
    const btn = buttonRef.current
    if (!btn) return
    const strength = 18
    function onMove(e) {
      const r = btn.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const radius = Math.max(r.width, r.height) * 0.9
      if (dist < radius) {
        const k = (1 - dist / radius) * strength
        btn.style.transform = `translate(${(dx / radius) * k}px, ${(dy / radius) * k}px)`
      } else {
        btn.style.transform = 'translate(0, 0)'
      }
    }
    function onLeave() {
      btn.style.transform = 'translate(0, 0)'
    }
    window.addEventListener('pointermove', onMove)
    btn.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      btn.removeEventListener('pointerleave', onLeave)
    }
  }, [isTouch, reduced])

  function nav(e, to) {
    e.preventDefault()
    clack({ frequency: 320, duration: 0.05, gain: 0.07 })
    window.navigate(to)
  }

  const featureName = featured ? featured.name.replace(/\.[A-Z]+$/i, '') : ''

  return (
    <section className={`${styles.hero} ${mounted ? styles.in : ''}`}>
      {/* Top scaffolding row — debug-style labels */}
      <div className={styles.scaffold}>
        <span className={styles.scaffoldLabel}>PORTFOLIO / 2026 / VOL · IV</span>
        <span className={styles.scaffoldSep} aria-hidden="true">—</span>
        <span className={styles.scaffoldLabel}>EL4S.DEV · INDEX 00</span>
        <span className={styles.scaffoldSep} aria-hidden="true">—</span>
        <span className={`${styles.scaffoldLabel} ${styles.scaffoldAccent}`}>
          NOW SHOWING · {featureName.toUpperCase() || 'SELECTED'}
        </span>
      </div>

      <div className={styles.grid}>
        <div className={styles.left}>
          <h1 className={styles.name}>
            <GlitchText
              as="span"
              className={styles.nameLine}
              duration={900}
              stagger={70}
            >
              EL4S
            </GlitchText>
          </h1>

          <div className={styles.tagline}>
            <span className={styles.taglineNo}>01</span>
            <span>PHOTOGRAPHER</span>
            <span className={styles.taglineDot} aria-hidden="true" />
            <span className={styles.taglineNo}>02</span>
            <span>ACTOR</span>
            <span className={styles.taglineDot} aria-hidden="true" />
            <span className={styles.taglineNo}>03</span>
            <span>DEVELOPER</span>
          </div>

          <p className={styles.lede}>
            I make pictures. I write code. I sometimes pretend to be other
            people on camera. This is the archive — raw, in progress, not
            for retraining.
          </p>

          <div className={styles.actions}>
            <a
              ref={buttonRef}
              className={styles.btnPrimary}
              href="/photography"
              onClick={(e) => nav(e, '/photography')}
              data-cursor="enter"
            >
              <span className={styles.btnNo}>00</span>
              <span className={styles.btnLabel}>ENTER ARCHIVE</span>
              <span className={styles.btnArrow} aria-hidden="true">→</span>
            </a>
            <a
              className={styles.btnGhost}
              href="mailto:el4s@el4s.dev"
              data-cursor="email"
            >
              <span className={styles.btnNo}>++</span>
              <span className={styles.btnLabel}>WRITE</span>
            </a>
          </div>

          <div className={styles.statBlock}>
            <div className={styles.stat}>
              <span className={styles.statNo}>008</span>
              <span className={styles.statLabel}>FRAMES PUBLISHED</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNo}>003</span>
              <span className={styles.statLabel}>DISCIPLINES</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNo}>∞</span>
              <span className={styles.statLabel}>UNFINISHED IDEAS</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          {featured && (
            <div className={styles.feature}>
              <div className={styles.featureCanvas}>
                <ShaderCanvas src={featured.url} alt="Featured photograph" />
              </div>
              <div className={styles.featureCorner} aria-hidden="true" />
              <div className={styles.featureMeta}>
                <span className={styles.featureLabel}>SELECTED · {featureName.toUpperCase()}</span>
                <span className={styles.featureCoord}>40.71° N · 74.00° W</span>
              </div>
              <div className={styles.featureStamp} aria-hidden="true">
                <span>MOVE</span>
                <span>YOUR</span>
                <span>CURSOR</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
