import {
  CAPITAL_SIGNALS,
  EXCLUSION_OPTIONS,
  VERTICAL_OPTIONS,
  type CapitalSignal,
  type RevenueLine,
  type Territory,
} from '../config'
import type { IpLead } from '../types'

export type BriefInputs = {
  line: RevenueLine
  territory: Territory
  verticalIds: Set<string>
  exclusionIds: Set<string>
  capital: CapitalSignal
}

export function buildBrief(inputs: BriefInputs): string {
  const verticals = VERTICAL_OPTIONS.filter((v) => inputs.verticalIds.has(v.id))
    .map((v) => v.label)
    .join(', ')

  const exclusions = EXCLUSION_OPTIONS.filter((e) => inputs.exclusionIds.has(e.id))
    .map((e) => e.label)
    .join('; ')

  const capitalLabel =
    CAPITAL_SIGNALS.find((c) => c.id === inputs.capital)?.label ?? inputs.capital

  return `Search and generate 20 new leads for Pudgy Penguins Asia.
Revenue line: ${inputs.line}. Territory: ${inputs.territory}.
Verticals: ${verticals || 'none selected'}.
Capital requirement: ${capitalLabel}.
Hard exclusions: ${exclusions || 'none'}.
Benchmark against Suplay, Nexpace, Rice Robotics and DYLI — the accounts that
actually paid and repeated. All have physical or retail distribution, none owns a
competing character franchise, only one is crypto-native.
For each lead: company name, vertical, why they fit, capital or revenue signal
with date, retail/distribution footprint, and the specific Pudgy product format
to pitch. Flag any funding figure you could not verify.`
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

  return `Find companies in ${inputs.territory} that currently hold a paid character
licensing deal with ${ipFocus} for retail products, packaging, or in-store
promotions — not companies that own their own competing character IP.
Already paying to license someone else's characters is the target signal:
it proves budget and appetite for exactly what Pudgy Penguins sells.
${known ? `Already tracked, don't repeat: ${known}.` : ''}
For each company: name, which IP they license, vertical, evidence of the
existing license (retailer listing, press release, packaging photo) with a
date or source, and why a Pudgy license fits alongside or after it.`
}
