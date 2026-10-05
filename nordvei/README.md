# Nordvei

A two-part website for a fictional guided hiking company in Norway: a long landing page that explains the trip, and a multi-step booking flow at `/book`.

Built with Vite, React, TypeScript and React Router. Styling is plain CSS with design tokens as CSS variables. There is no backend: bookings are validated in the browser and stored in `localStorage`.

## Run it

```bash
cd nordvei
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Where things live

| What | File |
| --- | --- |
| All trip content: stages, waypoints, months, gear, FAQ, testimonials | `src/data/trip.ts` |
| All prices: per-day rates, group discounts, add-ons | `src/data/trip.ts` (section "Pricing") |
| Image URLs | `src/data/images.ts` |
| Colours, fonts, spacing, radii | `src/styles/tokens.css` |
| Booking submit (the one place to add payments/email) | `src/lib/bookingService.ts` |
| Price calculation | `src/lib/pricing.ts` |
| Route maths (distance, nights, season checks) | `src/lib/route.ts` |

### Edit trip content and prices

Everything is in `src/data/trip.ts`. The landing page, the booking flow and the confirmation page all read from it, so a price changed there is updated everywhere.

How trip length works: the full route is 10 stages, one per day. An N-day trip walks stages 1 to N and leaves the trail using stage N's `exit` transfer. Change a stage's `km`, `sleep` or `exit` and the itinerary, map card and booking summary all follow.

### Swap images

Edit `src/data/images.ts`. Each entry has a `src` (any URL, or a file you put in `public/`), an `alt` text, and a `fallback` CSS gradient that shows while the image loads or if it fails.

### Change the accent colour

In `src/styles/tokens.css`, change `--color-accent` (and `--color-on-accent` if the text on the button needs a different shade). The accent is used only for the primary "Book your trip" and "Confirm booking" buttons.

## Adding real payments and email later

`submitBooking()` in `src/lib/bookingService.ts` is the only function the UI calls to place a booking. It has commented placeholders for charging a payment, saving to an API and sending a confirmation email. Keep its signature (takes the draft, returns the saved record or throws `BookingError`) and the UI won't need to change.

## Browser storage keys

- `nordvei.gear`: ticked items on the packing list
- `nordvei.bookingDraft`: the in-progress booking, so going back or reloading keeps your answers
- `nordvei.bookings`: confirmed demo bookings, read by the confirmation page

## Accessibility notes

- Keyboard: every control is reachable; month selector uses arrow keys; mobile menu closes on Escape.
- Focus moves to the step heading on each booking step and to the first invalid field when a step can't continue.
- `prefers-reduced-motion` turns off parallax, count-ups, scroll movement and smooth scrolling.
- Errors are announced through `aria-describedby` and are shown without relying on colour.

Nordvei is fictional. Photos are from Unsplash.
