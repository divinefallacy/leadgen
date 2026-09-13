import type { Account } from '../types'
import { booked2026, monthlyDealValue, topAccountsByRevenue2026 } from '../lib/metrics'
import { formatCompactCurrency } from '../lib/format'
import { StatHero } from './StatHero'
import { TopAccountsBarChart } from './TopAccountsBarChart'
import { MonthlyTrendChart } from './MonthlyTrendChart'

export function PerformanceDashboard({ accounts, revenueLabel }: { accounts: Account[]; revenueLabel: string }) {
  const topAccounts = topAccountsByRevenue2026(accounts)
  const monthly = monthlyDealValue(accounts)

  return (
    <div className="flex flex-col gap-4 rounded border border-neutral-800 bg-neutral-950 p-4">
      <StatHero label={revenueLabel} value={formatCompactCurrency(booked2026(accounts))} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <TopAccountsBarChart rows={topAccounts} title="Top accounts by 2026 revenue" />
        </div>
        <div className="min-w-0">
          <MonthlyTrendChart rows={monthly} title="Monthly deal value (by signed/start date)" />
        </div>
      </div>
    </div>
  )
}
