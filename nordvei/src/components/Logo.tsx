import { Link } from 'react-router'
import { brand } from '../data/trip'

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" aria-label={`${brand.name}, home`} onClick={onClick}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M4 24 L12 11 L16.5 18 L20.5 11.5 L28 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M4 27.5h24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </svg>
      <span>{brand.name}</span>
    </Link>
  )
}
