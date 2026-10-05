import { limits, months, stages, type AccommodationLevelId, type MonthInfo } from '../data/trip'
import { addDays, parseISODate } from './format'

export const clampDays = (days: number) =>
  Math.min(limits.maxDays, Math.max(limits.minDays, Math.round(days)))

/** Everything about the part of the route an N-day trip covers. */
export function routeFor(days: number) {
  const walked = stages.slice(0, clampDays(days))
  const last = walked[walked.length - 1]
  const nightStages = walked.slice(0, -1)
  return {
    stages: walked,
    from: walked[0].from,
    to: last.to,
    exit: last.exit,
    km: walked.reduce((sum, s) => sum + s.km, 0),
    ascent: walked.reduce((sum, s) => sum + s.ascent, 0),
    nights: nightStages.length,
    huts: nightStages.filter((s) => s.sleep?.type === 'hut').length,
    cabins: nightStages.filter((s) => s.sleep?.type === 'cabin').length,
    campable: nightStages.filter((s) => s.sleep?.campingAllowed).length,
  }
}

/** Human summary of where you sleep, e.g. "2 nights in mountain huts, 2 in lakeside cabins". */
export function describeNights(days: number, level: AccommodationLevelId): string {
  const r = routeFor(days)
  const join = (pairs: [number, string][]) =>
    pairs
      .filter(([n]) => n > 0)
      .map(([n, label], i) => (i === 0 ? `${n} ${n === 1 ? 'night' : 'nights'} ${label}` : `${n} ${label}`))
      .join(', ')

  if (level === 'wild') {
    const huts = r.nights - r.campable
    return join([
      [r.campable, 'wild camping'],
      [huts, huts === 1 ? 'in a hut' : 'in huts'],
    ])
  }
  const base = join([
    [r.huts, 'in mountain huts'],
    [r.cabins, 'in lakeside cabins'],
  ])
  return level === 'comfort' ? `${base}, private rooms` : base
}

export type SeasonCheck =
  | { ok: true; month: MonthInfo; end: Date }
  | { ok: false; reason: string; month: MonthInfo | null; end: Date | null }

const seasonStart = () => months[limits.seasonStartMonth - 1]
const seasonEnd = () => months[limits.seasonEndMonth - 1]

/** Is a trip starting on `iso` for `days` days in the future and inside the guided season? */
export function checkSeason(iso: string, days: number, today = new Date()): SeasonCheck {
  const start = parseISODate(iso)
  if (!start) return { ok: false, reason: 'Choose a start date.', month: null, end: null }

  const month = months[start.getMonth()]
  const end = addDays(start, clampDays(days) - 1)
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  if (start < tomorrow) {
    return { ok: false, reason: 'Choose a date from tomorrow onwards.', month, end }
  }

  const m = start.getMonth() + 1
  if (m < limits.seasonStartMonth || m > limits.seasonEndMonth) {
    return {
      ok: false,
      reason: `We guide from ${seasonStart().month} to ${seasonEnd().month}. In ${month.month} the huts are closed.`,
      month,
      end,
    }
  }

  const lastDay = new Date(start.getFullYear(), limits.seasonEndMonth, 0)
  if (end > lastDay) {
    return {
      ok: false,
      reason: `This trip would finish after the huts close on ${lastDay.getDate()} ${seasonEnd().month}. Choose an earlier start or a shorter trip.`,
      month,
      end,
    }
  }
  return { ok: true, month, end }
}

/** The first bookable date: tomorrow, or the next season opening if we are out of season. */
export function firstBookableDate(today = new Date()): Date {
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const m = tomorrow.getMonth() + 1
  if (m >= limits.seasonStartMonth && m <= limits.seasonEndMonth) return tomorrow
  const year = m > limits.seasonEndMonth ? tomorrow.getFullYear() + 1 : tomorrow.getFullYear()
  return new Date(year, limits.seasonStartMonth - 1, 1)
}
