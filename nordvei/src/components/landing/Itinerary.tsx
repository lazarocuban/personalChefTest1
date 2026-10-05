import { useState } from 'react'
import { Link } from 'react-router'
import { limits, stages, tripVersions } from '../../data/trip'
import { routeFor } from '../../lib/route'
import { Disclosure } from '../Disclosure'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const lengths = Array.from({ length: limits.maxDays - limits.minDays + 1 }, (_, i) => limits.minDays + i)

export function Itinerary() {
  const [days, setDays] = useState(5)
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]))
  const route = routeFor(days)
  const version = [...tripVersions].reverse().find((v) => v.days <= days)

  const toggle = (day: number) =>
    setOpenDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })

  const allOpen = stages.slice(0, days).every((s) => openDays.has(s.day))

  return (
    <Section
      id="itinerary"
      eyebrow="Day by day"
      title="One trail, any length from 3 to 10 days."
      lead="Every trip starts at Fjellstad and follows the same path. A shorter trip simply leaves the trail earlier, by boat, ferry, minibus or train. Choose a length to see your days."
    >
      <Reveal className="versions">
        {tripVersions.map((v) => (
          <button
            key={v.days}
            type="button"
            className={`version card ${days === v.days ? 'is-selected' : ''}`}
            aria-pressed={days === v.days}
            onClick={() => setDays(v.days)}
          >
            <span className="version__days">{v.days} days</span>
            <span className="version__name">{v.name}</span>
            <span className="version__desc">{v.description}</span>
          </button>
        ))}
      </Reveal>

      <Reveal className="itinerary-bar card">
        <div role="group" aria-labelledby="length-picker-label" className="length-picker">
          <span id="length-picker-label" className="length-picker__label">
            Trip length
          </span>
          <div className="length-picker__options">
            {lengths.map((n) => (
              <button
                key={n}
                type="button"
                className={`chip ${n === days ? 'is-selected' : ''}`}
                aria-pressed={n === days}
                aria-label={`${n} days`}
                onClick={() => setDays(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <p className="itinerary-bar__summary" aria-live="polite">
          <strong>
            {days} days{version && version.days === days ? ` · ${version.name}` : ''}
          </strong>
          <span>
            {route.km} km · {route.nights} nights · {route.from} to {route.to}
          </span>
        </p>
        <button
          type="button"
          className="btn btn--sm btn--surface"
          onClick={() =>
            setOpenDays(allOpen ? new Set() : new Set(stages.slice(0, days).map((s) => s.day)))
          }
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </Reveal>

      <ol className="days">
        {stages.map((s) => {
          const onTrip = s.day <= days
          const isLast = s.day === days
          return (
            <li key={s.day} className={`day ${onTrip ? '' : 'is-off'}`}>
              <Disclosure
                open={onTrip && openDays.has(s.day)}
                onToggle={() => (onTrip ? toggle(s.day) : setDays(s.day))}
                summary={
                  <>
                    <span className="day__num">Day {s.day}</span>
                    <span className="day__title">
                      {s.title}
                      <span className="day__route">
                        {s.from} to {s.to}
                      </span>
                    </span>
                    <span className="day__meta">
                      {onTrip ? (
                        <>
                          {s.km} km{isLast && <span className="tag">Last day</span>}
                        </>
                      ) : (
                        <span className="day__off">Add {s.day - days} more {s.day - days === 1 ? 'day' : 'days'}</span>
                      )}
                    </span>
                  </>
                }
              >
                <p className="day__summary">{s.summary}</p>
                <dl className="day__grid">
                  <div>
                    <dt>Distance</dt>
                    <dd>
                      {s.km} km · +{s.ascent} m / −{s.descent} m
                    </dd>
                  </div>
                  <div>
                    <dt>Terrain</dt>
                    <dd>{s.terrain}</dd>
                  </div>
                  <div>
                    <dt>{isLast ? 'Getting home' : 'Accommodation'}</dt>
                    <dd>{isLast || !s.sleep ? s.exit : `${s.sleep.name} (${s.sleep.type === 'hut' ? 'mountain hut' : 'lakeside cabin'})`}</dd>
                  </div>
                  <div>
                    <dt>Meals</dt>
                    <dd>{isLast && s.sleep ? 'Breakfast and packed lunch, then home' : s.meals}</dd>
                  </div>
                </dl>
              </Disclosure>
            </li>
          )
        })}
      </ol>

      <Reveal className="center-row">
        <Link to="/book" className="btn btn--surface">
          Choose your length and dates
        </Link>
      </Reveal>
    </Section>
  )
}
