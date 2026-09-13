import { formatCompactCurrency } from '../lib/format'
import type { NamedValue } from '../lib/metrics'

// Sequential single hue — this chart's job is magnitude comparison across
// accounts, not telling distinct categories apart, so one hue (not a
// different color per bar) is the correct read. Validated against this
// app's #0b0b0d surface via the dataviz skill's palette validator.
const BAR_COLOR = '#3987e5'
const CHART_HEIGHT = 160

export function TopAccountsBarChart({ rows, title }: { rows: NamedValue[]; title: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))

  if (rows.length === 0) {
    return (
      <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
        <div className="mb-3 text-sm font-medium text-neutral-300">{title}</div>
        <div className="py-8 text-center text-sm text-neutral-500">No 2026 revenue booked yet.</div>
      </div>
    )
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="mb-3 text-sm font-medium text-neutral-300">{title}</div>
      <div className="flex items-end gap-3" style={{ height: CHART_HEIGHT }}>
        {rows.map((row) => (
          <div key={row.name} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-xs text-neutral-300">{formatCompactCurrency(row.value)}</span>
            <div
              className="w-6 rounded-t"
              style={{
                height: `${Math.max((row.value / max) * (CHART_HEIGHT - 24), 3)}px`,
                backgroundColor: BAR_COLOR,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {rows.map((row) => (
          <div key={row.name} className="flex-1 truncate text-center text-xs text-neutral-500" title={row.name}>
            {row.name}
          </div>
        ))}
      </div>
    </div>
  )
}
