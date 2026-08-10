import type { Account, Action } from '../../types'
import type { BdBoardRecord, PartnershipsLicensingRecord, PnlRow } from './types'

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Best-effort action from bare revenue figures. None of the three sources
 * store BizOps' lapse/cross/repeat/cold judgment — it's a categorization
 * layered on top of the numbers, not read off them — so this heuristic is a
 * starting point for hand review, not a substitute for it.
 */
function inferAction(rev2025: number, rev2026: number): Action {
  if (rev2025 > 0 && rev2026 === 0) return 'lapse'
  if (rev2025 > 0 && rev2026 > 0) return 'repeat'
  if (rev2025 === 0 && rev2026 > 0) return 'cross'
  return 'cold'
}

/**
 * Joins the two Notion databases and the Sheets P&L on partner name into
 * the app's Account shape, then layers the manual counterpartyStatus
 * overrides on top (see overrides.ts — no source reports a shutdown).
 *
 * This is intentionally a straight-line join for the future Notion/Sheets
 * swap-in, not a reimplementation of the seed data's hand-curated actions
 * and notes.
 */
export function joinAccountSources(
  bdBoard: BdBoardRecord[],
  partnershipsLicensing: PartnershipsLicensingRecord[],
  pnl: PnlRow[],
  counterpartyStatusOverrides: Record<string, Account['counterpartyStatus']>,
): Account[] {
  const bdByName = new Map(bdBoard.map((r) => [normalizeName(r.partnerName), r]))
  const licensingByName = new Map(
    partnershipsLicensing.map((r) => [normalizeName(r.partnerName), r]),
  )
  const pnlByName = new Map(pnl.map((r) => [normalizeName(r.partnerName), r]))

  const allNames = new Set([...bdByName.keys(), ...licensingByName.keys(), ...pnlByName.keys()])

  return [...allNames].map((normalized) => {
    const bd = bdByName.get(normalized)
    const licensing = licensingByName.get(normalized)
    const pnlRow = pnlByName.get(normalized)

    const name = licensing?.partnerName ?? bd?.partnerName ?? pnlRow?.partnerName ?? normalized
    const stage = licensing?.stage ?? bd?.stage ?? 'Unknown'
    const dataIssue =
      bd && licensing && bd.stage !== licensing.stage
        ? `${licensing.stage} in licensing table, ${bd.stage} in BD board.`
        : undefined

    const rev2025 = pnlRow?.rev2025 ?? 0
    const rev2026 = pnlRow?.rev2026 ?? 0

    return {
      id: slugify(name),
      name,
      vertical: bd?.vertical ?? 'Unknown',
      line: licensing?.line ?? 'Event',
      stage,
      counterpartyStatus: counterpartyStatusOverrides[name] ?? 'live',
      dealDirection: pnlRow?.isSpendOut ? 'spend_out' : 'revenue_in',
      rev2025,
      rev2026,
      action: inferAction(rev2025, rev2026),
      note: '',
      dataIssue,
    }
  })
}
