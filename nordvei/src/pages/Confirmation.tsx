import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { Footer } from '../components/Footer'
import { IconCalendar } from '../components/icons'
import { BookingNav } from '../components/Nav'
import { accommodationLevels, brand } from '../data/trip'
import { findBooking } from '../lib/bookingService'
import { formatDate, formatMoney, parseISODate, plural } from '../lib/format'
import { downloadICS } from '../lib/ics'
import { routeFor } from '../lib/route'

export function Confirmation() {
  const { reference = '' } = useParams()
  const booking = findBooking(reference)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    document.title = `Booking confirmed · ${brand.name}`
    headingRef.current?.focus()
  }, [])

  if (!booking) {
    return (
      <>
        <BookingNav />
        <main id="main" className="booking-page">
          <div className="container narrow center-text">
            <p className="eyebrow">Booking not found</p>
            <h1 className="h2" ref={headingRef} tabIndex={-1}>
              We couldn’t find {reference ? `booking ${reference}` : 'that booking'}.
            </h1>
            <p className="lead">
              Bookings are stored in the browser where they were made. Try the same device, or start a new booking.
            </p>
            <Link to="/book" className="btn btn--surface">
              Start a booking
            </Link>
          </div>
        </main>
        <Footer minimal />
      </>
    )
  }

  const start = parseISODate(booking.startDate)!
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + booking.days - 1)
  const route = routeFor(booking.days)
  const firstName = booking.traveler.name.trim().split(/\s+/)[0]

  return (
    <>
      <BookingNav />
      <main id="main" className="booking-page">
        <div className="container narrow">
          <div className="confirm">
            <p className="eyebrow">Booking confirmed</p>
            <h1 className="h1 confirm__title" ref={headingRef} tabIndex={-1}>
              You’re going to Norway, {firstName}.
            </h1>
            <p className="lead">
              We’ll meet you on the platform at {route.from} on{' '}
              {formatDate(start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
            </p>

            <div className="card confirm__ref">
              <p className="eyebrow">Booking reference</p>
              <p className="confirm__code">{booking.reference}</p>
              <div className="confirm__actions">
                <button type="button" className="btn btn--ghost" onClick={() => downloadICS(booking)}>
                  <IconCalendar size={18} />
                  Add to calendar (.ics)
                </button>
                <button type="button" className="btn btn--surface" onClick={() => window.print()}>
                  Print
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="h3">Your trip</h2>
              <dl className="review-list">
                <div>
                  <dt>Dates</dt>
                  <dd>
                    {formatDate(start, { day: 'numeric', month: 'long' })} –{' '}
                    {formatDate(end, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </dd>
                </div>
                <div>
                  <dt>Route</dt>
                  <dd>
                    {route.from} to {route.to} · {route.km} km · {plural(route.nights, 'night')}
                  </dd>
                </div>
                <div>
                  <dt>Hikers</dt>
                  <dd>{booking.hikers}</dd>
                </div>
                <div>
                  <dt>Stay</dt>
                  <dd>{accommodationLevels.find((l) => l.id === booking.level)?.name}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatMoney(booking.quote.total)}</dd>
                </div>
              </dl>
            </div>

            <div className="card">
              <h2 className="h3">What happens next</h2>
              <ol className="next-steps">
                <li>Your guide will be in touch 4 weeks before departure with the final kit list.</li>
                <li>Book your train to {route.from}; arrive by 10:00 on day one.</li>
                <li>Use the packing list on our site to get ready. It remembers what you’ve ticked.</li>
              </ol>
              <p className="disclaimer disclaimer--inline">
                Demo only: no email was sent to {booking.traveler.email} and no payment was taken. The booking is
                stored in this browser.
              </p>
            </div>

            <div className="center-row">
              <Link to="/" className="btn btn--ghost">
                Back to {brand.name}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer minimal />
    </>
  )
}
