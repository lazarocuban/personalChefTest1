import { useState } from 'react'
import { Link } from 'react-router'
import { faq, testimonials } from '../../data/trip'
import { Disclosure } from '../Disclosure'
import { Photo } from '../Photo'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function Testimonials() {
  return (
    <Section id="stories" eyebrow="From the trail" title="What hikers remember.">
      <div className="grid-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} as="figure" className="card quote" delay={i * 120}>
            <blockquote>
              <p>“{t.quote}”</p>
            </blockquote>
            <figcaption>
              <span className="quote__name">{t.name}</span>
              <span className="quote__detail">{t.detail}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions, answered.">
      <Reveal className="faq">
        {faq.map((item, i) => (
          <Disclosure
            key={item.q}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            summary={<span className="faq__q">{item.q}</span>}
          >
            <p className="muted">{item.a}</p>
          </Disclosure>
        ))}
      </Reveal>
    </Section>
  )
}

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <Photo image="ridges" overlay="strong" className="final-cta__photo" />
      <Reveal className="final-cta__content container">
        <p className="eyebrow">Summer departures, June to September</p>
        <h2 id="final-cta-title" className="h1">
          The lakes are waiting.
        </h2>
        <p className="lead">Choose three days or ten. Either way, you will walk home quieter than you came.</p>
        <Link to="/book" className="btn btn--primary btn--lg">
          Book your trip
        </Link>
      </Reveal>
    </section>
  )
}
