import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { useActiveSection, useScrolledPast } from '../hooks/scroll'
import { scrollToSection } from '../lib/scrollTo'
import { IconArrowLeft, IconClose, IconMenu } from './icons'
import { Logo } from './Logo'

export const navLinks = [
  { id: 'route', label: 'The Route' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'seasons', label: 'Seasons' },
  { id: 'gear', label: 'Gear' },
  { id: 'faq', label: 'FAQ' },
]

const sectionIds = navLinks.map((l) => l.id)

/** Landing page navigation: transparent over the hero, frosted glass once scrolled. */
export function Nav() {
  const scrolled = useScrolledPast(24)
  // The nav CTA becomes the green primary only once the hero (and its own green button) is out of view.
  const pastHero = useScrolledPast(typeof window === 'undefined' ? 600 : window.innerHeight * 0.7)
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 960 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (scrollToSection(id)) e.preventDefault()
    setOpen(false)
  }

  return (
    <header className={`nav ${scrolled || open ? 'nav--glass' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner container">
        <Logo onClick={() => window.scrollTo({ top: 0 })} />

        <nav className="nav__links" aria-label="Sections">
          <ul>
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={`nav__link ${active === l.id ? 'is-active' : ''}`}
                  aria-current={active === l.id ? 'location' : undefined}
                  onClick={(e) => go(e, l.id)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <Link to="/book" className={`btn btn--sm ${pastHero ? 'btn--primary' : 'btn--ghost'} nav__cta`}>
            Book your trip
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="nav__menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="nav__mobile" hidden={!open}>
        <nav aria-label="Sections" className="container">
          <ul>
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="nav__mobile-link" onClick={(e) => go(e, l.id)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link to="/book" className="btn btn--primary btn--block" onClick={() => setOpen(false)}>
            Book your trip
          </Link>
        </nav>
      </div>
    </header>
  )
}

/** Booking flow header: no distractions, just a way home. */
export function BookingNav() {
  return (
    <header className="nav nav--glass nav--booking">
      <div className="nav__inner container">
        <Logo />
        <Link to="/" className="btn btn--sm btn--ghost">
          <IconArrowLeft size={16} />
          <span>Back to the trip</span>
        </Link>
      </div>
    </header>
  )
}
