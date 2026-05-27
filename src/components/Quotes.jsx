import React, { useEffect, useRef, useState } from 'react'
import { mediaUrl } from '../lib/media'
import styles from './Quotes.module.css'

export default function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [phase, setPhase] = useState('in') // 'in' | 'out'
  const cycleRef = useRef(null)

  // Fetch once.
  useEffect(() => {
    let mounted = true
    fetch(mediaUrl('quotes.json'), { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load quotes')
        return res.json()
      })
      .then((list) => {
        if (!mounted) return
        const next = Array.isArray(list) ? list : []
        setQuotes(next)
        if (next.length > 0) {
          setActiveIndex(Math.floor(Math.random() * next.length))
        }
      })
      .catch((err) => mounted && setError(err.message))
    return () => {
      mounted = false
    }
  }, [])

  // Cycle every 9s with fade-out → switch → fade-in.
  useEffect(() => {
    if (quotes.length <= 1) return
    cycleRef.current = window.setInterval(() => {
      setPhase('out')
      window.setTimeout(() => {
        setActiveIndex((i) => (i + 1) % quotes.length)
        setPhase('in')
      }, 380)
    }, 9000)
    return () => window.clearInterval(cycleRef.current)
  }, [quotes.length])

  if (error) {
    return <p className={styles.status}>{error}</p>
  }

  if (quotes.length === 0) {
    return <p className={styles.status}>…</p>
  }

  const q = quotes[activeIndex]

  return (
    <figure className={`${styles.figure} ${phase === 'out' ? styles.out : styles.in}`}>
      <span className={styles.openQuote} aria-hidden="true">&ldquo;</span>
      <blockquote className={styles.text}>{q.text}</blockquote>
      <figcaption className={styles.author}>
        <span className={styles.dash} aria-hidden="true" />
        <span>{q.author || 'el4s'}</span>
        {q.category ? <span className={styles.category}>· {q.category}</span> : null}
      </figcaption>
    </figure>
  )
}
