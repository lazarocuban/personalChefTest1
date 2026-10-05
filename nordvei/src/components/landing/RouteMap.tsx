import { useMemo, useState } from 'react'
import { stages, tripVersions, waypoints, type Waypoint, type WaypointKind } from '../../data/trip'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const W = 1000
const H = 620

const kindLabel: Record<WaypointKind, string> = {
  start: 'Trailhead',
  lake: 'Lake',
  forest: 'Forest',
  hut: 'Mountain hut',
  ridge: 'High point',
  end: 'Finish',
}

type Pt = { x: number; y: number }

/** One smooth cubic segment per stage, with Catmull-Rom tangents from the neighbouring points. */
function segments(points: Pt[]): string[] {
  return points.slice(0, -1).map((p1, i) => {
    const p0 = points[i - 1] ?? p1
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`
  })
}

/** Deterministic scatter of little trees for the forest areas. */
function trees(cx: number, cy: number, r: number, count: number, seed: number) {
  const out: Pt[] = []
  let s = seed
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * r
    out.push({ x: cx + Math.cos(a) * d * 1.4, y: cy + Math.sin(a) * d * 0.8 })
  }
  return out.sort((a, b) => a.y - b.y)
}

const forests = [
  ...trees(300, 345, 70, 34, 7),
  ...trees(130, 470, 50, 18, 13),
  ...trees(470, 345, 45, 14, 21),
  ...trees(790, 375, 60, 26, 3),
  ...trees(660, 470, 40, 12, 5),
]

const peaks = [
  { x: 690, y: 175, s: 34 },
  { x: 735, y: 140, s: 46 },
  { x: 790, y: 168, s: 30 },
  { x: 620, y: 220, s: 26 },
  { x: 850, y: 200, s: 24 },
]

/** Where to place each label relative to its point. */
const labelPos: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  fjellstad: { dx: 0, dy: 34, anchor: 'middle' },
  stillvatn: { dx: -18, dy: -14, anchor: 'end' },
  granli: { dx: 0, dy: -22, anchor: 'middle' },
  myrvann: { dx: 0, dy: 36, anchor: 'middle' },
  bjorkli: { dx: 0, dy: -22, anchor: 'middle' },
  langvatnet: { dx: 0, dy: 40, anchor: 'middle' },
  fjellsaetra: { dx: -18, dy: -10, anchor: 'end' },
  hogtind: { dx: 0, dy: -64, anchor: 'middle' },
  kvitvann: { dx: 20, dy: -14, anchor: 'start' },
  nordvatn: { dx: -20, dy: 4, anchor: 'end' },
  elvestrand: { dx: 0, dy: 36, anchor: 'end' },
}

const cumulativeKm = (day: number) => stages.slice(0, day).reduce((sum, s) => sum + s.km, 0)

function WaypointCard({ wp }: { wp: Waypoint }) {
  const version = tripVersions.find((v) => v.days === wp.stageDay)
  const reach =
    wp.stageDay === 0
      ? 'Every trip starts here.'
      : wp.stageDay <= 3
        ? 'On every trip, including the 3-day version.'
        : `On trips of ${wp.stageDay} days or longer.`

  return (
    <div className="card map-card" aria-live="polite">
      <p className="eyebrow">
        {kindLabel[wp.kind]}
        {wp.stageDay > 0 && ` · End of day ${wp.stageDay}`}
      </p>
      <h3 className="h3">{wp.name}</h3>
      <p className="muted">{wp.description}</p>
      <dl className="stat-row">
        <div>
          <dt>From start</dt>
          <dd>{cumulativeKm(wp.stageDay)} km</dd>
        </div>
        <div>
          <dt>Elevation</dt>
          <dd>{wp.elevation.toLocaleString('en-GB')} m</dd>
        </div>
        <div>
          <dt>Day</dt>
          <dd>{wp.stageDay === 0 ? 'Start' : wp.stageDay}</dd>
        </div>
      </dl>
      <ul className="tick-list">
        {wp.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <p className="map-card__reach">
        {reach}
        {version && (
          <>
            {' '}
            <strong>
              The {version.days}-day “{version.name}” trip finishes here.
            </strong>
          </>
        )}
      </p>
    </div>
  )
}

export function RouteMap() {
  const [selectedId, setSelectedId] = useState('stillvatn')
  const selected = waypoints.find((w) => w.id === selectedId) ?? waypoints[0]
  const segs = useMemo(() => segments(waypoints), [])
  const start = `M ${waypoints[0].x} ${waypoints[0].y}`
  const fullPath = `${start} ${segs.join(' ')}`
  const walkedPath = `${start} ${segs.slice(0, selected.stageDay).join(' ')}`
  const exitDays = new Set(tripVersions.map((v) => v.days))

  return (
    <Section
      id="route"
      eyebrow="The Route"
      title="151 km from railway to river."
      lead="The Nordvei links ten lakes and forests between two railway stations. Choose a waypoint to see what waits there; the line shows how far you walk to reach it."
    >
      <Reveal className="map-layout">
        <div className="map card">
          <div className="map__canvas">
            <svg viewBox={`0 0 ${W} ${H}`} className="map__svg" role="img" aria-labelledby="map-svg-title">
              <title id="map-svg-title">
                Illustrated map of the Nordvei trail from Fjellstad in the south-west to Elvestrand in the south-east,
                climbing to Høgtind in the north.
              </title>
              {/* contour rings around the high ground */}
              <g className="map__contours">
                {[90, 150, 215, 290].map((r, i) => (
                  <ellipse key={r} cx={735} cy={175} rx={r * 1.35} ry={r * 0.72} opacity={1 - i * 0.18} />
                ))}
                {[60, 110].map((r) => (
                  <ellipse key={r} cx={470} cy={285} rx={r * 1.3} ry={r * 0.6} />
                ))}
              </g>
              {/* river to the finish */}
              <path className="map__river" d="M 1000 520 C 960 540 950 575 900 590 S 820 615 780 620" />
              {/* lakes */}
              <g className="map__lakes">
                <ellipse cx={240} cy={468} rx={62} ry={24} transform="rotate(-12 240 468)" />
                <ellipse cx={428} cy={462} rx={44} ry={20} transform="rotate(8 428 462)" />
                <ellipse cx={585} cy={452} rx={112} ry={17} transform="rotate(-15 585 452)" />
                <ellipse cx={842} cy={300} rx={40} ry={20} transform="rotate(10 842 300)" />
                <ellipse cx={905} cy={425} rx={30} ry={13} />
                <ellipse cx={848} cy={492} rx={26} ry={12} transform="rotate(-8 848 492)" />
                <ellipse cx={928} cy={478} rx={18} ry={9} />
              </g>
              {/* forests */}
              <g className="map__trees">
                {forests.map((t, i) => (
                  <path key={i} d={`M ${t.x} ${t.y - 9} L ${t.x + 5} ${t.y + 3} L ${t.x - 5} ${t.y + 3} Z`} />
                ))}
              </g>
              {/* mountains */}
              <g className="map__peaks">
                {peaks.map((p) => (
                  <path
                    key={`${p.x}-${p.y}`}
                    d={`M ${p.x - p.s} ${p.y + p.s * 0.7} L ${p.x} ${p.y - p.s * 0.5} L ${p.x + p.s} ${p.y + p.s * 0.7}`}
                  />
                ))}
              </g>
              {/* trail */}
              <path className="map__trail" d={fullPath} />
              <path className="map__trail map__trail--walked" d={walkedPath} />
              {/* labels */}
              <g className="map__labels" aria-hidden="true">
                {waypoints.map((w) => {
                  const pos = labelPos[w.id]
                  return (
                    <text
                      key={w.id}
                      x={w.x + pos.dx}
                      y={w.y + pos.dy}
                      textAnchor={pos.anchor}
                      className={w.id === selectedId ? 'is-selected' : ''}
                    >
                      {w.name.replace(/ Hut$/, '')}
                    </text>
                  )
                })}
              </g>
              {/* compass */}
              <g className="map__compass" transform="translate(940 70)" aria-hidden="true">
                <circle r="22" />
                <path d="M 0 -15 L 5 3 L 0 0 L -5 3 Z" />
                <text y="-28" textAnchor="middle">
                  N
                </text>
              </g>
            </svg>

            {waypoints.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`map__pin map__pin--${w.kind} ${w.id === selectedId ? 'is-selected' : ''} ${
                  exitDays.has(w.stageDay) ? 'is-exit' : ''
                }`}
                style={{ left: `${(w.x / W) * 100}%`, top: `${(w.y / H) * 100}%` }}
                aria-pressed={w.id === selectedId}
                aria-label={`${w.stageDay === 0 ? 'Start' : `Day ${w.stageDay}`}: ${w.name}, ${kindLabel[
                  w.kind
                ].toLowerCase()}`}
                onClick={() => setSelectedId(w.id)}
              >
                <span className="map__dot" />
              </button>
            ))}
          </div>

          <ul className="map__legend" aria-label="Map legend">
            <li>
              <span className="legend legend--trail" /> Trail walked to this point
            </li>
            <li>
              <span className="legend legend--exit" /> Where 3, 5, 7 and 10-day trips finish
            </li>
            <li>
              <span className="legend legend--lake" /> Lakes
            </li>
            <li>
              <span className="legend legend--forest" /> Forest
            </li>
          </ul>
        </div>

        <WaypointCard wp={selected} />
      </Reveal>
    </Section>
  )
}
