import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  lead?: ReactNode
  children: ReactNode
  className?: string
}

/** A landing page section with a consistent header and anchor target. */
export function Section({ id, eyebrow, title, lead, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={`${id}-title`} tabIndex={-1}>
      <div className="container">
        <Reveal className="section-header">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="h2">
            {title}
          </h2>
          {lead && <p className="lead">{lead}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
