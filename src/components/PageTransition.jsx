import React from 'react'
import { useApp } from '../lib/AppContext'
import styles from './PageTransition.module.css'

// Full-screen sheet that sweeps across when navigating between routes.
// The AppContext flips `transitioning` true → renders this active for
// ~520ms → swaps route → flips false → the sheet lifts away.
export default function PageTransition() {
  const { transitioning } = useApp()
  return (
    <div
      className={`${styles.sheet} ${transitioning ? styles.active : ''}`}
      aria-hidden="true"
    >
      <div className={styles.panel} />
      <div className={styles.panel} />
      <div className={styles.panel} />
      <div className={styles.panel} />
      <div className={styles.panel} />
    </div>
  )
}
