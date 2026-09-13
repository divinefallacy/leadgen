import { formatCompactCurrency } from '../lib/format'
import type { MonthlyValue } from '../lib/metrics'

const LINE_COLOR = '#3987e5'
const GRID_COLOR = '#383835'
const WIDTH = 600
const HEIGHT = 180
const PAD_X = 12
const PAD_TOP = 24
const PAD_BOTTOM = 24

function monthLabel(bucket: string): string {
  const [year, month] = bucket.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function MonthlyTrendChart({ rows, title }: { rows: MonthlyValue[]; title: string }) {
  if (rows.length === 0) {
    return (
      <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
        <div className="mb-3 text-sm font-medium text-neutral-300">{title}</div>
        <div className="py-8 text-center text-sm text-neutral-500">No signed/started dates on record yet.</div>
      </div>
    )
  }

  const max = Math.max(1, ...rows.map((r) => r.value))
  const plotWidth = WIDTH - PAD_X * 2
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM
  const stepX = rows.length > 1 ? plotWidth / (rows.length - 1) : 0
  const points = rows.map((r, i) => ({
    x: PAD_X + (rows.length > 1 ? i * stepX : plotWidth / 2),
    y: PAD_TOP + plotHeight - (r.value / max) * plotHeight,
    ...r,
  }))
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  function edgeAnchor(i: number): 'start' | 'middle' | 'end' {
    if (i === 0) return 'start'
    if (i === points.length - 1) return 'end'
    return 'middle'
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="mb-3 text-sm font-medium text-neutral-300">{title}</div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ height: HEIGHT }}>
        <line
          x1={PAD_X}
          y1={PAD_TOP + plotHeight}
          x2={WIDTH - PAD_X}
          y2={PAD_TOP + plotHeight}
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
        <path d={path} fill="none" stroke={LINE_COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={p.month}>
            <circle cx={p.x} cy={p.y} r={4} fill={LINE_COLOR} stroke="#171717" strokeWidth={2}>
              <title>
                {monthLabel(p.month)}: {formatCompactCurrency(p.value)}
              </title>
            </circle>
            {(i === 0 || i === points.length - 1) && (
              <text x={p.x} y={p.y - 10} textAnchor={edgeAnchor(i)} fontSize={11} fill="#c3c2b7">
                {formatCompactCurrency(p.value)}
              </text>
            )}
            <text x={p.x} y={HEIGHT - 6} textAnchor={edgeAnchor(i)} fontSize={10} fill="#898781">
              {monthLabel(p.month)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
