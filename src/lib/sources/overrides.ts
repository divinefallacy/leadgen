import type { CounterpartyStatus } from '../../types'

/**
 * Manual overrides keyed by partner name, applied after joining.
 *
 * No source of record — not the BD board, not Partnerships & Licensing, not
 * the P&L sheet — reports that a counterparty's division shut down. A
 * company going to zero and a company that stopped buying look identical in
 * every upstream table, so this has to be maintained by hand. Anything
 * listed here as 'wound_down' must never be treated as a lost deal.
 */
export const counterpartyStatusOverrides: Record<string, CounterpartyStatus> = {
  '1Max': 'wound_down', // company closed
  BitMart: 'wound_down', // company closed
  'Moon Ring (Inactive)': 'wound_down', // marked inactive in the sponsorship database
  // Michelin was flagged wound_down from event-sponsorship silence alone; the
  // licensing CSV shows an active, revenue-producing contract, so it stays
  // live here (see the account's dataIssue for the conflicting read).
}
