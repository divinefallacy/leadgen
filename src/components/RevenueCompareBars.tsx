import { formatCurrency } from '../lib/format'

// Categorical slots 1 (blue) and 2 (orange) from the design system's dark
// palette, validated against this app's #0b0b0d surface — see
// dataviz skill references/palette.md.
const COLOR_2025 = '#3987e5'
const COLOR_2026 = '#d95926'

type RevenueRow = {
  label: string
  rev2025: number
  rev2026: number
}

function Bar({
  value,
  max,
  color,
  rowLabel,
  seriesLabel,
}: {
  value: number
  max: number
  color: string
  rowLabel: string
  seriesLabel: string
}) {
  const widthPct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="group relative h-3.5 flex-1 rounded-full bg-neutral-900">
        <button
          type="button"
          aria-label={`${rowLabel} ${seriesLabel}: ${formatCurrency(value)}`}
          className="block h-3.5 rounded-full outline-none transition-[width,filter] duration-300 hover:brightness-125 focus-visible:brightness-125 focus-visible:ring-2 focus-visible:ring-white/40"
          style={{ width: `${widthPct}%`, backgroundColor: color }}
        />
        <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="font-semibold text-neutral-100">{formatCurrency(value)}</span>
          <span className="ml-1 text-neutral-400">
            {rowLabel} · {seriesLabel}
          </span>
        </div>
      </div>
      <span className="w-20 shrink-0 text-right text-xs tabular-nums text-neutral-300">
        {formatCurrency(value)}
      </span>
    </div>
  )
}

export function RevenueCompareBars({ rows }: { rows: RevenueRow[] }) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.rev2025, r.rev2026]))

  return (
    <div className="flex flex-col gap-4 rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-neutral-300">Revenue by business line</div>
        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_2025 }} />
            2025
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_2026 }} />
            2026
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1.5">
            <div className="text-xs text-neutral-500">{row.label}</div>
            <Bar value={row.rev2025} max={max} color={COLOR_2025} rowLabel={row.label} seriesLabel="2025" />
            <Bar value={row.rev2026} max={max} color={COLOR_2026} rowLabel={row.label} seriesLabel="2026" />
          </div>
        ))}
      </div>
    </div>
  )
}
