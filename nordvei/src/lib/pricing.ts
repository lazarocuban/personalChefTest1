import {
  accommodationLevels,
  addOns,
  groupDiscounts,
  type AccommodationLevelId,
  type AddOnId,
} from '../data/trip'
import { clampDays } from './route'

export type QuoteInput = {
  days: number
  hikers: number
  level: AccommodationLevelId
  addOns: AddOnId[]
}

export type QuoteLine = { label: string; amount: number; note?: string }

export type Quote = {
  lines: QuoteLine[]
  tripSubtotal: number
  discountPercent: number
  discount: number
  addOnsTotal: number
  total: number
  perPerson: number
}

export function discountFor(hikers: number): number {
  return groupDiscounts.reduce(
    (best, tier) => (hikers >= tier.minHikers ? Math.max(best, tier.percent) : best),
    0,
  )
}

/** Single source of truth for the price, used by the booking summary, review and confirmation. */
export function quote({ days, hikers, level, addOns: chosen }: QuoteInput): Quote {
  const d = clampDays(days)
  const lvl = accommodationLevels.find((l) => l.id === level) ?? accommodationLevels[1]
  const tripSubtotal = lvl.perDay * d * hikers
  const discountPercent = discountFor(hikers)
  const discount = Math.round((tripSubtotal * discountPercent) / 100)

  const lines: QuoteLine[] = [
    {
      label: lvl.name,
      amount: tripSubtotal,
      note: `${d} days × ${hikers} ${hikers === 1 ? 'hiker' : 'hikers'}`,
    },
  ]
  if (discount > 0) lines.push({ label: `Group discount (${discountPercent}%)`, amount: -discount })

  let addOnsTotal = 0
  for (const a of addOns) {
    if (!chosen.includes(a.id)) continue
    const amount =
      a.unit === 'perPersonPerDay' ? a.price * hikers * d : a.unit === 'perPerson' ? a.price * hikers : a.price
    addOnsTotal += amount
    lines.push({ label: a.name, amount })
  }

  const total = tripSubtotal - discount + addOnsTotal
  return { lines, tripSubtotal, discountPercent, discount, addOnsTotal, total, perPerson: total / hikers }
}
