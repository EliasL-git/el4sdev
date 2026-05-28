import { useEffect, useState } from 'react'

/**
 * React hook for coarse-pointer devices (touch). Returns true if the
 * primary input is a finger. Used to disable cursor / magnetic / tilt
 * effects on phones and tablets.
 */
export default function useIsTouch() {
  const [touch, setTouch] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(pointer: coarse)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(pointer: coarse)')
    const onChange = (e) => setTouch(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  return touch
}
