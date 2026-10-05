import { useState, type CSSProperties } from 'react'
import { accommodationLevels, limits, stages } from '../../data/trip'
import { formatMoney, plural } from '../../lib/format'
import { quote } from '../../lib/pricing'
import { describeNights, routeFor } from '../../lib/route'
import { IconInfo } from '../icons'
import { NumberStepper } from './NumberStepper'
import { versionName } from './Summary'
import type { StepProps } from './types'

const limitMessages = {
  min: 'Three days is our shortest Nordvei: two lakes, one ancient forest and a sauna at the finish.',
  max: 'Ten days is the whole trail, station to station. There is no more Nordvei to walk!',
}

export function StepLength({ draft, update }: StepProps) {
  const [nudge, setNudge] = useState(0)
  const { days } = draft
  const route = routeFor(days)
  const q = quote(draft)
  const level = accommodationLevels.find((l) => l.id === draft.level)
  const atLimit = days === limits.minDays ? 'min' : days === limits.maxDays ? 'max' : null
  const fill = ((days - limits.minDays) / (limits.maxDays - limits.minDays)) * 100
  const name = versionName(days)

  return (
    <div className="step">
      <div className="length-readout">
        <span className="length-readout__num">{days}</span>
        <span className="length-readout__unit">
          days
          {name && <span className="length-readout__name">{name}</span>}
        </span>
      </div>

      <div className="slider">
        <label htmlFor="days-slider" className="sr-only">
          Trip length in days
        </label>
        <input
          id="days-slider"
          type="range"
          min={limits.minDays}
          max={limits.maxDays}
          step={1}
          value={days}
          style={{ '--fill': `${fill}%` } as CSSProperties}
          aria-valuetext={`${days} days, ${route.from} to ${route.to}`}
          onChange={(e) => update({ days: Number(e.target.value) })}
        />
        <div className="slider__ticks" aria-hidden="true">
          {Array.from({ length: limits.maxDays - limits.minDays + 1 }, (_, i) => limits.minDays + i).map((n) => (
            <span key={n} className={n === days ? 'is-current' : n < days ? 'is-past' : ''}>
              {n}
            </span>
          ))}
        </div>
      </div>

      <NumberStepper
        id="days"
        label="Or step a day at a time"
        value={days}
        min={limits.minDays}
        max={limits.maxDays}
        unit={['day', 'days']}
        onChange={(v) => update({ days: v })}
        onLimit={() => setNudge((n) => n + 1)}
      />

      <p className={`note ${atLimit ? 'is-visible' : ''} ${nudge ? 'is-nudged' : ''}`} aria-live="polite" key={nudge}>
        {atLimit && (
          <>
            <IconInfo />
            <span>{limitMessages[atLimit]}</span>
          </>
        )}
      </p>

      <div className="route-strip" aria-hidden="true">
        {stages.map((s) => (
          <span key={s.day} className={s.day <= days ? 'is-on' : ''} title={`Day ${s.day}: ${s.to}`} />
        ))}
      </div>

      <dl className="live-summary">
        <div>
          <dt>Route covered</dt>
          <dd>
            {route.from} to {route.to}
          </dd>
        </div>
        <div>
          <dt>Distance</dt>
          <dd>
            {route.km} km · +{route.ascent.toLocaleString('en-GB')} m climbing
          </dd>
        </div>
        <div>
          <dt>Nights</dt>
          <dd>{plural(route.nights, 'night')} on the trail</dd>
        </div>
        <div>
          <dt>Accommodation</dt>
          <dd>
            {level?.name}: {describeNights(days, draft.level)}
          </dd>
        </div>
        <div className="live-summary__price">
          <dt>Total for {plural(draft.hikers, 'hiker')}</dt>
          <dd>{formatMoney(q.total)}</dd>
        </div>
      </dl>
      <p className="field__hint">
        You finish at {route.to}. {route.exit.replace(/^\d+-day trips end here: /, 'Getting home: ')}
      </p>
    </div>
  )
}
