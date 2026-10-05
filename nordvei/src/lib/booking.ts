import type { AccommodationLevelId, AddOnId, MealPreference } from '../data/trip'
import { limits } from '../data/trip'
import type { Quote } from './pricing'

export type Traveler = {
  name: string
  email: string
  phone: string
  emergencyName: string
  emergencyPhone: string
  fitness: string
  notes: string
}

export type BookingDraft = {
  days: number
  startDate: string
  hikers: number
  level: AccommodationLevelId
  addOns: AddOnId[]
  meals: MealPreference
  traveler: Traveler
  termsAccepted: boolean
}

export type BookingRecord = BookingDraft & {
  reference: string
  createdAt: string
  quote: Quote
  status: 'confirmed'
}

export const emptyDraft: BookingDraft = {
  days: 5,
  startDate: '',
  hikers: 2,
  level: 'classic',
  addOns: [],
  meals: 'standard',
  traveler: {
    name: '',
    email: '',
    phone: '',
    emergencyName: '',
    emergencyPhone: '',
    fitness: '',
    notes: '',
  },
  termsAccepted: false,
}

/** Merge a possibly stale saved draft with defaults so new fields never come back undefined. */
export function normalizeDraft(saved: Partial<BookingDraft> | null): BookingDraft {
  if (!saved) return emptyDraft
  const days = Number(saved.days)
  const hikers = Number(saved.hikers)
  return {
    ...emptyDraft,
    ...saved,
    days: Number.isFinite(days) ? Math.min(limits.maxDays, Math.max(limits.minDays, days)) : emptyDraft.days,
    hikers: Number.isFinite(hikers)
      ? Math.min(limits.maxHikers, Math.max(limits.minHikers, hikers))
      : emptyDraft.hikers,
    addOns: Array.isArray(saved.addOns) ? saved.addOns : [],
    traveler: { ...emptyDraft.traveler, ...(saved.traveler ?? {}) },
  }
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export type Errors = Partial<Record<string, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phonePattern = /^\+?[\d\s()-]{7,20}$/

export function validateTraveler(t: Traveler): Errors {
  const e: Errors = {}
  if (t.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!t.email.trim()) e.email = 'We need an email to send your confirmation.'
  else if (!emailPattern.test(t.email.trim())) e.email = 'That email doesn’t look right. Check for a typo?'
  if (!t.phone.trim()) e.phone = 'Please add a phone number your guide can reach.'
  else if (!phonePattern.test(t.phone.trim())) e.phone = 'Use digits, spaces and an optional + country code.'
  if (t.emergencyName.trim().length < 2) e.emergencyName = 'Who should we contact in an emergency?'
  if (!t.emergencyPhone.trim()) e.emergencyPhone = 'Please add their phone number.'
  else if (!phonePattern.test(t.emergencyPhone.trim()))
    e.emergencyPhone = 'Use digits, spaces and an optional + country code.'
  else if (t.emergencyPhone.replace(/\D/g, '') === t.phone.replace(/\D/g, ''))
    e.emergencyPhone = 'This should be someone not on the trip, with a different number.'
  if (!t.fitness) e.fitness = 'Choose the option closest to you. It helps your guide plan.'
  if (t.notes.length > 600) e.notes = 'Please keep notes under 600 characters.'
  return e
}
