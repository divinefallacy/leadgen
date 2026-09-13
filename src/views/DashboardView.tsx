import { useEffect, useMemo, useState } from 'react'
import type { Account } from '../types'
import { accountRepo } from '../lib/repo'
import { accountsToAction, booked2026, revenueAtRisk, totalRevenue2025, yoyDelta } from '../lib/metrics'
import { buildSuggestions } from '../lib/suggestions'
import { formatCurrency, formatDelta } from '../lib/format'
import { MetricCard } from '../components/MetricCard'
import { RevenueCompareBars } from '../components/RevenueCompareBars'
import { SuggestedActions } from '../components/SuggestedActions'

function LineSummary({ title, accounts }: { title: string; accounts: Account[] }) {
  const delta = yoyDelta(accounts)
  return (
    <div className="flex flex-col gap-3 rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-sm font-medium text-neutral-300">{title}</div>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Revenue at risk" value={formatCurrency(revenueAtRisk(accounts))} tone="red" />
        <MetricCard label="2026 booked" value={formatCurrency(booked2026(accounts))} />
        <MetricCard label="Accounts to action" value={String(accountsToAction(accounts))} />
        <MetricCard
          label="YoY delta"
          value={formatDelta(delta)}
          tone={delta < 0 ? 'red' : delta > 0 ? 'green' : 'neutral'}
        />
      </div>
    </div>
  )
}

export function DashboardView() {
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    accountRepo.listAccounts().then(setAccounts)
  }, [])

  const eventAccounts = useMemo(() => accounts.filter((a) => a.line === 'Event'), [accounts])
  const licensingAccounts = useMemo(() => accounts.filter((a) => a.line === 'Licensing'), [accounts])

  const overallDelta = yoyDelta(accounts)
  const suggestions = useMemo(() => buildSuggestions(accounts), [accounts])

  const barRows = [
    { label: 'Events', rev2025: totalRevenue2025(eventAccounts), rev2026: booked2026(eventAccounts) },
    { label: 'IP Licensing', rev2025: totalRevenue2025(licensingAccounts), rev2026: booked2026(licensingAccounts) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">Overall performance</h2>
        <p className="text-sm text-neutral-500">
          Events and IP Licensing are tracked as separate business lines — a company can be dead on
          one and live on the other, so nothing here is blended across them except this combined total.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Revenue at risk" value={formatCurrency(revenueAtRisk(accounts))} tone="red" />
        <MetricCard label="2026 booked" value={formatCurrency(booked2026(accounts))} />
        <MetricCard label="Accounts to action" value={String(accountsToAction(accounts))} />
        <MetricCard
          label="YoY delta"
          value={formatDelta(overallDelta)}
          tone={overallDelta < 0 ? 'red' : overallDelta > 0 ? 'green' : 'neutral'}
        />
      </div>

      <SuggestedActions suggestions={suggestions} />

      <RevenueCompareBars rows={barRows} />

      <div className="grid gap-4 sm:grid-cols-2">
        <LineSummary title="Event Sponsorships" accounts={eventAccounts} />
        <LineSummary title="IP Licensing" accounts={licensingAccounts} />
      </div>
    </div>
  )
}
