import {
  CAPITAL_SIGNALS,
  EXCLUSION_OPTIONS,
  VERTICAL_OPTIONS,
  type CapitalSignal,
  type Territory,
} from '../config'
import type { EventLead, IpLead } from '../types'

export type EventLeadBriefInputs = {
  territory: Territory
  verticalIds: Set<string>
  exclusionIds: Set<string>
  capital: CapitalSignal
  /** Names of real, currently-paying event accounts to benchmark against — pulled from live data, not hardcoded. */
  benchmarkAccounts: string[]
  existingLeads: EventLead[]
}

/**
 * New event-sponsorship prospects, not existing accounts (see EventsView for
 * those). Benchmarks against the current top-paying Event accounts so the
 * comparison stays accurate as the pipeline changes, instead of hardcoding
 * examples that go stale.
 */
export function buildEventLeadBrief(inputs: EventLeadBriefInputs): string {
  const verticals = VERTICAL_OPTIONS.filter((v) => inputs.verticalIds.has(v.id))
    .map((v) => v.label)
    .join(', ')

  const exclusions = EXCLUSION_OPTIONS.filter((e) => inputs.exclusionIds.has(e.id))
    .map((e) => e.label)
    .join('; ')

  const capitalLabel =
    CAPITAL_SIGNALS.find((c) => c.id === inputs.capital)?.label ?? inputs.capital

  const benchmarks = inputs.benchmarkAccounts.slice(0, 4).join(', ')
  const known = inputs.existingLeads
    .slice(0, 10)
    .map((l) => l.companyName)
    .join(', ')

  return `Find 20 new event-sponsorship prospects for Pudgy Penguins Asia.
Territory: ${inputs.territory}.
Verticals: ${verticals || 'none selected'}.
Capital requirement: ${capitalLabel}.
Hard exclusions: ${exclusions || 'none'}.
${benchmarks ? `Benchmark against our current top-paying event sponsors: ${benchmarks} — real accounts already paying for Pudgy event presence, not hypothetical fits.` : ''}
${known ? `Already tracked, don't repeat: ${known}.` : ''}
Return exactly 20 companies, one per line, pipe-separated in this exact
order and nothing else — no numbering, no headers, no markdown table, no
extra commentary before or after the list:
Company name | Vertical | Capital or revenue signal (with date) | Evidence (source and date)`
}

export type IpLeadBriefInputs = {
  territory: Territory
  licensedIp?: string
  existingLeads: IpLead[]
}

/**
 * A company already paying to license someone else's characters (Sanrio,
 * Disney, Pokemon...) has demonstrated it will pay for exactly the thing
 * Pudgy sells, which makes it a warmer prospect than a cold outbound lead.
 * This brief targets that specific signal instead of the general criteria
 * in buildBrief.
 */
export function buildIpLeadBrief(inputs: IpLeadBriefInputs): string {
  const ipFocus = inputs.licensedIp?.trim() || 'Sanrio, Disney, Pokemon, or any other major character IP'
  const known = inputs.existingLeads
    .slice(0, 10)
    .map((l) => `${l.companyName} (${l.licensedIp})`)
    .join(', ')

  return `Find 20 companies in ${inputs.territory} that currently hold a paid character
licensing deal with ${ipFocus} for retail products, packaging, or in-store
promotions — not companies that own their own competing character IP.
Already paying to license someone else's characters is the target signal:
it proves budget and appetite for exactly what Pudgy Penguins sells.
${known ? `Already tracked, don't repeat: ${known}.` : ''}
Return exactly 20 companies, one per line, pipe-separated in this exact
order and nothing else — no numbering, no headers, no markdown table, no
extra commentary before or after the list:
Company name | Licensed IP | Vertical | Evidence (source and date)`
}
