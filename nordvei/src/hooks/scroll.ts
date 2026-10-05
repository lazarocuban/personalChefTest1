import { useEffect, useState } from 'react'

/** True when the page is scrolled past `offset` pixels. */
export function useScrolledPast(offset: number): boolean {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return past
}

/** The id of the section currently under the top third of the viewport. */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')
  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    if (!els.length || !('IntersectionObserver' in window)) return

    const visible = new Map<string, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting)
        const first = els.find((el) => visible.get(el.id))
        setActive(first ? first.id : null)
      },
      // A thin band a third of the way down the screen decides the active section.
      { rootMargin: '-33% 0px -66% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return active
}
