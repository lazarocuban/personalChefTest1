import { useEffect, useRef, useState } from 'react'

const reducedQuery = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(reducedQuery).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(reducedQuery)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** True once the element has scrolled into view (stays true). */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
  }, [inView]) // options are read once on mount
  return { ref, inView }
}

/** Counts from 0 to `target` once `start` is true. Jumps straight to the target with reduced motion. */
export function useCountUp(target: number, start: boolean, duration = 1800): number {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    if (reduced) {
      setValue(target)
      return
    }
    let frame = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, start, duration, reduced])
  return value
}

/** Writes a slow scroll-linked translate to the element (hero parallax). */
export function useParallax<T extends HTMLElement>(factor = 0.25) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.style.transform = ''
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.min(window.scrollY, window.innerHeight * 1.2)
      el.style.transform = `translate3d(0, ${y * factor}px, 0) scale(1.06)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [factor, reduced])
  return ref
}
