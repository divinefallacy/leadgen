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
