import type { Lead } from '../types'
import { Chip } from './Chip'

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="flex flex-col gap-2 border-b border-neutral-800 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-neutral-100">{lead.name}</span>
        <span className="text-xs text-neutral-500">{lead.vertical}</span>
        {lead.unverified && <Chip tone="amber">Unverified figure</Chip>}
      </div>
      <div className="text-sm text-neutral-300">{lead.whyFit}</div>
      <div className="grid gap-1 text-xs text-neutral-400 sm:grid-cols-2">
        <div>
          <span className="text-neutral-500">Signal: </span>
          {lead.signal}
        </div>
        <div>
          <span className="text-neutral-500">Distribution: </span>
          {lead.distribution}
        </div>
        <div className="sm:col-span-2">
          <span className="text-neutral-500">Pitch: </span>
          {lead.productFormat}
        </div>
      </div>
      {lead.sourceUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {lead.sourceUrls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 underline hover:text-neutral-300"
            >
              {url}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
