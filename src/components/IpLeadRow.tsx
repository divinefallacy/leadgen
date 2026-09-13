import type { IpLead, LeadStatus } from '../types'
import { StatusPill } from './StatusPill'
import { DealTypePill } from './DealTypePill'

const STATUS_OPTIONS: LeadStatus[] = [
  'new',
  'researching',
  'contacted',
  'qualified',
  'disqualified',
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function IpLeadRow({
  lead,
  onStatusChange,
  onRemove,
}: {
  lead: IpLead
  onStatusChange: (id: string, status: LeadStatus) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-neutral-800 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-neutral-100">{lead.companyName}</span>
          <StatusPill status={lead.status} />
          <DealTypePill dealType={lead.dealType} />
        </div>
        <div className="text-xs text-neutral-500">
          Licenses {lead.licensedIp} · {lead.vertical} · {lead.territory}
        </div>
        {lead.evidence && <div className="text-sm text-neutral-400">{lead.evidence}</div>}
        <div className="text-xs text-neutral-600">Added {formatDate(lead.dateAdded)}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-300 focus:border-neutral-500 focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onRemove(lead.id)}
          className="rounded border border-neutral-800 px-2 py-1 text-xs text-neutral-500 hover:border-red-900 hover:text-red-400"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
