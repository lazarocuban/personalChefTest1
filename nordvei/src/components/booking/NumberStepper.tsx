import { IconMinus, IconPlus } from '../icons'

type NumberStepperProps = {
  id: string
  label: string
  value: number
  min: number
  max: number
  unit: [singular: string, plural: string]
  onChange: (value: number) => void
  /** Called when someone tries to go past a limit, so the parent can show a friendly note. */
  onLimit?: (which: 'min' | 'max') => void
}

/** − value + control. Buttons stay focusable at the limits (aria-disabled) so the limit message can be announced. */
export function NumberStepper({ id, label, value, min, max, unit, onChange, onLimit }: NumberStepperProps) {
  const atMin = value <= min
  const atMax = value >= max
  const word = value === 1 ? unit[0] : unit[1]

  const step = (delta: number) => {
    const next = value + delta
    if (next < min) return onLimit?.('min')
    if (next > max) return onLimit?.('max')
    onChange(next)
  }

  return (
    <div className="stepper" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="stepper__label">
        {label}
      </span>
      <div className="stepper__controls">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`One fewer ${unit[0]}`}
          aria-disabled={atMin}
          onClick={() => step(-1)}
        >
          <IconMinus />
        </button>
        <output className="stepper__value" aria-live="polite" htmlFor={`${id}-label`}>
          {value} <span>{word}</span>
        </output>
        <button
          type="button"
          className="stepper__btn"
          aria-label={`One more ${unit[0]}`}
          aria-disabled={atMax}
          onClick={() => step(1)}
        >
          <IconPlus />
        </button>
      </div>
    </div>
  )
}
