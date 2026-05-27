import React, { useEffect, useState } from 'react'
import styles from './Lightbox.module.css'

export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const [meta, setMeta] = useState({ width: 0, height: 0, loaded: false })
  const photo = photos[index]

  // Resolve image dimensions when the active image changes.
  useEffect(() => {
    if (!photo) return
    setMeta({ width: 0, height: 0, loaded: false })
    const img = new window.Image()
    img.onload = () =>
      setMeta({ width: img.naturalWidth, height: img.naturalHeight, loaded: true })
    img.src = photo.url
  }, [photo])

  // Keyboard shortcuts: Esc closes, ← / → navigate.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  if (!photo) return null

  const total = photos.length

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div className={styles.topBar} onClick={(e) => e.stopPropagation()}>
        <span className={styles.counter}>
          {String(index + 1).padStart(2, '0')}
          <span className={styles.counterDim}> / {String(total).padStart(2, '0')}</span>
        </span>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <span aria-hidden="true">Close</span>
          <span aria-hidden="true" className={styles.closeX}>&times;</span>
        </button>
      </div>

      <button
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        aria-label="Previous photo"
      >
        <span aria-hidden="true">&larr;</span>
      </button>

      <button
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        aria-label="Next photo"
      >
        <span aria-hidden="true">&rarr;</span>
      </button>

      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <img
          key={photo.name}
          className={styles.img}
          src={photo.url}
          alt="Full-size view"
        />
      </div>

      <div className={styles.bottomBar} onClick={(e) => e.stopPropagation()}>
        <span className={styles.meta}>
          <span className={styles.metaLabel}>File</span>
          <span className={styles.metaValue}>{photo.name}</span>
        </span>
        {meta.loaded && (
          <span className={styles.meta}>
            <span className={styles.metaLabel}>Size</span>
            <span className={styles.metaValue}>
              {meta.width} &times; {meta.height}
            </span>
          </span>
        )}
        <span className={styles.actions}>
          <a
            className={styles.actionLink}
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open full
          </a>
          <a className={styles.actionLink} href={photo.url} download={photo.name}>
            Download
          </a>
        </span>
      </div>
    </div>
  )
}
