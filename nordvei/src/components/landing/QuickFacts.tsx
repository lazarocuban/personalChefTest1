import { quickFacts, type QuickFact } from '../../data/trip'
import { useCountUp, useInView } from '../../hooks/motion'

function FactValue({ fact, start }: { fact: QuickFact; start: boolean }) {
  const [from, to] = Array.isArray(fact.value) ? fact.value : [fact.value ?? 0, fact.value ?? 0]
  const a = useCountUp(from, start)
  const b = useCountUp(to, start)
  if (fact.value === undefined) return <>{fact.text}</>
  const finalText = Array.isArray(fact.value) ? `${from}–${to}${fact.suffix ?? ''}` : `${to}${fact.suffix ?? ''}`
  return (
    <>
      <span aria-hidden="true">
        {Array.isArray(fact.value) ? `${a}–${b}` : b}
        <span className="fact__suffix">{fact.suffix}</span>
      </span>
      <span className="sr-only">{finalText}</span>
    </>
  )
}

export function QuickFacts() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 })
  return (
    <section ref={ref} className="facts" aria-label="Quick facts">
      <div className="container">
        <dl className={`facts__grid reveal ${inView ? 'is-visible' : ''}`}>
          {quickFacts.map((f, i) => (
            <div className="fact" key={f.label} style={{ transitionDelay: `${i * 90}ms` }}>
              <dt className="fact__label">{f.label}</dt>
              <dd className="fact__value">
                <FactValue fact={f} start={inView} />
              </dd>
              <dd className="fact__detail">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
