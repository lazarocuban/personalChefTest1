import { Link } from 'react-router'
import { brand } from '../data/trip'
import { IconInfo } from './icons'
import { Logo } from './Logo'
import { navLinks } from './Nav'

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        {!minimal && (
          <div className="footer__grid">
            <div className="footer__brand">
              <Logo />
              <p className="muted">{brand.tagline}</p>
            </div>
            <nav aria-label="Footer">
              <h2 className="footer__heading">The trip</h2>
              <ul className="footer__list">
                {navLinks.map((l) => (
                  <li key={l.id}>
                    <a href={`/#${l.id}`}>{l.label}</a>
                  </li>
                ))}
                <li>
                  <Link to="/book">Book your trip</Link>
                </li>
              </ul>
            </nav>
            <div>
              <h2 className="footer__heading">Contact</h2>
              <ul className="footer__list">
                <li>
                  <a href={`mailto:${brand.email}`}>{brand.email}</a>
                </li>
                <li className="muted">{brand.phone}</li>
                <li className="muted">Fjellstad, Norway</li>
              </ul>
            </div>
          </div>
        )}

        <p className="disclaimer" role="note">
          <IconInfo />
          <span>
            {brand.name} is a fictional company and this site is a design demo. No bookings are made, nothing is
            charged and no emails are sent. Photos from Unsplash.
          </span>
        </p>
        <p className="footer__legal">
          © {year} {brand.name}. Walk softly.
        </p>
      </div>
    </footer>
  )
}
