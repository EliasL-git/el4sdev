/**
 * Glitch text controller — feeds shuffled characters into a target span
 * until each character lands on the final value. Pure DOM, no React, no
 * lib dependency.
 *
 * Usage:
 *   const stop = glitch(spanEl, 'EL4S', { duration: 700 })
 *   // stop() to cancel before completion
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>+=/\\'

export function glitch(node, target, opts = {}) {
  if (!node) return () => {}
  const duration = opts.duration ?? 700
  const stagger = opts.stagger ?? 28        // ms between each char landing
  const chunk = opts.chunk ?? 22            // ms per frame
  const filler = opts.filler ?? ALPHABET
  const start = performance.now()

  const targetChars = Array.from(target)
  // Lock-time per character: the moment it stops shuffling and shows the real char.
  const lockTimes = targetChars.map((_, i) => i * stagger + (duration - stagger * targetChars.length) * (i / Math.max(1, targetChars.length - 1)))

  let raf = 0
  let cancelled = false

  function frame(now) {
    if (cancelled) return
    const elapsed = now - start
    let allLocked = true
    const out = targetChars.map((ch, i) => {
      if (ch === ' ') return ' '
      if (elapsed >= lockTimes[i]) return ch
      allLocked = false
      // Pick a random filler char each chunk window
      const seed = Math.floor(elapsed / chunk) + i
      const idx = ((seed * 9301 + 49297) % 233280) / 233280
      return filler.charAt(Math.floor(idx * filler.length))
    })
    node.textContent = out.join('')
    if (allLocked) {
      node.textContent = target
      return
    }
    raf = requestAnimationFrame(frame)
  }

  raf = requestAnimationFrame(frame)
  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
    node.textContent = target
  }
}

/**
 * Trigger glitch on every node matching `[data-glitch]`. Reads the target
 * text from each node's textContent at call time.
 */
export function glitchAll(root = document, opts) {
  const nodes = root.querySelectorAll('[data-glitch]')
  const stops = []
  nodes.forEach((n) => {
    const target = n.dataset.glitchText || n.textContent
    stops.push(glitch(n, target, opts))
  })
  return () => stops.forEach((s) => s())
}
