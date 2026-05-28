import React, { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../lib/useReducedMotion'
import { clack } from '../lib/audio'
import styles from './PageTransitionSlam.module.css'

/**
 * Hard color-block page transition. Wraps the navigation function: when
 * a link calls `window.navigate(path)`, this component plays a slam-down
 * animation, switches the route, then slams up to reveal.
 *
 * The actual route swap is delegated to `onNavigate(path)` which is
 * supplied by the Router in main.jsx.
 */
export default function PageTransitionSlam({ onNavigate }) {
  const [active, setActive] = useState(false)
  const reduced = useReducedMotion()
  const inFlight = useRef(false)

  useEffect(() => {
    // Replace window.navigate with our intercepted version
    const originalNav = window.__el4sNav || onNavigate

    function navigate(to) {
      if (to === window.location.pathname) return
      if (inFlight.current) return
      if (reduced) {
        originalNav(to)
        return
      }
      inFlight.current = true
      setActive(true)
      clack({ frequency: 200, duration: 0.07, gain: 0.09 })
      // Match CSS slam-down duration (320ms)
      window.setTimeout(() => {
        originalNav(to)
        // Allow paint, then slam back up
        window.setTimeout(() => {
          setActive(false)
          inFlight.current = false
        }, 80)
      }, 280)
    }

    window.navigate = navigate
    return () => {
      window.navigate = originalNav
    }
  }, [onNavigate, reduced])

  return (
    <div className={styles.root} data-active={active ? 'true' : 'false'} aria-hidden="true">
      <div className={styles.panelRed}>
        <span className={styles.panelLabel}>EL4S</span>
        <span className={styles.panelStamp}>NAVIGATING ·</span>
      </div>
      <div className={styles.panelBlack} />
    </div>
  )
}
