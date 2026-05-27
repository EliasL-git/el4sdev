import React, { useCallback, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Gallery from '../components/Gallery'
import Lightbox from '../components/Lightbox'
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
          <div className={styles.headerInner}>
            <div className={styles.crumbs}>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  window.navigate('/')
                }}
              >
                Index
              </a>
              <span className={styles.crumbSep} aria-hidden="true">/</span>
              <span className={styles.crumbActive}>Photography</span>
            </div>

            <div className={styles.titleRow}>
              <h1 className={styles.heading}>
                <span className={styles.headingItalic}>Photographs</span>
              </h1>
              <span className={styles.count}>
                <span className={styles.countNum}>{String(count).padStart(2, '0')}</span>
                <span className={styles.countLabel}>frames</span>
              </span>
            </div>

            <p className={styles.lede}>
              Selected images from the working archive. Click any frame to open
              full-screen &mdash; use &larr; / &rarr; to navigate.
            </p>
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
