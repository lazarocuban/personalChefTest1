import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Progress, stepNames } from '../components/booking/Progress'
import { StepDates } from '../components/booking/StepDates'
import { StepDetails } from '../components/booking/StepDetails'
import { StepLength } from '../components/booking/StepLength'
import { StepOptions } from '../components/booking/StepOptions'
import { StepReview } from '../components/booking/StepReview'
import { Summary } from '../components/booking/Summary'
import { Footer } from '../components/Footer'
import { IconArrowLeft, IconArrowRight } from '../components/icons'
import { BookingNav } from '../components/Nav'
import { brand } from '../data/trip'
import { normalizeDraft, validateTraveler, type BookingDraft } from '../lib/booking'
import { BookingError, submitBooking } from '../lib/bookingService'
import { checkSeason } from '../lib/route'
import { readJSON, storageKeys, writeJSON } from '../lib/storage'

const TOTAL = stepNames.length

const stepIntro = [
  'How many days would you like to walk? Every trip starts at Fjellstad; longer trips go further.',
  'Pick a start date in the guided season and tell us how many are coming.',
  'Choose where you sleep and any extras.',
  'Tell us who is coming and how to reach someone at home.',
  'Check everything, then confirm. You can still go back and change anything.',
]

export function Book() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = useState<BookingDraft>(() =>
    normalizeDraft(readJSON<Partial<BookingDraft> | null>(storageKeys.draft, null)),
  )
  const [attempted, setAttempted] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const firstRender = useRef(true)

  // Keep the draft across reloads and when someone leaves and comes back.
  useEffect(() => writeJSON(storageKeys.draft, draft), [draft])

  const valid = [
    true,
    checkSeason(draft.startDate, draft.days).ok,
    true,
    Object.keys(validateTraveler(draft.traveler)).length === 0,
    draft.termsAccepted,
  ]
  const firstInvalidBefore = (step: number) => {
    for (let i = 0; i < step - 1; i++) if (!valid[i]) return i + 1
    return null
  }
  const canVisit = (step: number) => firstInvalidBefore(step) === null

  const requested = Math.min(TOTAL, Math.max(1, Number(params.get('step')) || 1))
  const blockedAt = firstInvalidBefore(requested)
  const step = blockedAt ?? requested

  // Someone deep-linked or reloaded past an unfinished step: send them back to it.
  useEffect(() => {
    if (blockedAt !== null) {
      setParams({ step: String(blockedAt) }, { replace: true })
      setAttempted((a) => new Set(a).add(blockedAt))
    }
  }, [blockedAt, setParams])

  // Each new step starts at the top with focus on its heading, so screen readers announce it.
  useEffect(() => {
    document.title = `Book · ${stepNames[step - 1]} · ${brand.name}`
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const update = (patch: Partial<BookingDraft>) => {
    setSubmitError(null)
    setDraft((d) => ({ ...d, ...patch }))
  }

  const goTo = (n: number) => setParams({ step: String(n) })

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      el?.focus()
    })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid[step - 1]) {
      setAttempted((a) => new Set(a).add(step))
      focusFirstError()
      return
    }
    if (step < TOTAL) return goTo(step + 1)

    setSubmitting(true)
    setSubmitError(null)
    try {
      const record = await submitBooking(draft)
      navigate(`/book/confirmation/${record.reference}`, { replace: true })
    } catch (err) {
      setSubmitError(err instanceof BookingError ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const stepProps = { draft, update, showErrors: attempted.has(step) }

  return (
    <>
      <a className="skip-link" href="#booking-form">
        Skip to form
      </a>
      <BookingNav />
      <main id="main" className="booking-page">
        <div className="container">
          <Progress current={step} canVisit={canVisit} onVisit={goTo} />

          <div className="booking-layout">
            <form
              id="booking-form"
              ref={formRef}
              className="booking-form"
              onSubmit={onSubmit}
              noValidate
              aria-labelledby="step-title"
            >
              <div className="step-head">
                <p className="eyebrow">
                  Step {step} of {TOTAL}
                </p>
                <h1 id="step-title" className="h2" tabIndex={-1} ref={headingRef}>
                  {step === TOTAL ? 'Review and confirm' : stepNames[step - 1]}
                </h1>
                <p className="muted">{stepIntro[step - 1]}</p>
              </div>

              <Summary draft={draft} variant="mobile" />

              {step === 1 && <StepLength {...stepProps} />}
              {step === 2 && <StepDates {...stepProps} />}
              {step === 3 && <StepOptions {...stepProps} />}
              {step === 4 && <StepDetails {...stepProps} />}
              {step === 5 && <StepReview {...stepProps} onEdit={goTo} />}

              {submitError && (
                <p className="form-error" role="alert">
                  {submitError}
                </p>
              )}

              <div className="form-actions">
                {step > 1 ? (
                  <button type="button" className="btn btn--ghost" onClick={() => goTo(step - 1)}>
                    <IconArrowLeft size={18} />
                    Back
                  </button>
                ) : (
                  <span />
                )}
                {step < TOTAL ? (
                  <button type="submit" className="btn btn--light">
                    Continue to {stepNames[step].toLowerCase()}
                    <IconArrowRight size={18} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn--primary btn--lg" disabled={submitting} aria-busy={submitting}>
                    {submitting ? 'Confirming…' : 'Confirm booking'}
                  </button>
                )}
              </div>
            </form>

            <div className="booking-aside">
              <Summary draft={draft} variant="desktop" />
            </div>
          </div>
        </div>
      </main>
      <Footer minimal />
    </>
  )
}
