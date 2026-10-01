import { useEffect } from 'react'

const REVEAL_CLASS = 'js-reveal'

/** True when the visitor asked for less motion — checked once and cached. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * One IntersectionObserver for the whole page, registered once.
 *
 * Content is visible by default in CSS; this hook only *adds* the fade/slide
 * (see `.js-reveal [data-reveal]`). If JS is blocked, the observer never fires,
 * or the browser lacks IntersectionObserver, every element still renders.
 *
 * Scroll-driven CSS animations (`animation-timeline: view()`) are deliberately
 * not used as the only mechanism — Firefox has not shipped them, so content
 * revealed that way would be permanently invisible there.
 */
export function useReveal(): void {
  useEffect(() => {
    const root = document.documentElement
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return

    // Stagger siblings so a grid arrives as a wave rather than all at once.
    const seen = new Map<Element, number>()
    for (const el of targets) {
      const parent = el.parentElement
      if (!parent) continue
      const index = seen.get(parent) ?? 0
      el.style.setProperty('--reveal-i', String(Math.min(index, 6)))
      seen.set(parent, index + 1)
    }

    root.classList.add(REVEAL_CLASS)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    for (const el of targets) observer.observe(el)

    return () => {
      observer.disconnect()
      root.classList.remove(REVEAL_CLASS)
    }
  }, [])
}

/**
 * Adds a border to the sticky top bar once the page has moved, without
 * re-rendering React on every scroll event.
 */
export function useTopbarStuck(className = 'topbar-stuck'): void {
  useEffect(() => {
    const bar = document.querySelector('.topbar')
    if (!bar) return
    let frame = 0
    const sync = () => {
      frame = 0
      bar.classList.toggle(className, window.scrollY > 8)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(sync)
    }
    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [className])
}

/**
 * Magnetic pull on pointer hover. Pure compositor transform, no dependencies.
 * Skips touch devices (a magnetic button on a touchscreen is just a delay)
 * and visitors who asked for reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = (el: T | null) => {
    if (!el || prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    let dx = 0
    let dy = 0

    const apply = () => {
      frame = 0
      el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`
    }

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      dx = (event.clientX - (rect.left + rect.width / 2)) * strength
      dy = (event.clientY - (rect.top + rect.height / 2)) * strength
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      dx = 0
      dy = 0
      el.style.transform = 'translate3d(0, 0, 0)'
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
  }

  return ref
}
