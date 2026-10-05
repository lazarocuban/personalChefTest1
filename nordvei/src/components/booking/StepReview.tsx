import type { ReactNode } from 'react'
import { accommodationLevels, addOns, fitnessLevels, mealOptions } from '../../data/trip'
import { formatDate, formatMoney, parseISODate, plural } from '../../lib/format'
import { quote } from '../../lib/pricing'
import { describeNights, routeFor } from '../../lib/route'
import { ErrorText } from './Field'
import { versionName } from './Summary'
import type { StepProps } from './types'

type ReviewProps = StepProps & { onEdit: (step: number) => void }

function Block({ title, step, onEdit, children }: { title: string; step: number; onEdit: (s: number) => void; children: ReactNode }) {
  return (
    <section className="review-block" aria-labelledby={`review-${step}`}>
      <div className="review-block__head">
        <h2 id={`review-${step}`} className="h4">
          {title}
        </h2>
        <button type="button" className="link-btn" onClick={() => onEdit(step)}>
          Edit<span className="sr-only"> {title.toLowerCase()}</span>
        </button>
      </div>
      <dl className="review-list">{children}</dl>
    </section>
  )
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
)

export function StepReview({ draft, update, showErrors, onEdit }: ReviewProps) {
  const route = routeFor(draft.days)
  const q = quote(draft)
  const start = parseISODate(draft.startDate)
  const end = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + draft.days - 1) : null
  const name = versionName(draft.days)
  const t = draft.traveler
  const chosenAddOns = addOns.filter((a) => draft.addOns.includes(a.id))
  const termsError = showErrors && !draft.termsAccepted ? 'Please accept the terms to confirm your booking.' : undefined

  return (
    <div className="step">
      <Block title="Trip" step={1} onEdit={onEdit}>
        <Row label="Length">
          {draft.days} days{name ? ` · ${name}` : ''}
        </Row>
        <Row label="Route">
          {route.from} to {route.to}, {route.km} km
        </Row>
        <Row label="Nights">{plural(route.nights, 'night')}</Row>
      </Block>

      <Block title="Dates and group" step={2} onEdit={onEdit}>
        <Row label="Dates">
          {start && end ? `${formatDate(start, { weekday: 'short', day: 'numeric', month: 'long' })} – ${formatDate(end, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}` : '—'}
        </Row>
        <Row label="Hikers">{draft.hikers}</Row>
      </Block>

      <Block title="Options" step={3} onEdit={onEdit}>
        <Row label="Stay">
          {accommodationLevels.find((l) => l.id === draft.level)?.name} · {describeNights(draft.days, draft.level)}
        </Row>
        <Row label="Add-ons">{chosenAddOns.length ? chosenAddOns.map((a) => a.name).join(', ') : 'None'}</Row>
        <Row label="Meals">{mealOptions.find((m) => m.id === draft.meals)?.name}</Row>
      </Block>

      <Block title="Lead hiker" step={4} onEdit={onEdit}>
        <Row label="Name">{t.name}</Row>
        <Row label="Contact">
          {t.email} · {t.phone}
        </Row>
        <Row label="Emergency">
          {t.emergencyName} · {t.emergencyPhone}
        </Row>
        <Row label="Fitness">{fitnessLevels.find((f) => f.id === t.fitness)?.label.split(':')[0]}</Row>
        {t.notes && <Row label="Notes">{t.notes}</Row>}
      </Block>

      <section className="review-block" aria-labelledby="review-price">
        <h2 id="review-price" className="h4">
          Price
        </h2>
        <ul className="summary__lines">
          {q.lines.map((l) => (
            <li key={l.label}>
              <span>
                {l.label}
                {l.note && <span className="summary__sub">{l.note}</span>}
              </span>
              <span>{l.amount < 0 ? `−${formatMoney(-l.amount)}` : formatMoney(l.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="summary__total">
          <span>Total</span>
          <span className="summary__amount">{formatMoney(q.total)}</span>
        </div>
        <p className="summary__pp">
          {formatMoney(q.perPerson)} per person. This is a demo: no payment is taken.
        </p>
      </section>

      <div className={`terms ${termsError ? 'has-error' : ''}`}>
        <label className="check check--terms" htmlFor="terms">
          <input
            id="terms"
            type="checkbox"
            checked={draft.termsAccepted}
            onChange={(e) => update({ termsAccepted: e.target.checked })}
            aria-invalid={!!termsError}
            aria-describedby={termsError ? 'terms-error' : undefined}
          />
          <span className="check__text">
            I accept the booking terms, including free cancellation up to 60 days before departure, and confirm
            that every hiker will have travel insurance covering mountain rescue.
          </span>
        </label>
        {termsError && <ErrorText id="terms-error">{termsError}</ErrorText>}
      </div>
    </div>
  )
}
