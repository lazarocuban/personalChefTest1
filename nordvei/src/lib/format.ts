import { currency } from '../data/trip'

const money = new Intl.NumberFormat(currency.locale, {
  style: 'currency',
  currency: currency.code,
  maximumFractionDigits: 0,
})

export const formatMoney = (amount: number) => money.format(Math.round(amount))

/** Parse 'YYYY-MM-DD' as a local calendar date (not UTC midnight). */
export function parseISODate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

export function formatDate(
  d: Date,
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
) {
  return d.toLocaleDateString('en-GB', opts)
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
