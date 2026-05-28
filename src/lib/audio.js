/**
 * Web Audio hover-tick generator. Generates a tiny 28ms tone via an
 * OscillatorNode with an attack/release envelope — no audio files in
 * the repo. Singleton AudioContext is lazily created on first user
 * interaction (browsers block contexts created before any gesture).
 */

let ctx = null
let enabled = false

function ensureCtx() {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null
  try {
    ctx = new Ctor()
  } catch (_e) {
    return null
  }
  return ctx
}

export function setAudioEnabled(value) {
  enabled = !!value
  if (enabled) {
    // Touch the context so it's primed.
    const c = ensureCtx()
    if (c && c.state === 'suspended') c.resume().catch(() => {})
  }
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('el4s.audio', enabled ? '1' : '0')
    }
  } catch (_e) {
    /* ignore */
  }
}

export function getAudioEnabled() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem('el4s.audio') === '1'
  } catch (_e) {
    return false
  }
}

export function tick(opts = {}) {
  if (!enabled) return
  const c = ensureCtx()
  if (!c) return
  const now = c.currentTime
  const dur = opts.duration ?? 0.028
  const freq = opts.frequency ?? 1240
  const gainPeak = opts.gain ?? 0.045

  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(freq, now)

  // Attack/release envelope — quick blip, no click
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.003)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + dur + 0.01)
}

export function clack(opts = {}) {
  tick({ frequency: 720, duration: 0.04, gain: 0.06, ...opts })
}

// Init from storage on module load
if (typeof window !== 'undefined') {
  enabled = getAudioEnabled()
}
