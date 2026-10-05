/**
 * Every photo on the site lives here. Swap a URL to change an image everywhere.
 *
 * - `src` can be any absolute URL or a file in /public (e.g. '/images/hero.jpg').
 * - `fallback` is a CSS gradient shown while the photo loads, or if it fails.
 * - `alt` is read by screen readers; describe what is in the photo.
 *
 * Unsplash URLs accept size params; `unsplash()` adds sensible defaults.
 */

const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`

export type SiteImage = {
  src: string
  alt: string
  fallback: string
}

export const images = {
  hero: {
    src: unsplash('1470770841072-f978cf4d019e', 2400),
    alt: 'Mist rising off a still mountain lake, a wooden boathouse on the water and forested slopes behind',
    fallback: 'linear-gradient(180deg, #2a2f3d 0%, #1f2a2a 55%, #171721 100%)',
  },
  forest: {
    src: unsplash('1507041957456-9c397ce39c97'),
    alt: 'Tall spruce trunks in a misty, green forest',
    fallback: 'linear-gradient(160deg, #1f2a24 0%, #171721 100%)',
  },
  lake: {
    src: unsplash('1439066615861-d1af74d74000'),
    alt: 'A wooden jetty reaching into a calm lake lined with forest',
    fallback: 'linear-gradient(180deg, #23304a 0%, #171721 100%)',
  },
  hut: {
    src: unsplash('1520962922320-2038eebab146'),
    alt: 'Pine trees in low sun beneath a snow-dusted mountain',
    fallback: 'linear-gradient(180deg, #2b2b38 0%, #171721 100%)',
  },
  cabin: {
    src: unsplash('1510798831971-661eb04b3739'),
    alt: 'A timber lakeside cabin glowing with warm light at dusk',
    fallback: 'linear-gradient(180deg, #2d2a2a 0%, #171721 100%)',
  },
  camp: {
    src: unsplash('1504280390367-361c6d9f38f4'),
    alt: 'View from inside a tent, looking out at a pine forest',
    fallback: 'linear-gradient(180deg, #2e2a24 0%, #171721 100%)',
  },
  hikers: {
    src: unsplash('1551632811-561732d1e306'),
    alt: 'Two hikers with backpacks walking a rocky trail towards snowy peaks',
    fallback: 'linear-gradient(180deg, #273028 0%, #171721 100%)',
  },
  autumn: {
    src: unsplash('1523712999610-f77fbcfc3843'),
    alt: 'Low autumn sun filtering through a forest',
    fallback: 'linear-gradient(180deg, #33291f 0%, #171721 100%)',
  },
  ridges: {
    src: unsplash('1500534314209-a25ddb2bd429', 2400),
    alt: 'Layered hills fading into haze at dusk',
    fallback: 'linear-gradient(180deg, #2f3040 0%, #171721 100%)',
  },
} satisfies Record<string, SiteImage>

export type ImageKey = keyof typeof images
