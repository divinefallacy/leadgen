// Tunable constants for the app. Change here, not in components.

export const URGENT_THRESHOLD = 40000

// Licensing goal: at least one deal closed every month, regardless of
// whether that month has a headline event. Events revenue is expected to
// concentrate in the big-conference months instead — every other month is
// licensing's to carry.
export const LICENSING_MONTHLY_GOAL = 1

// Known headline conferences worth planning Events focus around — seeds the
// calendar's event-tag input. Freeform entry is still allowed.
export const KNOWN_BIG_EVENTS: string[] = [
  'Token2049',
  'KBW (Korea Blockchain Week)',
  'Solana Breakpoint',
  'WebX',
  'MYBW',
  'SEABW',
  'Consensus',
  'Coinfest',
]

export type RevenueLine = 'Licensing' | 'Event sponsorship' | 'Both'

export const REVENUE_LINES: RevenueLine[] = ['Licensing', 'Event sponsorship', 'Both']

export type Territory = 'Southeast Asia' | 'Korea and Japan' | 'Greater China' | 'Wider APAC'

export const TERRITORIES: Territory[] = [
  'Southeast Asia',
  'Korea and Japan',
  'Greater China',
  'Wider APAC',
]

export type VerticalOption = {
  id: string
  label: string
  defaultOn: boolean
}

export const VERTICAL_OPTIONS: VerticalOption[] = [
  { id: 'toys-collectibles', label: 'toys and collectibles', defaultOn: true },
  { id: 'consumer-robotics', label: 'consumer robotics and devices', defaultOn: true },
  { id: 'fnb-qsr', label: 'F&B and QSR chains', defaultOn: true },
  { id: 'apparel-lifestyle', label: 'apparel and lifestyle retail', defaultOn: true },
  { id: 'consumer-electronics', label: 'consumer electronics', defaultOn: true },
  { id: 'mobile-games', label: 'mobile games (non-crypto)', defaultOn: true },
  { id: 'beauty-personal-care', label: 'beauty and personal care', defaultOn: false },
  { id: 'theme-parks', label: 'theme parks and attractions', defaultOn: false },
  { id: 'convenience-grocery', label: 'convenience and grocery', defaultOn: false },
  { id: 'telco-fintech', label: 'telco and consumer fintech', defaultOn: false },
  { id: 'stationery-gifting', label: 'stationery and gifting', defaultOn: false },
  { id: 'home-kitchenware', label: 'home and kitchenware', defaultOn: false },
]

export type ExclusionOption = {
  id: string
  label: string
  defaultOn: boolean
}

export const EXCLUSION_OPTIONS: ExclusionOption[] = [
  {
    id: 'competing-mascot',
    label: 'owns a competing character or mascot franchise',
    defaultOn: true,
  },
  { id: 'cards-payments', label: 'cards and payments (exclusive to KAST)', defaultOn: true },
  { id: 'already-crm', label: 'already in the CRM at any stage', defaultOn: true },
  { id: 'crypto-exchanges', label: 'crypto-native exchanges and DEXs', defaultOn: true },
  {
    id: 'pre-revenue',
    label: 'pre-revenue or no disclosed funding',
    defaultOn: true,
  },
  {
    id: 'nft-only',
    label: 'NFT-only projects with no physical product',
    defaultOn: true,
  },
]

export type CapitalSignal = 'any' | 'raised_or_revenue_18mo' | 'raised_20m_12mo'

export const CAPITAL_SIGNALS: { id: CapitalSignal; label: string }[] = [
  { id: 'any', label: 'any' },
  {
    id: 'raised_or_revenue_18mo',
    label: 'raised or disclosed revenue in last 18 months',
  },
  { id: 'raised_20m_12mo', label: '$20M+ in last 12 months' },
]

export const DEFAULT_CAPITAL_SIGNAL: CapitalSignal = 'raised_or_revenue_18mo'

// Common character/IP licensors worth searching against — a company already
// paying one of these for a character license is a warmer Pudgy prospect
// than a cold outbound target. Freeform entry is still allowed; this just
// seeds the datalist.
export const COMMON_LICENSED_IPS: string[] = [
  'Sanrio (Hello Kitty)',
  'Disney',
  'The Pokemon Company',
  'Line Friends',
  'Kakao Friends',
  'Warner Bros. Discovery',
  'Universal',
  'Sesame Workshop',
  'Mattel',
  'Hasbro',
  'San-X (Rilakkuma)',
  'Moomin Characters',
]
