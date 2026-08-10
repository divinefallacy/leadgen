// Raw shapes as they exist in each upstream source, before joining into an
// Account. These deliberately mirror the source schemas rather than our
// internal model — mapping/cleanup happens in join.ts.

/** A row from the Notion "BD board" database. */
export type BdBoardRecord = {
  notionPageId: string
  partnerName: string
  vertical: string
  stage: string
  owner?: string
}

/** A row from the Notion "Partnerships & Licensing" database. */
export type PartnershipsLicensingRecord = {
  notionPageId: string
  partnerName: string
  line: 'Licensing' | 'Event' | 'Both'
  stage: string
  contractValue?: number
}

/** A row from the Google Sheets P&L. */
export type PnlRow = {
  partnerName: string
  rev2025: number
  rev2026: number
  isSpendOut?: boolean
}
