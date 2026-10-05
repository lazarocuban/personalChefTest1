import { useState } from 'react'
import { fitnessLevels } from '../../data/trip'
import { validateTraveler, type Traveler } from '../../lib/booking'
import { ErrorText, Field } from './Field'
import type { StepProps } from './types'

type Key = keyof Traveler

export function StepDetails({ draft, update, showErrors }: StepProps) {
  const [touched, setTouched] = useState<Set<Key>>(new Set())
  const t = draft.traveler
  const errors = validateTraveler(t)
  const errorFor = (k: Key) => (showErrors || touched.has(k) ? errors[k] : undefined)

  const set = (k: Key, value: string) => update({ traveler: { ...t, [k]: value } })
  const touch = (k: Key) => setTouched((prev) => new Set(prev).add(k))

  const text = (
    k: Key,
    label: string,
    type: 'text' | 'email' | 'tel',
    autoComplete: string,
    hint?: string,
  ) => (
    <Field id={`traveler-${k}`} label={label} error={errorFor(k)} hint={hint}>
      {(aria) => (
        <input
          {...aria}
          className="input"
          type={type}
          autoComplete={autoComplete}
          inputMode={type === 'tel' ? 'tel' : undefined}
          value={t[k]}
          onChange={(e) => set(k, e.target.value)}
          onBlur={() => touch(k)}
        />
      )}
    </Field>
  )

  const fitnessError = errorFor('fitness')

  return (
    <div className="step">
      <p className="muted">
        We only use these details to organise your trip. For groups, enter the lead hiker; we’ll ask for everyone
        else’s names later.
      </p>

      <div className="form-grid">
        {text('name', 'Full name', 'text', 'name')}
        {text('email', 'Email', 'email', 'email', 'Your confirmation goes here.')}
        {text('phone', 'Phone', 'tel', 'tel', 'Include your country code, e.g. +44.')}
      </div>

      <fieldset className="choice-group">
        <legend className="h4">Emergency contact</legend>
        <p className="field__hint field__hint--top">Someone at home who is not coming on the trip.</p>
        <div className="form-grid">
          {text('emergencyName', 'Name', 'text', 'off')}
          {text('emergencyPhone', 'Phone', 'tel', 'off')}
        </div>
      </fieldset>

      <fieldset
        className={`choice-group ${fitnessError ? 'has-error' : ''}`}
        aria-describedby={fitnessError ? 'fitness-error' : undefined}
      >
        <legend className="h4">Fitness level</legend>
        <div className="choices">
          {fitnessLevels.map((f) => (
            <label key={f.id} className={`choice choice--compact card card--inset ${t.fitness === f.id ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="fitness"
                value={f.id}
                checked={t.fitness === f.id}
                onChange={() => {
                  set('fitness', f.id)
                  touch('fitness')
                }}
                aria-invalid={!!fitnessError}
                className="sr-only-input"
              />
              <span className="choice__mark" aria-hidden="true" />
              <span className="choice__body">
                <span className="choice__desc choice__desc--strong">{f.label}</span>
              </span>
            </label>
          ))}
        </div>
        {fitnessError && <ErrorText id="fitness-error">{fitnessError}</ErrorText>}
      </fieldset>

      <Field
        id="traveler-notes"
        label="Anything we should know?"
        optional
        error={errorFor('notes')}
        hint={`Allergies, injuries, questions. ${t.notes.length}/600`}
      >
        {(aria) => (
          <textarea
            {...aria}
            className="input textarea"
            rows={4}
            value={t.notes}
            onChange={(e) => set('notes', e.target.value)}
            onBlur={() => touch('notes')}
          />
        )}
      </Field>
    </div>
  )
}
