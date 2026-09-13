import { useState } from 'react'
import type { Account, MonthPlan } from '../types'
import { LICENSING_MONTHLY_GOAL } from '../config'

function monthLabel(month: string): string {
  const [year, m] = month.split('-').map(Number)
  return new Date(year, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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
  const [eventsText, setEventsText] = useState(plan.targetEvents.join(', '))
  const isEventFocus = plan.targetEvents.length > 0
  const goalHit = actualLicensingDeals.length >= LICENSING_MONTHLY_GOAL

  const commitEvents = () => {
    const parsed = eventsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    onChange({ targetEvents: parsed })
  }

  return (
    <div className="flex flex-col gap-3 rounded border border-neutral-800 bg-neutral-900 p-4">
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

      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">Target events</label>
        <input
          list="known-big-events"
          value={eventsText}
          onChange={(e) => setEventsText(e.target.value)}
          onBlur={commitEvents}
          placeholder="e.g. Token2049, KBW"
          className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
        />
        {actualEventDeals.length > 0 && (
          <div className="text-xs text-neutral-500">
            Actual: {actualEventDeals.length} event deal{actualEventDeals.length > 1 ? 's' : ''} closed (
            {actualEventDeals.map((a) => a.name).join(', ')})
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">Licensing target ({LICENSING_MONTHLY_GOAL}+ deal goal)</label>
        <input
          value={plan.licensingTarget}
          onChange={(e) => onChange({ licensingTarget: e.target.value })}
          placeholder="Which deal(s) this month is aimed at closing"
          className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
        />
        <label className="flex items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={plan.licensingGoalMet}
            onChange={(e) => onChange({ licensingGoalMet: e.target.checked })}
          />
          Goal met this month
        </label>
        <div className={`text-xs ${goalHit ? 'text-green-400' : 'text-neutral-500'}`}>
          Actual: {actualLicensingDeals.length} licensing deal{actualLicensingDeals.length === 1 ? '' : 's'} closed
          {actualLicensingDeals.length > 0 ? ` (${actualLicensingDeals.map((a) => a.name).join(', ')})` : ''}
        </div>
      </div>
    </div>
  )
}
