import React, { useEffect, useRef, useState } from 'react'
import quotes from '../lib/quotes'
import useReducedMotion from '../lib/useReducedMotion'
import { glitch } from '../lib/glitch'
import styles from './Quotes.module.css'

/**
 * Brutalist quote slab — one huge quote at a time, swapped with a hard
 * glitch cut (no fade). Cycles every 10s. Renders a single block of
 * dense type, not a soft figure.
 */
export default function Quotes() {
  const [idx, setIdx] = useState(() =>
    quotes.length > 0 ? Math.floor(Math.random() * quotes.length) : 0
  )
  const textRef = useRef(null)
  const authorRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (quotes.length <= 1) return
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % quotes.length)
    }, 10000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (reduced) return
    const q = quotes[idx]
    if (!q) return
    let stopText = () => {}
    let stopAuthor = () => {}
    if (textRef.current) {
      stopText = glitch(textRef.current, q.text, { duration: 460, stagger: 6 })
    }
    if (authorRef.current) {
      stopAuthor = glitch(authorRef.current, (q.author || 'EL4S').toUpperCase(), {
        duration: 360,
        stagger: 22,
      })
    }
    return () => {
      stopText()
      stopAuthor()
    }
  }, [idx, reduced])

  if (quotes.length === 0) {
    return <p className={styles.empty}>—</p>
  }

  const q = quotes[idx]

  return (
    <section className={styles.section} aria-label="Quote">
      <div className={styles.framing}>
        <span className={styles.label}>QUOTE · {String(idx + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}</span>
        <span className={styles.category}>{q.category || '—'}</span>
      </div>

      <blockquote className={styles.text}>
        <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
        <span ref={textRef}>{q.text}</span>
      </blockquote>

      <div className={styles.attribution}>
        <span className={styles.dash} aria-hidden="true" />
        <span ref={authorRef} className={styles.author}>
          {(q.author || 'EL4S').toUpperCase()}
        </span>
      </div>
    </section>
  )
}
