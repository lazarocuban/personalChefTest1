import { useRef, useState, type KeyboardEvent } from 'react'
import { limits, months } from '../../data/trip'
import { IconSun } from '../icons'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const maxDaylight = 24
const isGuided = (i: number) => i + 1 >= limits.seasonStartMonth && i + 1 <= limits.seasonEndMonth

export function Seasons() {
  const [index, setIndex] = useState(6)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const m = months[index]
  const guided = isGuided(index)
  const hours = Math.floor(m.daylight)
  const minutes = Math.round((m.daylight - hours) * 60)

  // Roving focus across the month tabs with arrow keys, Home and End.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    let next: number | null = null
    if (e.key in keys) next = (index + keys[e.key] + 12) % 12
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = 11
    if (next === null) return
    e.preventDefault()
    setIndex(next)
    tabs.current[next]?.focus()
  }

  return (
    <Section
      id="seasons"
      eyebrow="Seasons and weather"
      title="Four months of open trail."
      lead={`Huts open in ${months[limits.seasonStartMonth - 1].month} and close at the end of ${
        months[limits.seasonEndMonth - 1].month
      }. Pick a month to see the light, the temperatures and what the trail is like.`}
    >
      <Reveal className="card seasons">
        <div className="seasons__chart" role="tablist" aria-label="Months" onKeyDown={onKeyDown}>
          {months.map((mo, i) => (
            <button
              key={mo.month}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`month-tab-${i}`}
              aria-selected={i === index}
              aria-controls="month-panel"
              tabIndex={i === index ? 0 : -1}
              className={`month ${i === index ? 'is-selected' : ''} ${isGuided(i) ? 'is-guided' : ''}`}
              onClick={() => setIndex(i)}
            >
              <span className="month__bar-wrap" aria-hidden="true">
                <span className="month__bar" style={{ height: `${(mo.daylight / maxDaylight) * 100}%` }} />
              </span>
              <span className="month__label">{mo.short}</span>
              <span className="sr-only">{isGuided(i) ? ', guided departures' : ', no guided hikes'}</span>
            </button>
          ))}
        </div>
        <p className="seasons__axis" aria-hidden="true">
          Bar height shows hours of daylight. Brighter bars are our guided months.
        </p>

        <div
          id="month-panel"
          role="tabpanel"
          aria-labelledby={`month-tab-${index}`}
          className="seasons__panel"
          key={m.month}
        >
          <div className="seasons__head">
            <p className="eyebrow">
              {m.month} · {guided ? 'Guided departures' : 'No guided hikes'}
            </p>
            <h3 className="h3 seasons__title">{m.title}</h3>
            <p className="muted">{m.note}</p>
          </div>
          <dl className="seasons__stats">
            <div>
              <dt>Daytime high</dt>
              <dd>{m.high}°C</dd>
            </div>
            <div>
              <dt>Night low</dt>
              <dd>{m.low}°C</dd>
            </div>
            <div>
              <dt>Daylight</dt>
              <dd>
                {hours} h {minutes > 0 ? `${minutes} min` : ''}
              </dd>
            </div>
          </dl>
          <div className="daylight" aria-hidden="true">
            <IconSun size={16} />
            <span className="daylight__track">
              <span
                className="daylight__fill"
                style={{
                  left: `${((24 - m.daylight) / 2 / 24) * 100}%`,
                  width: `${(m.daylight / 24) * 100}%`,
                }}
              />
            </span>
            <span className="daylight__label">24 h</span>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
