import React, { useEffect, useRef } from 'react'

// Wrap any inline-block element to make it follow the cursor on hover.
// The child element is offset by (cursor - center) * strength so it
// "pulls" toward the cursor; resets on mouseleave.
export default function Magnetic({ children, strength = 0.4, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = null
    let tx = 0, ty = 0
    let targetX = 0, targetY = 0

    function loop() {
      tx += (targetX - tx) * 0.18
      ty += (targetY - ty) * 0.18
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      if (Math.abs(targetX - tx) > 0.05 || Math.abs(targetY - ty) > 0.05) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = null
      }
    }

    function start() {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      targetX = x * strength
      targetY = y * strength
      start()
    }

    function onLeave() {
      targetX = 0
      targetY = 0
      start()
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength])

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </span>
  )
}
