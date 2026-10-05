import { safety } from '../../data/trip'
import { Photo } from '../Photo'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function Safety() {
  return (
    <Section
      id="safety"
      eyebrow="Safety and fitness"
      title="Is the Nordvei right for you?"
      lead="You don’t need to be an athlete. You do need to enjoy long days outside, whatever the weather."
    >
      <div className="grid-2">
        <Reveal className="card">
          <h3 className="h3">Fitness level</h3>
          <ul className="dot-list dot-list--loose">
            {safety.fitness.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="card" delay={120}>
          <h3 className="h3">Guides and safety</h3>
          <ul className="dot-list dot-list--loose">
            {safety.guides.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="card card--split roam">
        <Photo image="hikers" className="roam__photo" overlay="soft" />
        <div className="roam__body">
          <p className="eyebrow">
            <span lang="no">Allemannsretten</span>
          </p>
          <h3 className="h3">The right to roam, and how to honour it.</h3>
          <p className="muted">
            Norwegian law lets everyone walk, swim and camp on uncultivated land, even land that is privately owned.
            It is a freedom built on trust. We follow its etiquette closely and ask our hikers to do the same.
          </p>
          <ul className="dot-list dot-list--loose">
            {safety.allemannsretten.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
