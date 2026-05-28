import React, { useEffect, useState } from 'react'
import useReducedMotion from '../lib/useReducedMotion'
import { clack } from '../lib/audio'
import styles from './Lightbox.module.css'

export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const [meta, setMeta] = useState({ width: 0, height: 0, loaded: false })
  const [entered, setEntered] = useState(false)
  const reduced = useReducedMotion()
  const photo = photos[index]

  // Resolve image dimensions when active image changes
  useEffect(() => {
    if (!photo) return
    setMeta({ width: 0, height: 0, loaded: false })
    const img = new window.Image()
    img.onload = () =>
      setMeta({ width: img.naturalWidth, height: img.naturalHeight, loaded: true })
    img.src = photo.url
  }, [photo])

  // Enter animation (slam open)
  useEffect(() => {
    setEntered(false)
    const t = window.setTimeout(() => setEntered(true), reduced ? 0 : 20)
    return () => window.clearTimeout(t)
  }, [photo, reduced])

  // Keyboard shortcuts
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

  function clickPrev(e) {
    e.stopPropagation()
    clack({ frequency: 320, duration: 0.04, gain: 0.06 })
    onPrev()
  }
  function clickNext(e) {
    e.stopPropagation()
    clack({ frequency: 420, duration: 0.04, gain: 0.06 })
    onNext()
  }
  function clickClose(e) {
    e.stopPropagation()
    clack({ frequency: 220, duration: 0.06, gain: 0.07 })
    onClose()
  }

  return (
    <div
      className={`${styles.overlay} ${entered ? styles.entered : ''}`}
      onClick={clickClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Red slam panel (animates in) */}
      <div className={styles.slamRed} aria-hidden="true" />
      {/* Black panel (animates in behind the red) */}
      <div className={styles.slamBlack} aria-hidden="true" />

      <div className={styles.topBar} onClick={(e) => e.stopPropagation()}>
        <span className={styles.label}>
          <span className={styles.labelDot} />
          FRAME · {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          className={styles.closeBtn}
          onClick={clickClose}
          aria-label="Close lightbox"
          data-cursor="close"
        >
          <span className={styles.closeLabel}>CLOSE</span>
          <span aria-hidden="true" className={styles.closeX}>×</span>
        </button>
      </div>

      {/* Prev/Next click zones — large cursor target halves */}
      <button
        className={`${styles.zone} ${styles.zonePrev}`}
        onClick={clickPrev}
        aria-label="Previous photo"
        data-cursor="prev"
      >
        <span aria-hidden="true" className={styles.zoneLabel}>← PREV</span>
      </button>

      <button
        className={`${styles.zone} ${styles.zoneNext}`}
        onClick={clickNext}
        aria-label="Next photo"
        data-cursor="next"
      >
        <span aria-hidden="true" className={styles.zoneLabel}>NEXT →</span>
      </button>

      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <img
          key={photo.name}
          className={styles.img}
          src={photo.url}
          alt="Full-size view"
        />
        <div className={styles.cornerTL} aria-hidden="true" />
        <div className={styles.cornerBR} aria-hidden="true" />
      </div>

      <div className={styles.bottomBar} onClick={(e) => e.stopPropagation()}>
        <span className={styles.meta}>
          <span className={styles.metaLabel}>FILE</span>
          <span className={styles.metaValue}>{photo.name}</span>
        </span>
        {meta.loaded && (
          <span className={styles.meta}>
            <span className={styles.metaLabel}>SIZE</span>
            <span className={styles.metaValue}>
              {meta.width} × {meta.height}
            </span>
          </span>
        )}
        <span className={styles.actions}>
          <a
            className={styles.actionLink}
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="open"
          >
            OPEN FULL
          </a>
          <a
            className={styles.actionLink}
            href={photo.url}
            download={photo.name}
            data-cursor="save"
          >
            DOWNLOAD
          </a>
        </span>
      </div>
    </div>
  )
}
