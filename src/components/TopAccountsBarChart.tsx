import { formatCompactCurrency } from '../lib/format'
import type { NamedValue } from '../lib/metrics'

// Sequential single hue — this chart's job is magnitude comparison across
// accounts, not telling distinct categories apart, so one hue (not a
// different color per bar) is the correct read. Validated against this
// app's #0b0b0d surface via the dataviz skill's palette validator.
const BAR_COLOR = '#3987e5'
const CHART_HEIGHT = 160
const MIN_COLUMN_WIDTH = 56

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
      <div className="overflow-x-auto">
        <div
          className="flex items-end gap-3"
          style={{ height: CHART_HEIGHT, minWidth: rows.length * MIN_COLUMN_WIDTH }}
        >
          {rows.map((row) => (
            <div key={row.name} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="text-xs text-neutral-300">{formatCompactCurrency(row.value)}</span>
              <div className="group relative">
                <button
                  type="button"
                  aria-label={`${row.name}: ${formatCompactCurrency(row.value)}`}
                  className="w-6 rounded-t outline-none transition-[height,filter] duration-300 hover:brightness-125 focus-visible:brightness-125 focus-visible:ring-2 focus-visible:ring-white/40"
                  style={{
                    // Reserves headroom above the tallest bar for its value
                    // label plus the hover tooltip (which pops up further
                    // above that) — items-end anchors bars to the bottom,
                    // so this reserve has to come from the height ratio
                    // itself, not container padding.
                    height: `${Math.max((row.value / max) * (CHART_HEIGHT - 56), 3)}px`,
                    backgroundColor: BAR_COLOR,
                  }}
                />
                <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                  <span className="font-semibold text-neutral-100">{formatCompactCurrency(row.value)}</span>
                  <span className="ml-1 text-neutral-400">{row.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-3" style={{ minWidth: rows.length * MIN_COLUMN_WIDTH }}>
          {rows.map((row) => (
            <div key={row.name} className="flex-1 truncate text-center text-xs text-neutral-500">
              {row.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
