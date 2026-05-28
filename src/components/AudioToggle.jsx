import React, { useEffect, useState } from 'react'
import { getAudioEnabled, setAudioEnabled, tick } from '../lib/audio'
import styles from './AudioToggle.module.css'

/**
 * Tiny corner pill toggling the hover-tick audio. State persists via
 * localStorage. Default off (so first visit is silent).
 */
export default function AudioToggle() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(getAudioEnabled())
  }, [])

  function flip() {
    const next = !on
    setAudioEnabled(next)
    setOn(next)
    if (next) tick({ frequency: 880, duration: 0.04, gain: 0.06 })
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      data-on={on ? 'true' : 'false'}
      onClick={flip}
      aria-label={on ? 'Mute hover ticks' : 'Enable hover ticks'}
      data-cursor={on ? 'mute' : 'sound'}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>
        sound · {on ? 'on' : 'off'}
      </span>
    </button>
  )
}
