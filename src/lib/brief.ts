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
 * A company already paying to license someone else's characters has
 * demonstrated appetite for exactly what Pudgy sells — but "already
 * licenses IP" hides two very different prospects. A company partnered
 * with Disney or Sanrio is a prestige get with real brand halo, but those
 * deals are often reciprocal or promotional rather than a straight paid
 * license — don't expect them to pay Pudgy well just because they sit next
 * to a famous name. A company paying real, disclosed fees for a smaller or
 * less iconic IP has proven the opposite: genuine budget and willingness to
 * pay, regardless of prestige. This brief asks for both, explicitly split,
 * so outreach doesn't confuse a brand-exposure play with a revenue lead.
 */
export function buildIpLeadBrief(inputs: IpLeadBriefInputs): string {
  const ipFocus = inputs.licensedIp?.trim() || 'Disney, Sanrio, Marvel, Pokemon, Hello Kitty, or another top-tier globally iconic IP'
  const known = inputs.existingLeads
    .slice(0, 10)
    .map((l) => `${l.companyName} (${l.licensedIp})`)
    .join(', ')

  return `Find 20 companies in ${inputs.territory} with a character-licensing
signal, split across two different lead types — search for both, don't
blend them into one undifferentiated list.

TIER 1 — Prestige partners (aim for 10): companies currently licensing
${ipFocus} for retail products, packaging, or in-store promotions. These
deals are usually about brand halo and reach, not big licensing fees —
note if it looks reciprocal or promotional rather than a straight paid
license. Valuable for Pudgy's own exposure even when the direct revenue
looks modest.

TIER 2 — Revenue-focused licensees (aim for 10): companies that clearly
pay real money for character licensing, even from a smaller or less
iconic IP (Line Friends, Kakao Friends, a regional mascot, etc.) —
disclosed licensing fees, frequent paid collabs, or a track record of
character-driven product lines. The signal is demonstrated willingness
and ability to pay, not brand prestige — these convert to real Pudgy
revenue faster than a prestige partner does.

Not companies that own their own competing character IP, on either tier.
Hard exclude, on either tier: shopping malls, mall/property operators,
government agencies, statutory boards, tourism boards, and any
government-affiliated association. Malls and government bodies routinely
host or display licensed characters, but the mall or agency itself rarely
has commercial budget or authority to pay for a license — the actual
payer there is usually a tenant retailer or a private event organizer, not
the venue. Only include a company that would itself sign and pay the
license.
${known ? `Already tracked, don't repeat: ${known}.` : ''}
Return exactly 20 companies, one per line, pipe-separated in this exact
order and nothing else — no numbering, no headers, no markdown table, no
extra commentary before or after the list:
Company name | Licensed IP | Vertical | Lead type (prestige or revenue) | Evidence (source and date)`
}
