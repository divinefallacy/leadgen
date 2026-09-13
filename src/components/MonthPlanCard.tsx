import { useState } from 'react'
import type { Account, MonthPlan } from '../types'
import { LICENSING_MONTHLY_GOAL } from '../config'
import { dealValue } from '../lib/metrics'
import { formatCurrency } from '../lib/format'

function monthLabel(month: string): string {
  const [year, m] = month.split('-').map(Number)
  return new Date(year, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function EventTagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const trimmed = draft.trim()
    if (!trimmed || tags.includes(trimmed)) {
      setDraft('')
      return
    }
    onChange([...tags, trimmed])
    setDraft('')
  }

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag))

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded border border-blue-900 bg-blue-950 px-2 py-0.5 text-xs text-blue-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-blue-400 hover:text-blue-200"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          list="known-big-events"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder="Add an event, press Enter"
          className="flex-1 rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded border border-neutral-700 px-2 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
        >
          Add
        </button>
      </div>
    </div>
  )
}

function RevenueInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-neutral-500">$</span>
      <input
        type="number"
        min={0}
        step={1000}
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        placeholder="0"
        className="w-28 rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
      />
    </div>
  )
}

export function MonthPlanCard({
  plan,
  actualEventDeals,
  actualLicensingDeals,
  onChange,
}: {
  plan: MonthPlan
  actualEventDeals: Account[]
  actualLicensingDeals: Account[]
  onChange: (patch: Partial<Omit<MonthPlan, 'month'>>) => void
}) {
  const isEventFocus = plan.targetEvents.length > 0
  const actualEventsRevenue = dealValue(actualEventDeals)
  const actualLicensingRevenue = dealValue(actualLicensingDeals)
  const licensingGoalHit = actualLicensingDeals.length >= LICENSING_MONTHLY_GOAL

  return (
    <div className="flex flex-col gap-4 rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-neutral-100">{monthLabel(plan.month)}</span>
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
            isEventFocus
              ? 'border-blue-900 bg-blue-950 text-blue-400'
              : 'border-neutral-700 bg-neutral-800 text-neutral-400'
          }`}
        >
          {isEventFocus ? 'Events focus' : 'Licensing focus'}
        </span>
      </div>

      <div className="flex flex-col gap-2 border-b border-neutral-800 pb-3">
        <label className="text-xs text-neutral-500">Target events (add as many as apply)</label>
        <EventTagInput tags={plan.targetEvents} onChange={(targetEvents) => onChange({ targetEvents })} />
        <div className="flex items-center justify-between">
          <label className="text-xs text-neutral-500">Events revenue target</label>
          <RevenueInput
            value={plan.eventsRevenueTarget}
            onChange={(eventsRevenueTarget) => onChange({ eventsRevenueTarget })}
          />
        </div>
        <div className="text-xs text-neutral-500">
          Actual: {formatCurrency(actualEventsRevenue)}
          {actualEventDeals.length > 0 && ` across ${actualEventDeals.length} deal${actualEventDeals.length > 1 ? 's' : ''} (${actualEventDeals.map((a) => a.name).join(', ')})`}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-neutral-500">Licensing target ({LICENSING_MONTHLY_GOAL}+ deal goal)</label>
        <input
          value={plan.licensingTarget}
          onChange={(e) => onChange({ licensingTarget: e.target.value })}
          placeholder="Which deal(s) this month is aimed at closing"
          className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <label className="text-xs text-neutral-500">Licensing revenue target</label>
          <RevenueInput
            value={plan.licensingRevenueTarget}
            onChange={(licensingRevenueTarget) => onChange({ licensingRevenueTarget })}
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={plan.licensingGoalMet}
            onChange={(e) => onChange({ licensingGoalMet: e.target.checked })}
          />
          Goal met this month
        </label>
        <div className={`text-xs ${licensingGoalHit ? 'text-green-400' : 'text-neutral-500'}`}>
          Actual: {formatCurrency(actualLicensingRevenue)}
          {actualLicensingDeals.length > 0 && ` across ${actualLicensingDeals.length} deal${actualLicensingDeals.length > 1 ? 's' : ''} (${actualLicensingDeals.map((a) => a.name).join(', ')})`}
        </div>
      </div>
    </div>
  )
}
