import { brand } from '../data/trip'
import type { BookingRecord } from './booking'
import { addDays, parseISODate } from './format'
import { routeFor } from './route'

const compactDate = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`

const escapeText = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

/** Fold lines longer than 75 characters, as the iCalendar spec requires. */
const fold = (line: string) => {
  const out: string[] = []
  for (let i = 0; i < line.length; i += 73) out.push((i === 0 ? '' : ' ') + line.slice(i, i + 73))
  return out.join('\r\n')
}

export function bookingToICS(b: BookingRecord): string {
  const start = parseISODate(b.startDate)
  if (!start) throw new Error('Booking has no valid start date')
  const route = routeFor(b.days)
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const description = [
    `Booking reference: ${b.reference}`,
    `${b.days} days from ${route.from} to ${route.to} (${route.km} km).`,
    `Hikers: ${b.hikers}.`,
    `Meet your guide on the platform at ${route.from}.`,
    `Questions: ${brand.email}`,
  ].join('\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${brand.name}//Booking//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${b.reference}@nordvei.example`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compactDate(start)}`,
    // All-day events end on the day after the last day.
    `DTEND;VALUE=DATE:${compactDate(addDays(start, b.days))}`,
    `SUMMARY:${escapeText(`${brand.name} hike: ${route.from} to ${route.to}`)}`,
    `LOCATION:${escapeText(`${route.from}, Norway`)}`,
    `DESCRIPTION:${escapeText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

export function downloadICS(b: BookingRecord) {
  const blob = new Blob([bookingToICS(b)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${brand.name.toLowerCase()}-${b.reference}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
