import type { ReactNode } from 'react'
import { IconAlert } from '../icons'

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  children: (aria: {
    id: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
  }) => ReactNode
}

/** Label, control, hint and inline error wired together for assistive tech. */
export function Field({ id, label, error, hint, optional, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && <ErrorText id={errorId!}>{error}</ErrorText>}
    </div>
  )
}

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="field__error">
      <IconAlert />
      <span>{children}</span>
    </p>
  )
}
