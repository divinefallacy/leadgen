import type { ReactNode } from 'react'

export function Chip({ tone, children }: { tone: 'amber' | 'grey'; children: ReactNode }) {
  const toneClass =
    tone === 'amber'
      ? 'bg-amber-950 text-amber-400 border-amber-900'
      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs ${toneClass}`}
    >
      {children}
    </span>
  )
}
