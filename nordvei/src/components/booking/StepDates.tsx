import { useState } from 'react'
import { groupDiscounts, limits, months } from '../../data/trip'
import { addDays, formatDate, toISODate } from '../../lib/format'
import { discountFor } from '../../lib/pricing'
import { checkSeason, firstBookableDate, routeFor } from '../../lib/route'
import { IconCalendar, IconInfo } from '../icons'
import { Field } from './Field'
import { NumberStepper } from './NumberStepper'
import type { StepProps } from './types'

const hikerMessages = {
  min: 'Solo hikers are very welcome: about half our guests come alone.',
  max: 'Eight is our group maximum. For a bigger group, email us and we can arrange a private departure.',
}

/** Suggested departures in the next season that are still in the future and fit the chosen length. */
function suggestions(days: number) {
  const first = firstBookableDate()
  const year = first.getFullYear()
  const firstSaturday = (month: number) => {
    const d = new Date(year, month, 1)
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
    return d
  }
  return [
    { label: 'White nights', date: firstSaturday(5) },
    { label: 'High summer', date: addDays(firstSaturday(6), 7) },
    { label: 'Autumn colours', date: firstSaturday(8) },
  ]
    .filter((s) => s.date >= first)
    .map((s) => ({ ...s, iso: toISODate(s.date) }))
    .filter((s) => checkSeason(s.iso, days).ok)
}

export function StepDates({ draft, update, showErrors }: StepProps) {
  const [touched, setTouched] = useState(false)
  const today = new Date()
  const min = toISODate(addDays(today, 1))
  const max = toISODate(new Date(today.getFullYear() + 2, 11, 31))
  const season = checkSeason(draft.startDate, draft.days)
  const route = routeFor(draft.days)
  const error = (touched || showErrors) && !season.ok ? season.reason : undefined
  const discount = discountFor(draft.hikers)
  const nextTier = groupDiscounts.find((g) => g.minHikers > draft.hikers)
  const [limitMsg, setLimitMsg] = useState<'min' | 'max' | null>(null)
  const atLimit = draft.hikers === limits.minHikers ? 'min' : draft.hikers === limits.maxHikers ? 'max' : null

  return (
    <div className="step">
      <Field
        id="start-date"
        label="Start date"
        error={error}
        hint={`Guided departures run from 1 ${months[limits.seasonStartMonth - 1].month} to ${new Date(
          2000,
          limits.seasonEndMonth,
          0,
        ).getDate()} ${months[limits.seasonEndMonth - 1].month}. Your trip is ${draft.days} days long.`}
      >
        {(aria) => (
          <div className="date-input">
            <IconCalendar className="date-input__icon" />
            <input
              {...aria}
              type="date"
              className="input"
              min={min}
              max={max}
              value={draft.startDate}
              onChange={(e) => {
                update({ startDate: e.target.value })
                setTouched(true)
              }}
              onBlur={() => setTouched(true)}
            />
          </div>
        )}
      </Field>

      {suggestions(draft.days).length > 0 && (
        <div className="suggestions" role="group" aria-label="Suggested start dates">
          {suggestions(draft.days).map((s) => (
            <button
              key={s.iso}
              type="button"
              className={`chip chip--wide ${draft.startDate === s.iso ? 'is-selected' : ''}`}
              aria-pressed={draft.startDate === s.iso}
              onClick={() => {
                update({ startDate: s.iso })
                setTouched(true)
              }}
            >
              <span className="chip__label">{s.label}</span>
              <span className="chip__value">{formatDate(s.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            </button>
          ))}
        </div>
      )}

      {season.month && (
        <div className={`season-card card card--inset ${season.ok ? 'is-ok' : 'is-off'}`} aria-live="polite">
          <div className="season-card__head">
            <span className="tag">{season.ok ? 'In season' : 'Outside the guided season'}</span>
            <p className="h4">
              {season.month.month}: {season.month.title}
            </p>
          </div>
          <p className="muted small">{season.month.note}</p>
          <dl className="stat-row stat-row--small">
            <div>
              <dt>High / low</dt>
              <dd>
                {season.month.high}° / {season.month.low}°C
              </dd>
            </div>
            <div>
              <dt>Daylight</dt>
              <dd>{Math.round(season.month.daylight)} hours</dd>
            </div>
            {season.ok && (
              <div>
                <dt>You finish</dt>
                <dd>
                  {formatDate(season.end, { weekday: 'short', day: 'numeric', month: 'short' })} at {route.to}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <hr className="divider" />

      <NumberStepper
        id="hikers"
        label="Number of hikers"
        value={draft.hikers}
        min={limits.minHikers}
        max={limits.maxHikers}
        unit={['hiker', 'hikers']}
        onChange={(v) => {
          update({ hikers: v })
          setLimitMsg(null)
        }}
        onLimit={(which) => setLimitMsg(which)}
      />
      <p className={`note ${atLimit ? 'is-visible' : ''}`} aria-live="polite">
        {(limitMsg ?? atLimit) && (
          <>
            <IconInfo />
            <span>{hikerMessages[(limitMsg ?? atLimit)!]}</span>
          </>
        )}
      </p>
      <p className="field__hint">
        {discount > 0 ? `Your group gets ${discount}% off the trip price. ` : ''}
        {nextTier
          ? `Add ${nextTier.minHikers - draft.hikers} more ${
              nextTier.minHikers - draft.hikers === 1 ? 'hiker' : 'hikers'
            } for ${nextTier.percent}% off.`
          : ''}
      </p>
    </div>
  )
}
