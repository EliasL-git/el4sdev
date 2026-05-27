import React, { useCallback, useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Gallery from '../components/Gallery'
import Lightbox from '../components/Lightbox'
import { mediaUrl } from '../lib/media'
import styles from './Photography.module.css'

export default function Photography() {
  const [images, setImages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    fetch(mediaUrl('list.json'))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load image list')
        return res.json()
      })
      .then((list) => setImages(Array.isArray(list) ? list : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const open = useCallback((i) => setOpenIndex(i), [])
  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(() => {
    if (!images || images.length === 0) return
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images])
  const next = useCallback(() => {
    if (!images || images.length === 0) return
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))
  }, [images])

  const count = images ? images.length : 0

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

        {loading && (
          <p className={styles.status}>Loading the archive&hellip;</p>
        )}
        {error && <p className={styles.status}>{error}</p>}

        {!loading && images && (
          <Gallery images={images} onImageClick={open} />
        )}

        {openIndex !== null && images && (
          <Lightbox
            images={images}
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
