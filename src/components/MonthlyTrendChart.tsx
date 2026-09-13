import { useState } from 'react'
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
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

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
  const baseline = PAD_TOP + plotHeight
  const hovered = hoverIndex !== null ? points[hoverIndex] : null

  function edgeAnchor(i: number): 'start' | 'middle' | 'end' {
    if (i === 0) return 'start'
    if (i === points.length - 1) return 'end'
    return 'middle'
  }

  function nearestIndex(clientX: number, svg: SVGSVGElement): number {
    const rect = svg.getBoundingClientRect()
    const svgX = ((clientX - rect.left) / rect.width) * WIDTH
    let closest = 0
    let closestDist = Infinity
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - svgX)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    return closest
  }

  // Tooltip position as a percentage of the SVG box, so it stays correctly
  // placed as the viewBox scales the SVG to the container's actual width.
  const tooltipStyle = hovered
    ? {
        left: `${(hovered.x / WIDTH) * 100}%`,
        top: `${(hovered.y / HEIGHT) * 100}%`,
      }
    : undefined

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="mb-3 text-sm font-medium text-neutral-300">{title}</div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full touch-none"
          style={{ height: HEIGHT }}
          onPointerMove={(e) => setHoverIndex(nearestIndex(e.clientX, e.currentTarget))}
          onPointerLeave={() => setHoverIndex(null)}
        >
          <line
            x1={PAD_X}
            y1={baseline}
            x2={WIDTH - PAD_X}
            y2={baseline}
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
          {hovered && (
            <line x1={hovered.x} y1={PAD_TOP} x2={hovered.x} y2={baseline} stroke={GRID_COLOR} strokeWidth={1} />
          )}
          <path
            d={path}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.map((p, i) => (
            <g key={p.month}>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === hoverIndex ? 6 : 4}
                fill={LINE_COLOR}
                stroke="#171717"
                strokeWidth={2}
                className="transition-[r] duration-100"
              />
              {/* Larger transparent hit target per point, per dataviz interaction guidance (>=24px). */}
              <circle
                cx={p.x}
                cy={p.y}
                r={14}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${monthLabel(p.month)}: ${formatCompactCurrency(p.value)}`}
                className="outline-none focus-visible:fill-white/5"
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
                onPointerEnter={() => setHoverIndex(i)}
              />
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
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs shadow-lg"
            style={tooltipStyle}
          >
            <span className="font-semibold text-neutral-100">{formatCompactCurrency(hovered.value)}</span>
            <span className="ml-1 text-neutral-400">{monthLabel(hovered.month)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
