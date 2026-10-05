import { included, notIncluded } from '../../data/trip'
import { IconCheck, IconMinus } from '../icons'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function Included() {
  return (
    <Section id="included" eyebrow="The price covers" title="Everything on the trail is taken care of.">
      <div className="grid-2">
        <Reveal className="card">
          <h3 className="h3">Included</h3>
          <ul className="icon-list">
            {included.map((item) => (
              <li key={item}>
                <IconCheck className="icon-list__icon" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="card" delay={120}>
          <h3 className="h3">Not included</h3>
          <ul className="icon-list icon-list--muted">
            {notIncluded.map((item) => (
              <li key={item}>
                <IconMinus className="icon-list__icon" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
