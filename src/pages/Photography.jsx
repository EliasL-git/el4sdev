import React, { useCallback, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Gallery from '../components/Gallery'
import Lightbox from '../components/Lightbox'
import GlitchText from '../components/GlitchText'
import { photos } from '../lib/photos'
import styles from './Photography.module.css'

export default function Photography() {
  const [openIndex, setOpenIndex] = useState(null)

  const open = useCallback((i) => setOpenIndex(i), [])
  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length
    )
  }, [])
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length))
  }, [])

  const count = photos.length

  return (
    <div className={styles.page}>
      <SiteHeader current="/photography" />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.scaffold}>
            <span className={styles.scaffoldLabel}>FRAMES · 01</span>
            <span className={styles.scaffoldSep} aria-hidden="true">—</span>
            <span className={styles.scaffoldLabel}>VOL · IV · 2026</span>
            <span className={styles.scaffoldSep} aria-hidden="true">—</span>
            <span className={`${styles.scaffoldLabel} ${styles.scaffoldAccent}`}>
              ARCHIVE · IN PROGRESS
            </span>
          </div>

          <div className={styles.titleRow}>
            <h1 className={styles.heading}>
              <GlitchText as="span" duration={800} stagger={60}>
                FRAMES
              </GlitchText>
            </h1>
            <span className={styles.count}>
              <span className={styles.countNum}>{String(count).padStart(3, '0')}</span>
              <span className={styles.countLabel}>FRAMES LIVE</span>
            </span>
          </div>

          <div className={styles.subRow}>
            <p className={styles.lede}>
              Selected images from the working archive. Click any frame to
              open full-screen — use ← / → to navigate, ESC to close.
            </p>
            <span className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={styles.legendKey}>OPEN</span>
                CLICK
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendKey}>NEXT</span>
                ARROW →
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendKey}>BACK</span>
                ARROW ←
              </span>
            </span>
          </div>
        </header>

        <Gallery photos={photos} onImageClick={open} />

        {openIndex !== null && (
          <Lightbox
            photos={photos}
            index={openIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
