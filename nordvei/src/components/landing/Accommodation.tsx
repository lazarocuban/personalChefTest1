import { accommodationTypes } from '../../data/trip'
import { Photo } from '../Photo'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function Accommodation() {
  return (
    <Section
      id="stay"
      eyebrow="Accommodation"
      title="A warm place at the end of every day."
      lead="Choose your level when you book. On every option, dinner is cooked for you and the sauna is usually lit."
    >
      <div className="grid-3">
        {accommodationTypes.map((a, i) => (
          <Reveal key={a.title} as="article" className="card card--media" delay={i * 120}>
            <Photo image={a.image} className="card__photo" overlay="soft" />
            <div className="card__body">
              <h3 className="h3">{a.title}</h3>
              <p className="muted">{a.body}</p>
              <ul className="dot-list">
                {a.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
