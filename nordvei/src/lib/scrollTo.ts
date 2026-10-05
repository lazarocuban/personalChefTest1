/** Smoothly scroll to a section, move focus there for keyboard and screen reader users, and update the hash. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  el.focus({ preventScroll: true })
  history.replaceState(null, '', `#${id}`)
  return true
}
