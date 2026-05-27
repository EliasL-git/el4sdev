import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../lib/AppContext'
import styles from './Loader.module.css'

const COUNT_DURATION = 1500 // ms, 00 → 100
const HOLD_AFTER = 220      // ms before the curtains start
const CURTAIN_MS = 880      // ms for the curtain reveal

export default function Loader() {
  const { ready, setReady } = useApp()
  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState('counting') // 'counting' | 'revealing' | 'gone'
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current || ready) return
    startedRef.current = true

    const t0 = performance.now()
    let rafId

    function tick() {
      const elapsed = performance.now() - t0
      const t = Math.min(elapsed / COUNT_DURATION, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * 100))
      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        window.setTimeout(() => {
          setPhase('revealing')
          window.setTimeout(() => {
            setPhase('gone')
            setReady(true)
          }, CURTAIN_MS)
        }, HOLD_AFTER)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [ready, setReady])

  if (phase === 'gone') return null

  return (
    <div
      className={`${styles.loader} ${phase === 'revealing' ? styles.revealing : ''}`}
      aria-hidden="true"
    >
      <div className={styles.bg} />

      <div className={styles.inner}>
        <div className={styles.topRow}>
          <span className={styles.label}>el4s</span>
          <span className={styles.label}>Portfolio · 2026</span>
        </div>

        <div className={styles.counterRow}>
          <span className={styles.bigNum}>{String(count).padStart(3, '0')}</span>
          <span className={styles.pct}>%</span>
        </div>

        <div className={styles.bar}>
          <div className={styles.barFill} style={{ width: `${count}%` }} />
        </div>

        <div className={styles.bottomRow}>
          <span className={styles.tag}>Loading the archive</span>
          <span className={styles.tag}>{count < 100 ? '◇' : '◆'}</span>
        </div>
      </div>
    </div>
  )
}
