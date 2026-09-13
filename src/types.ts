export type Line = 'Licensing' | 'Event' | 'Both'

export type CounterpartyStatus = 'live' | 'wound_down'

export type DealDirection = 'revenue_in' | 'spend_out'

export type Action = 'lapse' | 'cross' | 'repeat' | 'cold'

export type Account = {
  id: string
  name: string
  vertical: string
  line: Line
  stage: string
  counterpartyStatus: CounterpartyStatus
  dealDirection: DealDirection
  rev2025: number
  rev2026: number
  action: Action
  note: string
  dataIssue?: string
}

/**
 * A company already known to license IP from another rights holder (Sanrio,
 * Disney, Pokemon, etc). Proven willingness to pay for character licensing
 * makes these warmer than a cold prospect, so they're tracked separately
 * from the outbound search briefs in ProspectView.
 */
export type IpLeadStatus = 'new' | 'researching' | 'contacted' | 'qualified' | 'disqualified'

export type IpLead = {
  id: string
  companyName: string
  licensedIp: string
  vertical: string
  territory: string
  evidence: string
  status: IpLeadStatus
  dateAdded: string
}

export type NewIpLeadInput = Omit<IpLead, 'id' | 'dateAdded' | 'status'> & {
  status?: IpLeadStatus
}
