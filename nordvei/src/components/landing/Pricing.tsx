import { Link } from 'react-router'
import { accommodationLevels, addOns, groupDiscounts, type AddOnUnit } from '../../data/trip'
import { formatMoney } from '../../lib/format'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const exampleLengths = [3, 5, 7, 10]

const unitLabel: Record<AddOnUnit, string> = {
  perPersonPerDay: 'per person, per day',
  perPerson: 'per person',
  perGroup: 'per group',
}

export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="One clear price per day."
      lead="Prices are per person and include guides, all meals, nights on the trail and transfers on the route."
    >
      <Reveal className="card table-card">
        <div className="table-scroll" role="region" aria-labelledby="price-table-caption" tabIndex={0}>
          <table className="price-table">
            <caption id="price-table-caption" className="sr-only">
              Price per person by accommodation level and trip length
            </caption>
            <thead>
              <tr>
                <th scope="col">Accommodation</th>
                <th scope="col">Per day</th>
                {exampleLengths.map((d) => (
                  <th scope="col" key={d}>
                    {d} days
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accommodationLevels.map((l) => (
                <tr key={l.id}>
                  <th scope="row">
                    <span className="price-table__name">{l.name}</span>
                    <span className="price-table__desc">{l.description}</span>
                  </th>
                  <td className="price-table__day">{formatMoney(l.perDay)}</td>
                  {exampleLengths.map((d) => (
                    <td key={d}>{formatMoney(l.perDay * d)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <div className="grid-2">
        <Reveal className="card">
          <h3 className="h3">Group discounts</h3>
          <p className="muted">Applied automatically to the trip price when you book together.</p>
          <dl className="price-list">
            <div>
              <dt>1–2 hikers</dt>
              <dd>Standard price</dd>
            </div>
            {groupDiscounts.map((g) => (
              <div key={g.minHikers}>
                <dt>{g.label}</dt>
                <dd>{g.percent}% off</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal className="card" delay={120}>
          <h3 className="h3">Extras</h3>
          <p className="muted">Add any of these in the booking flow.</p>
          <dl className="price-list">
            {addOns.map((a) => (
              <div key={a.id}>
                <dt>
                  {a.name}
                  <span className="price-list__note">{a.description}</span>
                </dt>
                <dd>
                  {formatMoney(a.price)}
                  <span className="price-list__unit">{unitLabel[a.unit]}</span>
                </dd>
              </div>
            ))}
            <div>
              <dt>
                Vegetarian or vegan meals
                <span className="price-list__note">Tell us when you book.</span>
              </dt>
              <dd>Free</dd>
            </div>
          </dl>
        </Reveal>
      </div>

      <Reveal className="center-row">
        <Link to="/book" className="btn btn--surface">
          Get an exact price for your group
        </Link>
      </Reveal>
    </Section>
  )
}
