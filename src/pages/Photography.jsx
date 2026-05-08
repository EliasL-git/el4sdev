import React, { useEffect, useState } from 'react'
import Gallery from '../components/Gallery'
import Lightbox from '../components/Lightbox'
import styles from './Photography.module.css'

export default function Photography() {
  const [images, setImages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fit10, setFit10] = useState(false)
  const [lightbox, setLightbox] = useState({ open: false, src: null, width: 0, height: 0 })

  useEffect(() => {
    fetch('/media/list.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load image list')
        return res.json()
      })
      .then((list) => {
        const imgs = Array.isArray(list) ? list : []
        setImages(imgs)
        setFit10(imgs.length >= 10)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function openLightbox(filename) {
    const img = new window.Image()
    img.onload = () =>
      setLightbox({ open: true, src: filename, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => setError('Failed to load image')
    img.src = `/media/${filename}`
  }

  function closeLightbox() {
    setLightbox({ open: false, src: null, width: 0, height: 0 })
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a
          className={styles.back}
          href="/"
          onClick={(e) => {
            e.preventDefault()
            window.navigate('/')
          }}
        >
          &larr; Back
        </a>
        <div className={styles.titleGroup}>
          <span className={styles.label}>el4s</span>
          <h1 className={styles.heading}>Photography</h1>
        </div>
      </header>

      {loading && <p className={styles.status}>Loading…</p>}
      {error && <p className={styles.status}>{error}</p>}

      {!loading && images && (
        <Gallery images={images} fit10={fit10} onImageClick={openLightbox} />
      )}

      {lightbox.open && (
        <Lightbox
          src={lightbox.src}
          width={lightbox.width}
          height={lightbox.height}
          onClose={closeLightbox}
        />
      )}
    </main>
  )
}
