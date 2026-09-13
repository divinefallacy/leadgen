import { useEffect, useMemo, useState } from 'react'
import type { Account } from '../types'
import { accountRepo } from '../lib/repo'
import {
  accountsToAction,
  booked2026,
  isExcludedFromPipeline,
  revenueAtRisk,
  yoyDelta,
} from '../lib/metrics'
import { formatCurrency, formatDelta } from '../lib/format'
import { accountsToCsv, downloadCsv } from '../lib/csv'
import { MetricCard } from '../components/MetricCard'
import { FilterTabs, type AccountFilter } from '../components/FilterTabs'
import { AccountRow } from '../components/AccountRow'

function matchesFilter(account: Account, filter: AccountFilter): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'dead':
      return isExcludedFromPipeline(account)
    case 'lapse':
    case 'cross':
    case 'repeat':
    case 'cold':
      return account.action === filter && !isExcludedFromPipeline(account)
  }
}

// Events and Licensing are separate business lines that must never be
// blended into one pipeline view — a company can have a live deal on one
// line and be dead on the other (see Michelin), so each line gets its own
// scoped metrics, filters, and export.
export function AccountsView({ line, title }: { line: 'Event' | 'Licensing'; title: string }) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filter, setFilter] = useState<AccountFilter>('lapse')

  useEffect(() => {
    accountRepo.listAccounts().then(setAccounts)
  }, [])

  const lineAccounts = useMemo(() => accounts.filter((a) => a.line === line), [accounts, line])

  const filtered = useMemo(
    () =>
      lineAccounts
        .filter((a) => matchesFilter(a, filter))
        .sort((a, b) => b.rev2025 + b.rev2026 - (a.rev2025 + a.rev2026)),
    [lineAccounts, filter],
  )

  const delta = yoyDelta(lineAccounts)

  const handleExport = () => {
    const csv = accountsToCsv(filtered)
    downloadCsv(`${line.toLowerCase()}-${filter}.csv`, csv)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Revenue at risk" value={formatCurrency(revenueAtRisk(lineAccounts))} tone="red" />
        <MetricCard label="2026 booked" value={formatCurrency(booked2026(lineAccounts))} />
        <MetricCard label="Accounts to action" value={String(accountsToAction(lineAccounts))} />
        <MetricCard
          label="YoY delta"
          value={formatDelta(delta)}
          tone={delta < 0 ? 'red' : delta > 0 ? 'green' : 'neutral'}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs active={filter} onChange={setFilter} />
        <button
          type="button"
          onClick={handleExport}
          className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded border border-neutral-800">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">No accounts in this view.</div>
        ) : (
          filtered.map((account) => <AccountRow key={account.id} account={account} />)
        )}
      </div>
    </div>
  )
}
