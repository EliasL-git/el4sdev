import React, { useEffect, useRef, useState } from 'react'
import Quotes from './Quotes'
import Magnetic from './Magnetic'
import { featured } from '../lib/photos'
import { useApp } from '../lib/AppContext'
import styles from './Hero.module.css'

export default function Hero() {
  const { ready, navigate } = useApp()
  const featureWrapRef = useRef(null)
  const featureImgRef = useRef(null)

  // Mouse-parallax on the featured image. Tilts up to ±8° based on cursor
  // position relative to the card; smoothed via a small rAF lerp.
  useEffect(() => {
    const wrap = featureWrapRef.current
    const img = featureImgRef.current
    if (!wrap || !img) return

    let tx = 0, ty = 0, tz = 0
    let targetX = 0, targetY = 0, targetZ = 0
    let raf = null
    let running = false

    function loop() {
      tx += (targetX - tx) * 0.12
      ty += (targetY - ty) * 0.12
      tz += (targetZ - tz) * 0.12
      wrap.style.transform = `perspective(1200px) rotateX(${-ty}deg) rotateY(${tx}deg) translateZ(0)`
      img.style.transform = `scale(${1.06 + tz * 0.04}) translate3d(${tx * 6}px, ${ty * 6}px, 0)`
      if (
        Math.abs(targetX - tx) > 0.01 ||
        Math.abs(targetY - ty) > 0.01 ||
        Math.abs(targetZ - tz) > 0.001
      ) {
        raf = requestAnimationFrame(loop)
      } else {
        running = false
        raf = null
      }
    }

    function start() {
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    function onMove(e) {
      const rect = wrap.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5  // -0.5 … 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      targetX = nx * 14
      targetY = ny * 10
      targetZ = 1
      start()
    }

    function onLeave() {
      targetX = 0
      targetY = 0
      targetZ = 0
      start()
    }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  function onNav(e, to) {
    e.preventDefault()
    navigate(to)
  }

  // Split letters for the wordmark.
  const chars = [
    { ch: 'e', italic: true,  i: 0 },
    { ch: 'l', italic: true,  i: 1 },
    { ch: '4', italic: false, i: 2, accent: true },
    { ch: 's', italic: true,  i: 3 },
  ]

  return (
    <section className={`${styles.hero} ${ready ? styles.in : ''}`}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <span className={styles.dashLong} aria-hidden="true" />
            <span className={styles.eyebrowText}>Portfolio · 2026 · Index 001</span>
          </div>

          <h1 className={styles.name} aria-label="el4s">
            <span className={styles.nameMask}>
              {chars.map(({ ch, italic, accent, i }) => (
                <span
                  key={i}
                  className={`${styles.char} ${italic ? styles.charItalic : ''} ${
                    accent ? styles.charAccent : ''
                  }`}
                  style={{ '--i': i }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h1>

          <p className={styles.tagline} aria-label="Photographer, Actor, Developer">
            <span className={styles.taglineWord}>Photographer</span>
            <span className={styles.taglineSep} aria-hidden="true">/</span>
            <span className={styles.taglineWord}>Actor</span>
            <span className={styles.taglineSep} aria-hidden="true">/</span>
            <span className={styles.taglineWord}>Developer</span>
          </p>

          <p className={styles.lede}>
            I take pictures, i do coding!! and i alsooo do acting???
          </p>

          <div className={styles.actions}>
            <Magnetic strength={0.35}>
              <a
                className={styles.btnPrimary}
                href="/photography"
                onClick={(e) => onNav(e, '/photography')}
              >
                <span className={styles.btnLabel}>
                  <span className={styles.btnLabelLine}>View photography</span>
                  <span className={styles.btnLabelLine}>View photography</span>
                </span>
                <span className={styles.btnArrow} aria-hidden="true">&rarr;</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a className={styles.btnGhost} href="mailto:el4s@el4s.dev">
                <span>Get in touch</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className={styles.right}>
          {featured && (
            <div ref={featureWrapRef} className={styles.feature}>
              <div className={styles.featureInner}>
                <img
                  ref={featureImgRef}
                  src={featured.url}
                  alt="Featured photograph"
                  className={styles.featureImg}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className={styles.featureFrame} aria-hidden="true" />
              <div className={styles.featureMeta}>
                <span className={styles.featureLabel}>Selected · Random</span>
                <span className={styles.featureName}>
                  {featured.name.replace(/\.[A-Z]+$/i, '')}
                </span>
              </div>
              <div className={styles.featureSticker} aria-hidden="true">
                <span>One of one</span>
                <span>·</span>
                <span>2026</span>
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
