import type { BookingDraft } from '../../lib/booking'

export type StepProps = {
  draft: BookingDraft
  update: (patch: Partial<BookingDraft>) => void
  /** True once someone has tried to continue from this step, so every error shows. */
  showErrors: boolean
}
