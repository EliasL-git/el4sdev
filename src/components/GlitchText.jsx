import React, { useEffect, useRef } from 'react'
import { glitch } from '../lib/glitch'
import useReducedMotion from '../lib/useReducedMotion'
import styles from './GlitchText.module.css'

/**
 * Renders text that glitch-shuffles into place once on mount (or when
 * `replay` changes). Respects reduced motion.
 *
 * Props:
 *   - children: string (the target text)
 *   - duration: ms total reveal time (default 700)
 *   - stagger: ms between each char landing (default 36)
 *   - delay: ms before starting (default 0)
 *   - replay: any — change to re-trigger
 *   - as: tag name (default 'span')
 *   - className: extra classes
 */
export default function GlitchText({
  children,
  duration = 700,
  stagger = 36,
  delay = 0,
  replay,
  as: Tag = 'span',
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const text = typeof children === 'string' ? children : String(children ?? '')

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduced) {
      node.textContent = text
      return
    }
    let stop = () => {}
    const timer = window.setTimeout(() => {
      stop = glitch(node, text, { duration, stagger })
    }, delay)
    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [text, duration, stagger, delay, replay, reduced])

  return (
    <Tag
      ref={ref}
      className={`${styles.glitch} ${className}`}
      data-glitch
      {...rest}
    >
      {text}
    </Tag>
  )
}
