import { useState } from 'react'
import type { Suggestion, SuggestionPriority } from '../lib/suggestions'

const PRIORITY_STYLES: Record<SuggestionPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-red-950 text-red-400 border-red-900' },
  medium: { label: 'Medium', className: 'bg-amber-950 text-amber-400 border-amber-900' },
  low: { label: 'Low', className: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
}

const NAMES_SHOWN = 5

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const [expanded, setExpanded] = useState(false)
  const style = PRIORITY_STYLES[suggestion.priority]
  const shown = expanded ? suggestion.accountNames : suggestion.accountNames.slice(0, NAMES_SHOWN)
  const remaining = suggestion.accountNames.length - shown.length

  return (
    <div className="flex flex-col gap-2 rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${style.className}`}
        >
          {style.label}
        </span>
        <span className="font-medium text-neutral-100">{suggestion.title}</span>
      </div>
      <p className="text-sm text-neutral-400">{suggestion.detail}</p>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((name) => (
          <span key={name} className="rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
            {name}
          </span>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-500 hover:text-neutral-300"
          >
            +{remaining} more
          </button>
        )}
      </div>
    </div>
  )
}

export function SuggestedActions({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium text-neutral-300">Suggested next steps</h3>
        <p className="text-xs text-neutral-500">
          Generated from the current pipeline — rules over the numbers, not a substitute for hand review.
        </p>
      </div>
      {suggestions.length === 0 ? (
        <div className="rounded border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-500">
          Nothing urgent — the pipeline looks clean.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {suggestions.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      )}
    </div>
  )
}
