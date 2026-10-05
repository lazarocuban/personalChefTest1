/**
 * Booking submission, isolated in one place.
 *
 * Today this only stores the booking in localStorage. To go live, replace the
 * marked steps inside `submitBooking` with real services (for example a
 * payment intent and a transactional email) and keep the same signature:
 * the UI only awaits the returned record or catches the thrown error.
 */

import type { BookingDraft, BookingRecord } from './booking'
import { quote } from './pricing'
import { readJSON, removeKey, storageKeys, writeJSON } from './storage'

export class BookingError extends Error {}

/** Short, readable reference like NV-7K3QXM (no 0/O or 1/I to avoid confusion). */
export function createReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return `NV-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`
}

export async function submitBooking(draft: BookingDraft): Promise<BookingRecord> {
  if (!draft.termsAccepted) throw new BookingError('Please accept the booking terms to continue.')

  const record: BookingRecord = {
    ...draft,
    reference: createReference(),
    createdAt: new Date().toISOString(),
    quote: quote(draft),
    status: 'confirmed',
  }

  // Step 1 (future): take payment, e.g. `await payments.charge(record.quote.total, record.reference)`.
  // Step 2 (future): persist to a backend, e.g. `await api.post('/bookings', record)`.
  // Step 3 (future): send confirmation, e.g. `await email.sendConfirmation(record)`.

  // Demo: a short pause so the confirm button shows its pending state, then save locally.
  await new Promise((resolve) => setTimeout(resolve, 600))
  const bookings = readJSON<BookingRecord[]>(storageKeys.bookings, [])
  writeJSON(storageKeys.bookings, [...bookings, record])
  removeKey(storageKeys.draft)

  return record
}

export function findBooking(reference: string): BookingRecord | null {
  return readJSON<BookingRecord[]>(storageKeys.bookings, []).find((b) => b.reference === reference) ?? null
}
