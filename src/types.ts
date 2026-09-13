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

/** Shared outreach pipeline stage for every tracked lead list (IP licensees, event prospects). */
export type LeadStatus = 'new' | 'researching' | 'contacted' | 'qualified' | 'disqualified'

/**
 * Not every company licensing character IP is equally likely to pay Pudgy:
 * a top-tier globally iconic IP partnership is often reciprocal/promotional
 * (brand halo, little direct revenue), while a smaller or less iconic IP
 * deal with real disclosed fees signals genuine willingness and ability to
 * pay. Both are worth pursuing, for different reasons — tracked separately
 * so outreach doesn't treat them the same.
 */
export type IpLeadDealType = 'prestige' | 'revenue'

/**
 * A company already known to license IP from another rights holder (Sanrio,
 * Disney, Pokemon, etc). Proven willingness to pay for character licensing
 * makes these warmer than a cold prospect, so they're tracked separately
 * from the outbound search briefs.
 */
export type IpLead = {
  id: string
  companyName: string
  licensedIp: string
  vertical: string
  territory: string
  dealType: IpLeadDealType
  evidence: string
  status: LeadStatus
  dateAdded: string
}

export type NewIpLeadInput = Omit<IpLead, 'id' | 'dateAdded' | 'status'> & {
  status?: LeadStatus
}

/** A prospective new event-sponsorship account, not yet in the Events pipeline. */
export type EventLead = {
  id: string
  companyName: string
  vertical: string
  territory: string
  /** Free text: funding raised, disclosed revenue, or other capital signal, with a date. */
  capitalSignal: string
  evidence: string
  status: LeadStatus
  dateAdded: string
}

export type NewEventLeadInput = Omit<EventLead, 'id' | 'dateAdded' | 'status'> & {
  status?: LeadStatus
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
  /** Revenue goal for Events this month, in dollars. */
  eventsRevenueTarget: number
  /** Free text: which licensing deal(s) this month is aimed at closing. */
  licensingTarget: string
  /** Revenue goal for Licensing this month, in dollars. */
  licensingRevenueTarget: number
  /** Manually confirmed once the month's licensing goal is actually hit. */
  licensingGoalMet: boolean
}
