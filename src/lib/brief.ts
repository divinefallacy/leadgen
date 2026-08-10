import {
  CAPITAL_SIGNALS,
  EXCLUSION_OPTIONS,
  VERTICAL_OPTIONS,
  type CapitalSignal,
  type RevenueLine,
  type Territory,
} from '../config'

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

  return `Search and generate 20 new leads for Pudgy Penguins APAC.
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
