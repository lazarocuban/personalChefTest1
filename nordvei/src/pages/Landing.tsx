import { useEffect } from 'react'
import { Footer } from '../components/Footer'
import { Accommodation } from '../components/landing/Accommodation'
import { Faq, FinalCta, Testimonials } from '../components/landing/Closing'
import { Gear } from '../components/landing/Gear'
import { Hero } from '../components/landing/Hero'
import { Included } from '../components/landing/Included'
import { Itinerary } from '../components/landing/Itinerary'
import { Pricing } from '../components/landing/Pricing'
import { QuickFacts } from '../components/landing/QuickFacts'
import { RouteMap } from '../components/landing/RouteMap'
import { Safety } from '../components/landing/Safety'
import { Seasons } from '../components/landing/Seasons'
import { Nav } from '../components/Nav'
import { brand } from '../data/trip'

export function Landing() {
  useEffect(() => {
    document.title = `${brand.name} · Guided hikes through lake and forest Norway`
    // Arriving with a hash (e.g. /#faq from another page): jump to it after first paint.
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <QuickFacts />
        <RouteMap />
        <Itinerary />
        <Included />
        <Seasons />
        <Gear />
        <Accommodation />
        <Safety />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
