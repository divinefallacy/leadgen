import type { Action } from '../types'

const ACTION_STYLES: Record<Action, { label: string; className: string }> = {
  lapse: { label: 'Lapsed', className: 'bg-red-950 text-red-400 border-red-900' },
  cross: { label: 'Cross-sell', className: 'bg-blue-950 text-blue-400 border-blue-900' },
  repeat: { label: 'Repeat', className: 'bg-green-950 text-green-400 border-green-900' },
  cold: { label: 'Cold', className: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
}

export function ActionPill({ action }: { action: Action }) {
  const style = ACTION_STYLES[action]
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  )
}
