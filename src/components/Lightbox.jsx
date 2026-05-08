import React, { useEffect } from 'react'
import styles from './Lightbox.module.css'

export default function Lightbox({ src, width, height, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!src) return null

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ✕
      </button>

      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <img
          className={styles.img}
          src={`/media/${src}`}
          alt="Full-size view"
        />

        <div className={styles.meta}>
          {width > 0 && height > 0 && (
            <span className={styles.caption}>
              {width}&thinsp;&times;&thinsp;{height}
            </span>
          )}
          <div className={styles.actions}>
            <a
              className={`${styles.actionLink} ${styles.actionLinkAccent}`}
              href={`/media/${src}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full
            </a>
            <a
              className={styles.actionLink}
              href={`/media/${src}`}
              download
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
