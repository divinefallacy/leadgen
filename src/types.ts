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
  /** ISO date (YYYY-MM-DD) the deal was signed or started, when known — drives the monthly trend chart. */
  keyDate?: string
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

/**
 * A forward plan for one calendar month, filled in ahead of time so both
 * lines can plan the year rather than react to it. Events and Licensing are
 * planned independently per month — a month can carry both.
 */
export type MonthPlan = {
  /** 'YYYY-MM' */
  month: string
  /** Headline events being targeted this month (Token2049, KBW, ...) — presence of any marks it an Events-focus month. */
  targetEvents: string[]
  /** Free text: which licensing deal(s) this month is aimed at closing. */
  licensingTarget: string
  /** Manually confirmed once the month's licensing goal is actually hit. */
  licensingGoalMet: boolean
}
