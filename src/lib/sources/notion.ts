import type { BdBoardRecord, PartnershipsLicensingRecord } from './types'

/**
 * Adapter over the two Notion databases BizOps actually tracks partners in.
 * Implement against the Notion API when we're ready to swap off seed data —
 * nothing in the app should depend on Notion's request/response shapes
 * outside this file.
 */
export interface NotionAdapter {
  fetchBdBoard(): Promise<BdBoardRecord[]>
  fetchPartnershipsLicensing(): Promise<PartnershipsLicensingRecord[]>
}
