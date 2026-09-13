import { useEffect, useMemo, useState } from 'react'
import type { Account, MonthPlan } from '../types'
import { accountRepo } from '../lib/repo'
import { planningRepo } from '../lib/planningRepo'
import { dealsInMonth, dealValue } from '../lib/metrics'
import { formatCurrency } from '../lib/format'
import { KNOWN_BIG_EVENTS, LICENSING_MONTHLY_GOAL } from '../config'
import { MetricCard } from '../components/MetricCard'
import { MonthPlanCard } from '../components/MonthPlanCard'

function LinePlanSummary({
  title,
  revenueTarget,
  revenueActual,
  extra,
}: {
  title: string
  revenueTarget: number
  revenueActual: number
  extra: { label: string; value: string }
}) {
  const onTrack = revenueActual >= revenueTarget && revenueTarget > 0
  return (
    <div className="flex flex-col gap-3 rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-sm font-medium text-neutral-300">{title}</div>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Revenue target" value={formatCurrency(revenueTarget)} />
        <MetricCard label="Actual booked" value={formatCurrency(revenueActual)} tone={onTrack ? 'green' : 'neutral'} />
        <MetricCard label={extra.label} value={extra.value} />
      </div>
    </div>
  )
}

export function PlanningView() {
  const [year, setYear] = useState(() => new Date().getFullYear() + 1)
  const [plans, setPlans] = useState<MonthPlan[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    accountRepo.listAccounts().then(setAccounts)
  }, [])

  useEffect(() => {
    planningRepo.getYearPlan(year).then(setPlans)
  }, [year])

  const eventFocusMonths = plans.filter((p) => p.targetEvents.length > 0).length
  const goalsMet = plans.filter((p) => p.licensingGoalMet).length

  const dealsByMonth = useMemo(() => {
    const map = new Map<string, { events: Account[]; licensing: Account[] }>()
    for (const plan of plans) {
      const inMonth = dealsInMonth(accounts, plan.month)
      map.set(plan.month, {
        events: inMonth.filter((a) => a.line === 'Event'),
        licensing: inMonth.filter((a) => a.line === 'Licensing'),
      })
    }
    return map
  }, [plans, accounts])

  const eventsRevenueTarget = plans.reduce((sum, p) => sum + p.eventsRevenueTarget, 0)
  const licensingRevenueTarget = plans.reduce((sum, p) => sum + p.licensingRevenueTarget, 0)
  const eventsRevenueActual = plans.reduce((sum, p) => sum + dealValue(dealsByMonth.get(p.month)?.events ?? []), 0)
  const licensingRevenueActual = plans.reduce(
    (sum, p) => sum + dealValue(dealsByMonth.get(p.month)?.licensing ?? []),
    0,
  )

  const handleMonthChange = (month: string, patch: Partial<Omit<MonthPlan, 'month'>>) => {
    setPlans((prev) => prev.map((p) => (p.month === month ? { ...p, ...patch } : p)))
    planningRepo.updateMonth(month, patch)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">Plan the year ahead</h2>
        <p className="text-sm text-neutral-500">
          Licensing carries a {LICENSING_MONTHLY_GOAL}+ deal-a-month goal all year. Events focuses spend and
          push around the headline conferences — every other month is licensing's to carry.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setYear((y) => y - 1)}
          className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
        >
          ← {year - 1}
        </button>
        <span className="text-lg font-semibold text-neutral-100">{year}</span>
        <button
          type="button"
          onClick={() => setYear((y) => y + 1)}
          className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
        >
          {year + 1} →
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <LinePlanSummary
          title="Events plan"
          revenueTarget={eventsRevenueTarget}
          revenueActual={eventsRevenueActual}
          extra={{ label: 'Focus months', value: `${eventFocusMonths} / 12` }}
        />
        <LinePlanSummary
          title="Licensing plan"
          revenueTarget={licensingRevenueTarget}
          revenueActual={licensingRevenueActual}
          extra={{ label: 'Goal met', value: `${goalsMet} / 12` }}
        />
      </div>

      <datalist id="known-big-events">
        {KNOWN_BIG_EVENTS.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const deals = dealsByMonth.get(plan.month)
          return (
            <MonthPlanCard
              key={plan.month}
              plan={plan}
              actualEventDeals={deals?.events ?? []}
              actualLicensingDeals={deals?.licensing ?? []}
              onChange={(patch) => handleMonthChange(plan.month, patch)}
            />
          )
        })}
      </div>
    </div>
  )
}
