import type { LeadStatus } from '../types'

const STATUS_STYLES: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-950 text-blue-400 border-blue-900' },
  researching: { label: 'Researching', className: 'bg-amber-950 text-amber-400 border-amber-900' },
  contacted: { label: 'Contacted', className: 'bg-purple-950 text-purple-400 border-purple-900' },
  qualified: { label: 'Qualified', className: 'bg-green-950 text-green-400 border-green-900' },
  disqualified: {
    label: 'Disqualified',
    className: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  },
}

export function StatusPill({ status }: { status: LeadStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  )
}
