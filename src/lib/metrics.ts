import { URGENT_THRESHOLD } from '../config'
import type { Account } from '../types'

/** rev2026 - rev2025 for a single account. */
export function getDelta(account: Account): number {
  return account.rev2026 - account.rev2025
}

/** A lapsed account big enough in 2025 that its loss deserves a red flag. */
export function isUrgent(account: Account, threshold = URGENT_THRESHOLD): boolean {
  return account.action === 'lapse' && account.rev2025 >= threshold
}

/**
 * Wound-down counterparties and spend-out deals don't reflect win/loss
 * performance — a shut-down division isn't a rejection, and money we pay
 * out isn't pipeline. Every pipeline health total excludes them.
 */
export function isExcludedFromPipeline(account: Account): boolean {
  return account.counterpartyStatus === 'wound_down' || account.dealDirection === 'spend_out'
}

export function pipelineAccounts(accounts: Account[]): Account[] {
  return accounts.filter((a) => !isExcludedFromPipeline(a))
}

/** Sum of 2025 revenue sitting in lapsed accounts, excluding dead counterparties/spend-out. */
export function revenueAtRisk(accounts: Account[]): number {
  return pipelineAccounts(accounts)
    .filter((a) => a.action === 'lapse')
    .reduce((sum, a) => sum + a.rev2025, 0)
}

/** Total 2025 revenue across the pipeline, excluding dead counterparties/spend-out. */
export function totalRevenue2025(accounts: Account[]): number {
  return pipelineAccounts(accounts).reduce((sum, a) => sum + a.rev2025, 0)
}

/** Total 2026 revenue booked so far, excluding dead counterparties/spend-out. */
export function booked2026(accounts: Account[]): number {
  return pipelineAccounts(accounts).reduce((sum, a) => sum + a.rev2026, 0)
}

/** Accounts with a live, non-cold action to take: lapse, cross-sell, or repeat. */
export function accountsToAction(accounts: Account[]): number {
  return pipelineAccounts(accounts).filter((a) =>
    a.action === 'lapse' || a.action === 'cross' || a.action === 'repeat'
  ).length
}

/** Aggregate year-on-year delta across the live, revenue-in pipeline. */
export function yoyDelta(accounts: Account[]): number {
  const live = pipelineAccounts(accounts)
  const total2025 = live.reduce((sum, a) => sum + a.rev2025, 0)
  const total2026 = live.reduce((sum, a) => sum + a.rev2026, 0)
  return total2026 - total2025
}

export type NamedValue = { name: string; value: number }

/** Top accounts by 2026 revenue, excluding dead counterparties/spend-out and zero-revenue accounts. */
export function topAccountsByRevenue2026(accounts: Account[], limit = 8): NamedValue[] {
  return pipelineAccounts(accounts)
    .filter((a) => a.rev2026 > 0)
    .sort((a, b) => b.rev2026 - a.rev2026)
    .slice(0, limit)
    .map((a) => ({ name: a.name, value: a.rev2026 }))
}

export type MonthlyValue = { month: string; value: number }

/**
 * Deal value (rev2025 + rev2026) bucketed by the month of each account's
 * keyDate (contract signed / start date), chronological. Accounts with no
 * keyDate — most leads and not-yet-signed rows — are excluded rather than
 * bucketed as "unknown", since a monthly trend is about when deals landed.
 */
export function monthlyDealValue(accounts: Account[]): MonthlyValue[] {
  const byMonth = new Map<string, number>()
  for (const a of pipelineAccounts(accounts)) {
    if (!a.keyDate) continue
    const bucket = a.keyDate.slice(0, 7) // YYYY-MM
    byMonth.set(bucket, (byMonth.get(bucket) ?? 0) + a.rev2025 + a.rev2026)
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }))
}

/** Accounts whose keyDate falls in the given 'YYYY-MM' month, excluding dead counterparties/spend-out. */
export function dealsInMonth(accounts: Account[], month: string): Account[] {
  return pipelineAccounts(accounts).filter((a) => a.keyDate?.slice(0, 7) === month)
}

/** Total deal value (rev2025 + rev2026) across a set of accounts — the actual-revenue side of a plan-vs-actual comparison. */
export function dealValue(accounts: Account[]): number {
  return accounts.reduce((sum, a) => sum + a.rev2025 + a.rev2026, 0)
}
