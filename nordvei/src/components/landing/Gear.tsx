import { useEffect, useState } from 'react'
import { gear } from '../../data/trip'
import { readJSON, storageKeys, writeJSON } from '../../lib/storage'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const allIds = gear.flatMap((g) => g.items.map((i) => i.id))

export function Gear() {
  const [packed, setPacked] = useState<string[]>(() =>
    readJSON<string[]>(storageKeys.gear, []).filter((id) => allIds.includes(id)),
  )

  useEffect(() => writeJSON(storageKeys.gear, packed), [packed])

  const toggle = (id: string) =>
    setPacked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const pct = Math.round((packed.length / allIds.length) * 100)

  return (
    <Section
      id="gear"
      eyebrow="Gear and packing"
      title="Pack light, pack for four seasons."
      lead="Mountain weather can bring sun, rain and sleet in one afternoon. Tick things off as you pack; this list is saved in your browser."
    >
      <Reveal className="card gear-progress">
        <div className="gear-progress__text">
          <p className="h4" aria-live="polite">
            {packed.length} of {allIds.length} packed
          </p>
          <p className="muted small">
            {packed.length === allIds.length ? 'All packed. See you on the platform.' : 'Saved automatically.'}
          </p>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Packing progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => setPacked([])}
          disabled={packed.length === 0}
        >
          Clear list
        </button>
      </Reveal>

      <div className="gear-grid">
        {gear.map((group, gi) => (
          <Reveal key={group.category} className="card" delay={gi * 90}>
            <fieldset className="gear-group">
              <legend className="h4">{group.category}</legend>
              <ul>
                {group.items.map((item) => {
                  const id = `gear-${item.id}`
                  const checked = packed.includes(item.id)
                  return (
                    <li key={item.id}>
                      <label htmlFor={id} className={`check ${checked ? 'is-checked' : ''}`}>
                        <input id={id} type="checkbox" checked={checked} onChange={() => toggle(item.id)} />
                        <span className="check__text">
                          {item.label}
                          {item.note && <span className="check__note">{item.note}</span>}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </fieldset>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
