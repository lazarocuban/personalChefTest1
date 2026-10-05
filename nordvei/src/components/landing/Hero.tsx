import { Link } from 'react-router'
import { useParallax } from '../../hooks/motion'
import { scrollToSection } from '../../lib/scrollTo'
import { IconArrowRight } from '../icons'
import { Photo } from '../Photo'

export function Hero() {
  const parallax = useParallax<HTMLDivElement>(0.22)
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Photo image="hero" overlay="hero" eager className="hero__photo" ref={parallax} />
      </div>
      <div className="hero__content container">
        <p className="eyebrow hero__eyebrow">Guided hut-to-hut hiking · Southern Norway</p>
        <h1 id="hero-title" className="h1 hero__title">
          Walk into the quiet north.
        </h1>
        <p className="hero__lead">
          Three to ten days on foot between still lakes, old spruce forest and open fjell. Small groups, two guides,
          a warm hut at the end of every day.
        </p>
        <div className="hero__actions">
          <Link to="/book" className="btn btn--primary btn--lg">
            Book your trip
          </Link>
          <a
            href="#route"
            className="btn btn--ghost btn--lg"
            onClick={(e) => {
              if (scrollToSection('route')) e.preventDefault()
            }}
          >
            Explore the route
            <IconArrowRight size={18} />
          </a>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
