import { useId, type ReactNode } from 'react'
import { IconChevron } from './icons'

type DisclosureProps = {
  open: boolean
  onToggle: () => void
  summary: ReactNode
  children: ReactNode
  className?: string
  headingLevel?: 'h3' | 'h4'
}

/** Accessible accordion item: a heading containing a button that controls a region. Height animates via CSS grid. */
export function Disclosure({ open, onToggle, summary, children, className = '', headingLevel = 'h3' }: DisclosureProps) {
  const id = useId()
  const Heading = headingLevel
  return (
    <div className={`disclosure ${open ? 'is-open' : ''} ${className}`}>
      <Heading className="disclosure__heading">
        <button
          type="button"
          className="disclosure__button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
        >
          <span className="disclosure__summary">{summary}</span>
          <IconChevron className="disclosure__chevron" />
        </button>
      </Heading>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className="disclosure__panel"
        inert={!open}
      >
        <div className="disclosure__inner">{children}</div>
      </div>
    </div>
  )
}
