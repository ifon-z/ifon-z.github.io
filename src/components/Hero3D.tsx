import { useEffect, useState, type ComponentType, type RefObject } from 'react'

/* ---------------------------------------------------------------------------
   Lightweight loader gate for the WebGL hero.

   This file must stay tiny and must never statically import ./HeroScene — the
   dynamic import() below is what keeps three.js out of the initial chunk.
   Vite warns with INEFFECTIVE_DYNAMIC_IMPORT if that boundary is broken.
--------------------------------------------------------------------------- */

type SceneProps = { scrollRef: RefObject<number>; onReady?: () => void }
type Scene = ComponentType<SceneProps>

export function Hero3DStage({
  scrollRef,
  onReady,
}: {
  scrollRef: RefObject<number>
  onReady?: () => void
}) {
  const [Scene, setScene] = useState<Scene | null>(null)

  useEffect(() => {
    // Respect the OS motion preference and save-data before fetching ~150 kB.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    let cancelled = false
    const load = () => {
      import('./HeroScene')
        .then((module) => {
          if (!cancelled) setScene(() => module.default)
        })
        .catch(() => {
          // A failed chunk must never break the page — the CSS poster remains.
        })
    }

    const idleCallback = window.requestIdleCallback
    let timer: number | undefined
    let idle: number | undefined

    if (typeof idleCallback === 'function') {
      idle = idleCallback.call(window, load, { timeout: 2000 })
    } else {
      timer = window.setTimeout(load, 600)
    }

    return () => {
      cancelled = true
      if (idle !== undefined && window.cancelIdleCallback) window.cancelIdleCallback(idle)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])

  if (!Scene) return null
  return <Scene scrollRef={scrollRef} onReady={onReady} />
}
