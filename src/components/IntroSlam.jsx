import React, { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../lib/useReducedMotion'
import { glitch } from '../lib/glitch'
import { clack } from '../lib/audio'
import styles from './IntroSlam.module.css'

/**
 * Cinematic intro: a black overlay covers the page, a counter glitches
 * from 0 → 100, then a red slam panel sweeps down + up to reveal the
 * page. Runs once per session (sessionStorage flag).
 */
export default function IntroSlam() {
  const [phase, setPhase] = useState('counting') // counting → slam → done
  const [skip, setSkip] = useState(false)
  const counterRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('el4s.intro') === '1') {
        setSkip(true)
        return
      }
    } catch (_e) {
      /* ignore */
    }

    if (reduced) {
      // Reduced motion: skip animation, mark seen.
      try { window.sessionStorage.setItem('el4s.intro', '1') } catch (_e) { /* ignore */ }
      setSkip(true)
      return
    }

    // Lock scroll during intro
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    let cancelled = false
    let glitchStop = () => {}
    let raf = 0

    const start = performance.now()
    const duration = 1100

    function step(now) {
      if (cancelled) return
      const t = Math.min(1, (now - start) / duration)
      const pct = Math.floor(t * 100)
      if (counterRef.current) {
        counterRef.current.textContent = String(pct).padStart(3, '0')
      }
      if (t >= 1) {
        if (counterRef.current) counterRef.current.textContent = '100'
        // Apply a quick glitch flicker on the number
        if (counterRef.current) {
          glitchStop = glitch(counterRef.current, '100', { duration: 220, stagger: 40 })
        }
        clack({ frequency: 540, duration: 0.06, gain: 0.08 })
        window.setTimeout(() => {
          if (cancelled) return
          setPhase('slam')
          clack({ frequency: 220, duration: 0.12, gain: 0.1 })
          window.setTimeout(() => {
            if (cancelled) return
            setPhase('done')
            try { window.sessionStorage.setItem('el4s.intro', '1') } catch (_e) { /* ignore */ }
            document.body.style.overflow = prevOverflow
          }, 720)
        }, 240)
        return
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      glitchStop()
      document.body.style.overflow = prevOverflow
    }
  }, [reduced])

  if (skip || phase === 'done') return null

  return (
    <div className={styles.root} data-phase={phase} aria-hidden="true">
      <div className={styles.black}>
        <div className={styles.frame}>
          <span className={styles.labelTop}>el4s · 2026.05</span>
          <span className={styles.labelMid}>VOL · IV</span>
          <span className={styles.labelBot}>
            <span ref={counterRef} className={styles.counter}>000</span>
            <span className={styles.counterUnit}>%</span>
          </span>
        </div>
      </div>
      <div className={styles.slam}>
        <span className={styles.slamText}>el4s</span>
      </div>
    </div>
  )
}
