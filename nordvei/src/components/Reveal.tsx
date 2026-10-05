import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/motion'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger in milliseconds. */
  delay?: number
}

/** Fades content up slowly the first time it scrolls into view. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
