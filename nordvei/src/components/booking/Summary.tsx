import { accommodationLevels, tripVersions } from '../../data/trip'
import type { BookingDraft } from '../../lib/booking'
import { formatDate, formatMoney, parseISODate, plural } from '../../lib/format'
import { quote } from '../../lib/pricing'
import { describeNights, routeFor } from '../../lib/route'
import { IconChevron } from '../icons'

export const versionName = (days: number) => tripVersions.find((v) => v.days === days)?.name

function SummaryBody({ draft }: { draft: BookingDraft }) {
  const route = routeFor(draft.days)
  const q = quote(draft)
  const start = parseISODate(draft.startDate)
  const end = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + draft.days - 1) : null
  const level = accommodationLevels.find((l) => l.id === draft.level)

  return (
    <>
      <dl className="summary__facts">
        <div>
          <dt>Route</dt>
          <dd>
            {route.from} to {route.to}
          </dd>
        </div>
        <div>
          <dt>Distance</dt>
          <dd>
            {route.km} km over {plural(draft.days, 'day')}
          </dd>
        </div>
        <div>
          <dt>Nights</dt>
          <dd>{plural(route.nights, 'night')}</dd>
        </div>
        <div>
          <dt>Stay</dt>
          <dd>
            {level?.name}
            <span className="summary__sub">{describeNights(draft.days, draft.level)}</span>
          </dd>
        </div>
        <div>
          <dt>Dates</dt>
          <dd>
            {start && end
              ? `${formatDate(start, { day: 'numeric', month: 'short' })} – ${formatDate(end, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}`
              : 'Not chosen yet'}
          </dd>
        </div>
        <div>
          <dt>Hikers</dt>
          <dd>{draft.hikers}</dd>
        </div>
      </dl>

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
      <p className="summary__pp">{formatMoney(q.perPerson)} per person · nothing is charged today</p>
    </>
  )
}

/** Sticky price card (desktop) or a collapsible bar (mobile). CSS shows the right one per breakpoint. */
export function Summary({ draft, variant }: { draft: BookingDraft; variant: 'desktop' | 'mobile' }) {
  const q = quote(draft)
  const name = versionName(draft.days)
  if (variant === 'desktop') {
    return (
      <aside className="summary card summary--desktop" aria-label="Trip summary">
        <p className="eyebrow">Your trip</p>
        <h2 className="h3 summary__title">
          {draft.days} days
          {name && <span className="summary__sub">{name}</span>}
        </h2>
        <SummaryBody draft={draft} />
      </aside>
    )
  }
  return (
    <>
      <details className="summary card summary--mobile" aria-label="Trip summary">
        <summary>
          <span>
            <span className="summary__mobile-label">
              {draft.days} days · {plural(draft.hikers, 'hiker')}
            </span>
            <span className="summary__mobile-total">{formatMoney(q.total)}</span>
          </span>
          <span className="summary__mobile-toggle">
            Details <IconChevron size={16} />
          </span>
        </summary>
        <SummaryBody draft={draft} />
      </details>
    </>
  )
}
