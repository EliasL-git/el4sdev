import React, { useEffect, useRef, useState } from 'react'
import { photos } from '../lib/photos'
import { useApp } from '../lib/AppContext'
import { useReveal } from '../lib/useReveal'
import styles from './HoverReveal.module.css'

// Studio-portfolio pattern: vertical list of items where the cursor-tracked
// image preview swims through the section, swapping content as the user
// hovers each row. Click a row to jump to /photography.
export default function HoverReveal() {
  const { navigate } = useApp()
  const [active, setActive] = useState(null)
  const listRef = useRef(null)
  const imgRef = useRef(null)
  const [sectionRef, revealed] = useReveal()

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    let tx = 0, ty = 0
    let targetX = 0, targetY = 0
    let raf = null
    let running = false

    function loop() {
      tx += (targetX - tx) * 0.16
      ty += (targetY - ty) * 0.16
      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
      }
      if (Math.abs(targetX - tx) > 0.1 || Math.abs(targetY - ty) > 0.1) {
        raf = requestAnimationFrame(loop)
      } else {
        running = false
        raf = null
      }
    }

    function onMove(e) {
      const rect = list.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    list.addEventListener('mousemove', onMove)
    return () => {
      list.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  function openPhotography(e) {
    e.preventDefault()
    navigate('/photography')
  }

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${revealed ? styles.in : ''}`}
      aria-label="Archive"
    >
      <div className={styles.head}>
        <span className={styles.eyebrow}>
          <span className={styles.dash} aria-hidden="true" />
          <span>The Archive · {String(photos.length).padStart(3, '0')}</span>
        </span>
        <h2 className={styles.heading}>
          <span className={styles.headingItalic}>Frames</span> that stuck.
        </h2>
        <p className={styles.lede}>
          Hover &mdash; the cursor brings each one with it.
        </p>
      </div>

      <ul
        ref={listRef}
        className={styles.list}
        onMouseLeave={() => setActive(null)}
      >
        {photos.map((p, i) => (
          <li
            key={p.name}
            className={`${styles.item} ${active === i ? styles.itemActive : ''} ${
              active !== null && active !== i ? styles.itemDim : ''
            }`}
            onMouseEnter={() => setActive(i)}
            data-cursor="hover"
          >
            <a
              href="/photography"
              onClick={openPhotography}
              className={styles.row}
            >
              <span className={styles.no}>
                {String(i + 1).padStart(3, '0')}
              </span>
              <span className={styles.name}>
                {p.name.replace(/\.[A-Z]+$/i, '')}
              </span>
              <span className={styles.year}>MMXXVI</span>
              <span className={styles.arrow} aria-hidden="true">&#8599;</span>
            </a>
          </li>
        ))}

        <div
          ref={imgRef}
          className={`${styles.preview} ${active !== null ? styles.previewOn : ''}`}
          aria-hidden="true"
        >
          {photos.map((p, i) => (
            <img
              key={p.name}
              src={p.url}
              alt=""
              className={`${styles.previewImg} ${active === i ? styles.previewImgOn : ''}`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </ul>
    </section>
  )
}
