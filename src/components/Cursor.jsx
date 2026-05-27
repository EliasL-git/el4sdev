import React, { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

// Custom cursor: a small dot that tracks the mouse precisely + a larger
// ring that lags behind with easing. The ring grows and softens over
// anything interactive (a, button, [role="button"], inputs, anything
// marked with `data-cursor="hover"`).
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse / trackpad).
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(pointer: fine)')
    const apply = () => setEnabled(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rafId = null
    let visible = false

    function onMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) {
        visible = true
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }
    }

    function onLeave() {
      visible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    function update() {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(update)
    }

    function isHoverable(target) {
      return !!(target && target.closest &&
        target.closest('a, button, [role="button"], input, textarea, label, [data-cursor="hover"]'))
    }

    function onOver(e) {
      if (isHoverable(e.target)) setHovering(true)
    }
    function onOut(e) {
      if (isHoverable(e.target)) setHovering(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafId = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.dot} ${hovering ? styles.dotHover : ''}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`${styles.ring} ${hovering ? styles.ringHover : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
