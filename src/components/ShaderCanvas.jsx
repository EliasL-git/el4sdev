import React, { useEffect, useRef } from 'react'
import useReducedMotion from '../lib/useReducedMotion'
import styles from './ShaderCanvas.module.css'

const VERT_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_uv;
out vec2 v_uv;
void main() {
  v_uv = a_uv;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAG_SHADER = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_image;
uniform vec2 u_cursor;       // 0..1 in uv space
uniform vec2 u_resolution;
uniform vec2 u_imageAspect;  // (cover-fit scale x,y)
uniform float u_time;
uniform float u_hover;       // 0..1 intensity

void main() {
  // Cover-fit uv (preserves aspect, fills the canvas)
  vec2 uv = (v_uv - 0.5) * u_imageAspect + 0.5;

  // Distance from cursor in 0..1 space
  vec2 d = v_uv - u_cursor;
  float dist = length(d);

  // Local displacement — strong near cursor, decays fast
  float push = exp(-dist * 5.5) * (0.025 + 0.045 * u_hover);
  vec2 displaced = uv - d * push;

  // RGB channel split — widens near cursor and with hover
  float sep = 0.003 + 0.012 * exp(-dist * 3.5) * (0.4 + u_hover);

  float r = texture(u_image, displaced + vec2(sep, sep * 0.4)).r;
  float g = texture(u_image, displaced).g;
  float b = texture(u_image, displaced - vec2(sep, sep * 0.4)).b;

  vec3 col = vec3(r, g, b);

  // Subtle scan + grain (brutalist roughness)
  float scan = sin(v_uv.y * u_resolution.y * 1.25 + u_time * 0.8) * 0.012;
  col -= scan;

  float grain = fract(sin(dot(v_uv * u_resolution + u_time * 60.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.06;

  // Tighten contrast — brutalist crush
  col = clamp(col, 0.0, 1.0);
  col = pow(col, vec3(1.06));

  // Hard vignette stamp at far corners
  float vig = smoothstep(1.05, 0.55, length(v_uv - 0.5));
  col *= 0.85 + 0.15 * vig;

  fragColor = vec4(col, 1.0);
}`

function compileShader(gl, source, type) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, source)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('Shader compile error:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function linkProgram(gl, vs, fs) {
  const p = gl.createProgram()
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('Program link error:', gl.getProgramInfoLog(p))
    return null
  }
  return p
}

/**
 * Vanilla WebGL2 image canvas with cursor-driven RGB split + displacement.
 * Falls back to a plain <img> if WebGL2 is unavailable or reduced-motion.
 *
 * Props:
 *   - src: image URL
 *   - alt: alt text (used on the fallback img)
 *   - className: extra class for the wrapper
 */
export default function ShaderCanvas({ src, alt = '', className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const fallbackRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    if (reduced) {
      // Show fallback only
      canvas.style.display = 'none'
      if (fallbackRef.current) fallbackRef.current.style.display = 'block'
      return
    }

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) {
      canvas.style.display = 'none'
      if (fallbackRef.current) fallbackRef.current.style.display = 'block'
      return
    }

    const vs = compileShader(gl, VERT_SHADER, gl.VERTEX_SHADER)
    const fs = compileShader(gl, FRAG_SHADER, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return
    const program = linkProgram(gl, vs, fs)
    if (!program) return

    // Fullscreen quad
    const positions = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
      -1,  1, 0, 0,
       1, -1, 1, 1,
       1,  1, 1, 0,
    ])
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'a_position')
    const aUv = gl.getAttribLocation(program, 'a_uv')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(aUv)
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8)

    // Texture
    const tex = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    // Placeholder 1x1 black pixel until image loads
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    let imageWidth = 1
    let imageHeight = 1
    let imageReady = false

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageWidth = img.naturalWidth
      imageHeight = img.naturalHeight
      imageReady = true
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    }
    img.src = src

    // Uniform locations
    gl.useProgram(program)
    const uImage = gl.getUniformLocation(program, 'u_image')
    const uCursor = gl.getUniformLocation(program, 'u_cursor')
    const uRes = gl.getUniformLocation(program, 'u_resolution')
    const uAspect = gl.getUniformLocation(program, 'u_imageAspect')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uHover = gl.getUniformLocation(program, 'u_hover')
    gl.uniform1i(uImage, 0)

    // State
    const state = {
      cx: 0.5,
      cy: 0.5,
      tcx: 0.5,
      tcy: 0.5,
      hover: 0,
      thover: 0,
      width: 0,
      height: 0,
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (w === state.width && h === state.height) return
      state.width = w
      state.height = h
      canvas.width = w
      canvas.height = h
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      gl.viewport(0, 0, w, h)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    function onPointerMove(e) {
      const r = wrap.getBoundingClientRect()
      state.tcx = (e.clientX - r.left) / r.width
      state.tcy = 1 - (e.clientY - r.top) / r.height
      state.thover = 1
    }
    function onPointerLeave() {
      state.tcx = 0.5
      state.tcy = 0.5
      state.thover = 0
    }
    wrap.addEventListener('pointermove', onPointerMove, { passive: true })
    wrap.addEventListener('pointerleave', onPointerLeave, { passive: true })

    // Render loop
    const start = performance.now()
    let raf = 0
    function render(now) {
      const t = (now - start) / 1000
      // Lerp cursor + hover
      state.cx += (state.tcx - state.cx) * 0.12
      state.cy += (state.tcy - state.cy) * 0.12
      state.hover += (state.thover - state.hover) * 0.08

      gl.useProgram(program)
      gl.bindVertexArray(vao)
      gl.uniform2f(uCursor, state.cx, state.cy)
      gl.uniform2f(uRes, state.width, state.height)
      gl.uniform1f(uTime, t)
      gl.uniform1f(uHover, state.hover)

      // Compute cover-fit aspect scale
      let sx = 1
      let sy = 1
      if (imageReady && state.width > 0 && state.height > 0) {
        const canvasAspect = state.width / state.height
        const imageAspect = imageWidth / imageHeight
        if (imageAspect > canvasAspect) {
          // Image wider — scale uv x in (sample narrower width range)
          sx = canvasAspect / imageAspect
        } else {
          sy = imageAspect / canvasAspect
        }
      }
      gl.uniform2f(uAspect, sx, sy)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      gl.deleteVertexArray(vao)
      gl.deleteTexture(tex)
    }
  }, [src, reduced])

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className}`}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label={alt} />
      <img
        ref={fallbackRef}
        src={src}
        alt={alt}
        className={styles.fallback}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}
