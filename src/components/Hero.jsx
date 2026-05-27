import React, { useEffect, useState } from 'react'
import Quotes from './Quotes'
import { featured } from '../lib/photos'
import styles from './Hero.module.css'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 40)
    return () => window.clearTimeout(t)
  }, [])

  function nav(e, to) {
    e.preventDefault()
    window.navigate(to)
  }

  return (
    <section className={`${styles.hero} ${mounted ? styles.in : ''}`}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <span className={styles.dashLong} aria-hidden="true" />
            <span className={styles.eyebrowText}>Portfolio · 2026</span>
          </div>

          <h1 className={styles.name}>
            <span className={styles.nameItalic}>el</span>
            <span className={styles.nameNumeral}>4</span>
            <span className={styles.nameItalic}>s</span>
          </h1>

          <p className={styles.tagline}>
            <span>Photographer.</span>
            <span className={styles.taglineSep} aria-hidden="true">/</span>
            <span>Actor.</span>
            <span className={styles.taglineSep} aria-hidden="true">/</span>
            <span>Developer.</span>
          </p>

          <p className={styles.lede}>
            I take pictures, i do coding!! and i alsooo do acting???
          </p>

          <div className={styles.actions}>
            <a
              className={styles.btnPrimary}
              href="/photography"
              onClick={(e) => nav(e, '/photography')}
            >
              <span>View photography</span>
              <span className={styles.btnArrow} aria-hidden="true">&rarr;</span>
            </a>
            <a
              className={styles.btnGhost}
              href="mailto:el4s@el4s.dev"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className={styles.right}>
          {featured && (
            <div className={styles.feature}>
              <img
                src={featured.url}
                alt="Featured photograph"
                className={styles.featureImg}
                loading="eager"
                decoding="async"
              />
              <div className={styles.featureFrame} aria-hidden="true" />
              <div className={styles.featureMeta}>
                <span className={styles.featureLabel}>Selected</span>
                <span className={styles.featureName}>
                  {featured.name.replace(/\.[A-Z]+$/i, '')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.aside}>
        <Quotes />
        <div className={styles.scrollHint}>
          <span className={styles.scrollLabel}>Scroll</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
