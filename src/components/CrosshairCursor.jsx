import React, { useEffect, useRef } from 'react'
import useIsTouch from '../lib/useIsTouch'
import useReducedMotion from '../lib/useReducedMotion'
import { tick } from '../lib/audio'
import styles from './CrosshairCursor.module.css'

/**
 * Crosshair cursor — replaces the native cursor with a `+` that flips to
 * a hollow square (with optional verb label) when over `[data-cursor]`
 * elements. Hidden on touch and reduced-motion devices.
 *
 * Hoverable elements opt in via `data-cursor="view"` (or any label).
 * Anchor and button elements get hover state by default.
 */
export default function CrosshairCursor() {
  const rootRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const stateRef = useRef({ x: -100, y: -100, tx: -100, ty: -100, label: '', hover: false })
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (isTouch || reduced) {
      document.body.dataset.cursorActive = 'false'
      return
    }
    document.body.dataset.cursorActive = 'true'

    const dot = dotRef.current
    const label = labelRef.current
    if (!dot) return

    const s = stateRef.current
    let raf = 0

    function onMove(e) {
      s.tx = e.clientX
      s.ty = e.clientY
    }

    function onOver(e) {
      const target = e.target.closest('a, button, [data-cursor]')
      if (!target) {
        if (s.hover) {
          s.hover = false
          s.label = ''
          dot.dataset.hover = 'false'
          if (label) label.textContent = ''
        }
        return
      }
      const verb =
        target.dataset.cursor ||
        (target.tagName === 'BUTTON' ? 'click' : 'open')
      if (!s.hover || s.label !== verb) {
        s.hover = true
        s.label = verb
        dot.dataset.hover = 'true'
        if (label) label.textContent = verb
        tick({ frequency: 1480, duration: 0.018, gain: 0.03 })
      }
    }

    function onLeave() {
      s.hover = false
      s.label = ''
      dot.dataset.hover = 'false'
      if (label) label.textContent = ''
    }

    function loop() {
      // Lerp toward target — gives slight follow inertia
      s.x += (s.tx - s.x) * 0.32
      s.y += (s.ty - s.y) * 0.32
      dot.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
      document.body.dataset.cursorActive = 'false'
    }
  }, [isTouch, reduced])

  if (isTouch || reduced) return null

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div ref={dotRef} className={styles.dot} data-hover="false">
        <span className={styles.plus}>
          <span className={styles.plusV} />
          <span className={styles.plusH} />
        </span>
        <span className={styles.ring} />
        <span ref={labelRef} className={styles.label} />
      </div>
    </div>
  )
}
