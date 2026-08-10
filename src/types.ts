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
