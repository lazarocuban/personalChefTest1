import { forwardRef, useState } from 'react'
import { images, type ImageKey } from '../data/images'

type PhotoProps = {
  image: ImageKey
  className?: string
  /** Darken the photo so text on top stays readable. */
  overlay?: 'none' | 'soft' | 'hero' | 'strong'
  /** Decorative photos are hidden from screen readers. */
  decorative?: boolean
  eager?: boolean
}

/** A photo with a gradient fallback underneath and an optional dark overlay on top. */
export const Photo = forwardRef<HTMLDivElement, PhotoProps>(function Photo(
  { image, className = '', overlay = 'soft', decorative = false, eager = false },
  ref,
) {
  const img = images[image]
  const [failed, setFailed] = useState(false)
  return (
    <div className={`photo photo--${overlay} ${className}`} style={{ backgroundImage: img.fallback }} ref={ref}>
      {!failed && (
        <img
          src={img.src}
          alt={decorative ? '' : img.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
        />
      )}
    </div>
  )
})
