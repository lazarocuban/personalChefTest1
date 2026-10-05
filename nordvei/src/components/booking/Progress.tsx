import { IconCheck } from '../icons'

export const stepNames = ['Trip length', 'Dates', 'Options', 'Your details', 'Review'] as const

type ProgressProps = {
  current: number
  canVisit: (step: number) => boolean
  onVisit: (step: number) => void
}

export function Progress({ current, canVisit, onVisit }: ProgressProps) {
  return (
    <nav className="progress-steps" aria-label="Booking progress">
      <p className="progress-steps__mobile" aria-hidden="true">
        Step {current} of {stepNames.length} · {stepNames[current - 1]}
      </p>
      <ol>
        {stepNames.map((name, i) => {
          const n = i + 1
          const state = n < current ? 'done' : n === current ? 'current' : 'todo'
          const clickable = n !== current && canVisit(n)
          const content = (
            <>
              <span className="progress-steps__dot" aria-hidden="true">
                {state === 'done' ? <IconCheck size={14} /> : n}
              </span>
              <span className="progress-steps__name">{name}</span>
              <span className="sr-only">
                {state === 'done' ? ' (completed)' : state === 'current' ? ' (current step)' : ''}
              </span>
            </>
          )
          return (
            <li key={name} className={`progress-steps__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              {clickable ? (
                <button type="button" onClick={() => onVisit(n)}>
                  {content}
                </button>
              ) : (
                <span>{content}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
