import React from 'react'
import Quotes from './Quotes'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.label}>Portfolio</span>

        <h1 className={styles.name}>el4s</h1>

        <Quotes />

        <p className={styles.tagline}>
          Photographer&nbsp;&middot;&nbsp;Actor&nbsp;&middot;&nbsp;Developer
        </p>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <a
            className={styles.btnPrimary}
            href="/photography"
            onClick={(e) => {
              e.preventDefault()
              window.navigate('/photography')
            }}
          >
            Photography
          </a>
          <a
            className={styles.btnGhost}
            href="/non-commercial"
            onClick={(e) => {
              e.preventDefault()
              window.navigate('/non-commercial')
            }}
          >
            Non-commercial&nbsp;&rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
