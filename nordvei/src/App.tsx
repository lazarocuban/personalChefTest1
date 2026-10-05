import { useEffect } from 'react'
import { Route, Routes, useLocation, Link } from 'react-router'
import { Footer } from './components/Footer'
import { BookingNav } from './components/Nav'
import { Book } from './pages/Book'
import { Confirmation } from './pages/Confirmation'
import { Landing } from './pages/Landing'

/** Start each new page at the top (hash links on the landing page handle themselves). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <>
      <BookingNav />
      <main id="main" className="booking-page">
        <div className="container narrow center-text">
          <p className="eyebrow">404</p>
          <h1 className="h2">This path isn’t on the map.</h1>
          <p className="lead">The page you were looking for doesn’t exist.</p>
          <Link to="/" className="btn btn--surface">
            Back to the trip
          </Link>
        </div>
      </main>
      <Footer minimal />
    </>
  )
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<Book />} />
        <Route path="/book/confirmation/:reference" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
