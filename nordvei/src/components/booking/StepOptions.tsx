import { accommodationLevels, addOns, mealOptions, type AddOnId } from '../../data/trip'
import { formatMoney } from '../../lib/format'
import { describeNights } from '../../lib/route'
import { IconCheck } from '../icons'
import type { StepProps } from './types'

export function StepOptions({ draft, update }: StepProps) {
  const toggleAddOn = (id: AddOnId) =>
    update({ addOns: draft.addOns.includes(id) ? draft.addOns.filter((a) => a !== id) : [...draft.addOns, id] })

  const addOnPrice = (a: (typeof addOns)[number]) => {
    if (a.unit === 'perPersonPerDay')
      return { total: a.price * draft.hikers * draft.days, how: `${formatMoney(a.price)} × ${draft.hikers} × ${draft.days} days` }
    if (a.unit === 'perPerson') return { total: a.price * draft.hikers, how: `${formatMoney(a.price)} × ${draft.hikers}` }
    return { total: a.price, how: 'per group' }
  }

  return (
    <div className="step">
      <fieldset className="choice-group">
        <legend className="h4">Accommodation level</legend>
        <div className="choices">
          {accommodationLevels.map((l) => (
            <label key={l.id} className={`choice card card--inset ${draft.level === l.id ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="level"
                value={l.id}
                checked={draft.level === l.id}
                onChange={() => update({ level: l.id })}
                className="sr-only-input"
              />
              <span className="choice__mark" aria-hidden="true" />
              <span className="choice__body">
                <span className="choice__title">
                  {l.name}
                  <span className="choice__price">{formatMoney(l.perDay)} / day</span>
                </span>
                <span className="choice__desc">{l.description}</span>
                <span className="choice__desc choice__desc--dim">{describeNights(draft.days, l.id)}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="choice-group">
        <legend className="h4">Add-ons</legend>
        <div className="choices">
          {addOns.map((a) => {
            const price = addOnPrice(a)
            const checked = draft.addOns.includes(a.id)
            return (
              <label key={a.id} className={`choice card card--inset ${checked ? 'is-selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAddOn(a.id)}
                  className="sr-only-input"
                />
                <span className="choice__mark choice__mark--box" aria-hidden="true">
                  <IconCheck size={14} />
                </span>
                <span className="choice__body">
                  <span className="choice__title">
                    {a.name}
                    <span className="choice__price">+{formatMoney(price.total)}</span>
                  </span>
                  <span className="choice__desc">{a.description}</span>
                  <span className="choice__desc choice__desc--dim">{price.how}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="choice-group">
        <legend className="h4">Meals</legend>
        <div className="pills">
          {mealOptions.map((m) => (
            <label key={m.id} className={`pill-choice ${draft.meals === m.id ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="meals"
                value={m.id}
                checked={draft.meals === m.id}
                onChange={() => update({ meals: m.id })}
                className="sr-only-input"
              />
              <span>{m.name}</span>
              <span className="pill-choice__sub">{m.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
