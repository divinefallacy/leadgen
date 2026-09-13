import { URGENT_THRESHOLD } from '../config'
import type { Account, Line } from '../types'
import { booked2026, isUrgent, pipelineAccounts, topAccountsByRevenue2026 } from './metrics'
import { formatCurrency } from './format'

export type SuggestionPriority = 'high' | 'medium' | 'low'

export type Suggestion = {
  id: string
  priority: SuggestionPriority
  line: Line
  title: string
  detail: string
  accountNames: string[]
}

const PRIORITY_RANK: Record<SuggestionPriority, number> = { high: 0, medium: 1, low: 2 }

function lineLabel(line: Line): string {
  return line === 'Event' ? 'Events' : line === 'Licensing' ? 'IP Licensing' : line
}

/** Lapsed accounts big enough to hurt — reach out before the relationship goes fully cold. */
function urgentLapsedSuggestion(accounts: Account[], line: Line): Suggestion | null {
  const urgent = pipelineAccounts(accounts)
    .filter((a) => isUrgent(a))
    .sort((a, b) => b.rev2025 - a.rev2025)
  if (urgent.length === 0) return null

  const total = urgent.reduce((sum, a) => sum + a.rev2025, 0)
  return {
    id: `urgent-lapsed-${line}`,
    priority: 'high',
    line,
    title: `${urgent.length} urgent lapsed account${urgent.length > 1 ? 's' : ''} in ${lineLabel(line)}`,
    detail: `${formatCurrency(total)} at risk — each had ${formatCurrency(URGENT_THRESHOLD)}+ in 2025 with nothing booked for 2026. Re-engage before the relationship goes cold.`,
    accountNames: urgent.map((a) => a.name),
  }
}

/** Accounts where the source data disagrees with itself and needs a human to reconcile. */
function dataIssueSuggestion(accounts: Account[], line: Line): Suggestion | null {
  const flagged = accounts.filter((a) => a.dataIssue)
  if (flagged.length === 0) return null

  return {
    id: `data-issue-${line}`,
    priority: 'high',
    line,
    title: `${flagged.length} account${flagged.length > 1 ? 's' : ''} with unresolved data conflicts in ${lineLabel(line)}`,
    detail: 'Source data disagrees with itself on these — confirm the real numbers with finance/BD before reporting on them.',
    accountNames: flagged.map((a) => a.name),
  }
}

const DEAD_STAGE_KEYWORDS = ['not qualified', 'disqualified', 'not responsive', 'rejected']

function looksDisqualified(stage: string): boolean {
  const lower = stage.toLowerCase()
  return DEAD_STAGE_KEYWORDS.some((k) => lower.includes(k))
}

/** Leads still in an open pipeline stage — not disqualified — but with zero revenue booked. */
function stalledLeadsSuggestion(accounts: Account[], line: Line): Suggestion | null {
  const stalled = pipelineAccounts(accounts).filter(
    (a) => a.action === 'cold' && a.rev2025 === 0 && a.rev2026 === 0 && !looksDisqualified(a.stage),
  )
  if (stalled.length === 0) return null

  return {
    id: `stalled-${line}`,
    priority: 'medium',
    line,
    title: `${stalled.length} open lead${stalled.length > 1 ? 's' : ''} in ${lineLabel(line)} with no revenue yet`,
    detail: 'Still sitting in an active pipeline stage with nothing booked — worth a follow-up push, or a clear-eyed disqualify to stop tracking them.',
    accountNames: stalled.map((a) => a.name),
  }
}

/** Newly booked accounts with no 2025 baseline — the next lapse risk if not locked in. */
function crossSellSuggestion(accounts: Account[], line: Line): Suggestion | null {
  const fresh = pipelineAccounts(accounts)
    .filter((a) => a.action === 'cross')
    .sort((a, b) => b.rev2026 - a.rev2026)
  if (fresh.length === 0) return null

  const total = fresh.reduce((sum, a) => sum + a.rev2026, 0)
  return {
    id: `cross-${line}`,
    priority: 'medium',
    line,
    title: `${fresh.length} newly booked account${fresh.length > 1 ? 's' : ''} in ${lineLabel(line)} with no 2025 baseline`,
    detail: `${formatCurrency(total)} booked for 2026 from a standing start — lock in renewal terms now, before these become next year's lapse risk.`,
    accountNames: fresh.map((a) => a.name),
  }
}

const CONCENTRATION_THRESHOLD = 0.3

/** A single account carrying an outsized share of a line's booked revenue. */
function concentrationRiskSuggestion(accounts: Account[], line: Line): Suggestion | null {
  const total = booked2026(accounts)
  const contributors = topAccountsByRevenue2026(accounts, 2)
  // With only one revenue-contributing account, there's nothing to
  // diversify against yet — that's "one deal," not a concentration risk.
  if (contributors.length < 2 || total <= 0) return null

  const [top] = contributors
  const share = top.value / total
  if (share < CONCENTRATION_THRESHOLD) return null

  return {
    id: `concentration-${line}`,
    priority: 'low',
    line,
    title: `${top.name} is ${Math.round(share * 100)}% of ${lineLabel(line)}'s 2026 revenue`,
    detail: 'A single account carrying this much of the line is a concentration risk — worth diversifying the pipeline so one loss doesn\'t swing the whole line.',
    accountNames: [top.name],
  }
}

const RULES = [
  urgentLapsedSuggestion,
  dataIssueSuggestion,
  crossSellSuggestion,
  stalledLeadsSuggestion,
  concentrationRiskSuggestion,
]

/**
 * Rule-based next-step suggestions, computed per line and never blended
 * across them — Events and IP Licensing are separate businesses, so a
 * suggestion always names which one it's about.
 */
export function buildSuggestions(accounts: Account[]): Suggestion[] {
  const lines: Line[] = ['Event', 'Licensing']
  const suggestions = lines.flatMap((line) => {
    const lineAccounts = accounts.filter((a) => a.line === line)
    return RULES.map((rule) => rule(lineAccounts, line)).filter((s): s is Suggestion => s !== null)
  })
  return suggestions.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
}
