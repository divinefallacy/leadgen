import type { PnlRow } from './types'

/**
 * Adapter over the Google Sheets P&L. Implement against the Sheets API when
 * we're ready to swap off seed data.
 */
export interface GoogleSheetsAdapter {
  fetchPnl(): Promise<PnlRow[]>
}
