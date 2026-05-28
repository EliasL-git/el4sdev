import React, { useEffect, useRef, useState } from 'react'
import { photos, featured } from '../lib/photos'
import useReducedMotion from '../lib/useReducedMotion'
import { clack } from '../lib/audio'
import styles from './WorkStrip.module.css'

/**
 * Pinned horizontal scroll showcase. The outer section is tall enough
 * to give us a "scroll budget"; the inner sticky container fills the
 * viewport; the horizontal track translates based on vertical scroll
 * progress through the outer section. Intentional tile overlap and
 * varying sizes for the brutalist feel.
 */
export default function WorkStrip() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)

  // Exclude the hero featured photo so it doesn't show up twice
  const items = photos.filter((p) => !featured || p.name !== featured.name)

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    let raf = 0
    let target = 0
    let current = 0

    function update() {
      const rect = section.getBoundingClientRect()
      const winH = window.innerHeight
      // Section starts when its top hits viewport top, ends when its
      // bottom (height - winH) leaves the viewport
      const total = rect.height - winH
      const scrolled = Math.max(0, -rect.top)
      target = total > 0 ? Math.min(1, scrolled / total) : 0
    }

    function loop() {
      current += (target - current) * 0.12
      const trackWidth = track.scrollWidth
      const winW = window.innerWidth
      const maxX = Math.max(0, trackWidth - winW)
      track.style.transform = `translate3d(${-current * maxX}px, 0, 0)`
      setProgress(current)
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [reduced, items.length])

  function nav(e, to) {
    e.preventDefault()
    clack({ frequency: 360, duration: 0.05, gain: 0.07 })
    window.navigate(to)
  }

  if (items.length === 0) {
    return (
      <section className={styles.empty}>
        <p>NO FRAMES BUNDLED</p>
      </section>
    )
  }

  // Tile size variation pattern — repeats across items
  const SIZES = ['l', 's', 'm', 'l', 'xs', 'm', 's', 'l']
  const OFFSETS = [0, -32, 24, -16, 40, -24, 16, -40]

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${reduced ? styles.reducedMotion : ''}`}
      aria-label="Selected work"
      style={{ '--items': items.length }}
    >
      <div className={styles.sticky}>
        <div className={styles.framing}>
          <span className={styles.framingLabel}>
            <span className={styles.framingDot} aria-hidden="true" />
            SELECTED WORK · {String(items.length).padStart(2, '0')} FRAMES
          </span>
          <span className={styles.framingProgress}>
            <span className={styles.framingProgressBar}>
              <span
                className={styles.framingProgressFill}
                style={{ transform: `scaleX(${progress})` }}
              />
            </span>
            <span className={styles.framingProgressLabel}>
              {String(Math.round(progress * 100)).padStart(3, '0')}%
            </span>
          </span>
          <a
            href="/photography"
            className={styles.viewAll}
            onClick={(e) => nav(e, '/photography')}
            data-cursor="open"
          >
            <span>VIEW ALL</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className={styles.trackWrap}>
          <div ref={trackRef} className={styles.track}>
            <div className={styles.headline}>
              <span className={styles.headlineLine}>FRAMES</span>
              <span className={styles.headlineLine}>FROM THE</span>
              <span className={styles.headlineLine}>ARCHIVE</span>
            </div>
            {items.map((p, i) => {
              const size = SIZES[i % SIZES.length]
              const offset = OFFSETS[i % OFFSETS.length]
              return (
                <a
                  key={p.name}
                  href="/photography"
                  onClick={(e) => nav(e, '/photography')}
                  className={`${styles.tile} ${styles[`size_${size}`]}`}
                  style={{ '--offset': `${offset}px` }}
                  data-cursor="open"
                >
                  <span className={styles.tileFrame}>
                    <img
                      src={p.url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={styles.tileImg}
                    />
                  </span>
                  <span className={styles.tileMeta}>
                    <span className={styles.tileNo}>
                      {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </span>
                    <span className={styles.tileStamp}>
                      FRAME · 2026.{String(((i + 4) % 12) + 1).padStart(2, '0')}
                    </span>
                  </span>
                </a>
              )
            })}
            <div className={styles.endBlock}>
              <span className={styles.endNo}>END</span>
              <span className={styles.endLabel}>OF FRAMES</span>
              <a
                href="/photography"
                onClick={(e) => nav(e, '/photography')}
                className={styles.endCta}
                data-cursor="open"
              >
                OPEN ARCHIVE →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
