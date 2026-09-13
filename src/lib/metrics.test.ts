import { describe, expect, it } from 'vitest'
import type { Account } from '../types'
import {
  accountsToAction,
  booked2026,
  dealsInMonth,
  getDelta,
  isExcludedFromPipeline,
  isUrgent,
  monthlyDealValue,
  pipelineAccounts,
  revenueAtRisk,
  topAccountsByRevenue2026,
  totalRevenue2025,
  yoyDelta,
} from './metrics'

function makeAccount(overrides: Partial<Account>): Account {
  return {
    id: 'test',
    name: 'Test Co',
    vertical: 'Test',
    line: 'Event',
    stage: 'Lead',
    counterpartyStatus: 'live',
    dealDirection: 'revenue_in',
    rev2025: 0,
    rev2026: 0,
    action: 'cold',
    note: '',
    ...overrides,
  }
}

describe('getDelta', () => {
  it('computes rev2026 minus rev2025', () => {
    expect(getDelta(makeAccount({ rev2025: 100, rev2026: 150 }))).toBe(50)
    expect(getDelta(makeAccount({ rev2025: 200000, rev2026: 0 }))).toBe(-200000)
  })
})

describe('isUrgent', () => {
  it('flags lapsed accounts at or above the threshold', () => {
    expect(isUrgent(makeAccount({ action: 'lapse', rev2025: 40000 }))).toBe(true)
    expect(isUrgent(makeAccount({ action: 'lapse', rev2025: 200000 }))).toBe(true)
  })

  it('does not flag lapsed accounts below the threshold', () => {
    expect(isUrgent(makeAccount({ action: 'lapse', rev2025: 39999 }))).toBe(false)
  })

  it('does not flag non-lapsed accounts regardless of revenue', () => {
    expect(isUrgent(makeAccount({ action: 'repeat', rev2025: 200000 }))).toBe(false)
    expect(isUrgent(makeAccount({ action: 'cross', rev2025: 200000 }))).toBe(false)
    expect(isUrgent(makeAccount({ action: 'cold', rev2025: 200000 }))).toBe(false)
  })

  it('respects a custom threshold', () => {
    expect(isUrgent(makeAccount({ action: 'lapse', rev2025: 10000 }), 5000)).toBe(true)
    expect(isUrgent(makeAccount({ action: 'lapse', rev2025: 4000 }), 5000)).toBe(false)
  })
})

describe('isExcludedFromPipeline', () => {
  it('excludes wound-down counterparties', () => {
    expect(isExcludedFromPipeline(makeAccount({ counterpartyStatus: 'wound_down' }))).toBe(true)
  })

  it('excludes spend-out deals', () => {
    expect(isExcludedFromPipeline(makeAccount({ dealDirection: 'spend_out' }))).toBe(true)
  })

  it('includes live, revenue-in accounts', () => {
    expect(
      isExcludedFromPipeline(
        makeAccount({ counterpartyStatus: 'live', dealDirection: 'revenue_in' }),
      ),
    ).toBe(false)
  })
})

describe('pipelineAccounts', () => {
  it('filters out wound-down and spend-out accounts', () => {
    const accounts = [
      makeAccount({ id: 'a', counterpartyStatus: 'live', dealDirection: 'revenue_in' }),
      makeAccount({ id: 'b', counterpartyStatus: 'wound_down' }),
      makeAccount({ id: 'c', dealDirection: 'spend_out' }),
    ]
    expect(pipelineAccounts(accounts).map((a) => a.id)).toEqual(['a'])
  })
})

describe('revenueAtRisk', () => {
  it('sums 2025 revenue across lapsed accounts', () => {
    const accounts = [
      makeAccount({ action: 'lapse', rev2025: 200000 }),
      makeAccount({ action: 'lapse', rev2025: 180000 }),
      makeAccount({ action: 'repeat', rev2025: 100000 }),
    ]
    expect(revenueAtRisk(accounts)).toBe(380000)
  })

  it('excludes wound-down counterparties even if marked lapse', () => {
    const accounts = [
      makeAccount({ action: 'lapse', rev2025: 5000, counterpartyStatus: 'wound_down' }),
      makeAccount({ action: 'lapse', rev2025: 50000 }),
    ]
    expect(revenueAtRisk(accounts)).toBe(50000)
  })

  it('excludes spend-out deals even if marked lapse', () => {
    const accounts = [
      makeAccount({ action: 'lapse', rev2025: 10000, dealDirection: 'spend_out' }),
      makeAccount({ action: 'lapse', rev2025: 50000 }),
    ]
    expect(revenueAtRisk(accounts)).toBe(50000)
  })
})

describe('totalRevenue2025', () => {
  it('sums 2025 revenue across the live pipeline', () => {
    const accounts = [
      makeAccount({ rev2025: 100000 }),
      makeAccount({ rev2025: 36912 }),
      makeAccount({ rev2025: 5000, counterpartyStatus: 'wound_down' }),
      makeAccount({ rev2025: 9000, dealDirection: 'spend_out' }),
    ]
    expect(totalRevenue2025(accounts)).toBe(136912)
  })
})

describe('booked2026', () => {
  it('sums 2026 revenue excluding wound-down and spend-out', () => {
    const accounts = [
      makeAccount({ rev2026: 100000 }),
      makeAccount({ rev2026: 36912 }),
      makeAccount({ rev2026: 5000, counterpartyStatus: 'wound_down' }),
      makeAccount({ rev2026: 9000, dealDirection: 'spend_out' }),
    ]
    expect(booked2026(accounts)).toBe(136912)
  })
})

describe('accountsToAction', () => {
  it('counts lapse, cross, and repeat but not cold', () => {
    const accounts = [
      makeAccount({ action: 'lapse' }),
      makeAccount({ action: 'cross' }),
      makeAccount({ action: 'repeat' }),
      makeAccount({ action: 'cold' }),
    ]
    expect(accountsToAction(accounts)).toBe(3)
  })

  it('excludes wound-down and spend-out from the count', () => {
    const accounts = [
      makeAccount({ action: 'lapse', counterpartyStatus: 'wound_down' }),
      makeAccount({ action: 'cross', dealDirection: 'spend_out' }),
      makeAccount({ action: 'repeat' }),
    ]
    expect(accountsToAction(accounts)).toBe(1)
  })
})

describe('yoyDelta', () => {
  it('nets 2026 against 2025 across the live pipeline', () => {
    const accounts = [
      makeAccount({ rev2025: 200000, rev2026: 0 }),
      makeAccount({ rev2025: 0, rev2026: 100000 }),
    ]
    expect(yoyDelta(accounts)).toBe(-100000)
  })

  it('excludes wound-down and spend-out accounts from the totals', () => {
    const accounts = [
      makeAccount({ rev2025: 5000, rev2026: 0, counterpartyStatus: 'wound_down' }),
      makeAccount({ rev2025: 0, rev2026: 9000, dealDirection: 'spend_out' }),
      makeAccount({ rev2025: 100, rev2026: 150 }),
    ]
    expect(yoyDelta(accounts)).toBe(50)
  })
})

describe('topAccountsByRevenue2026', () => {
  it('ranks accounts by rev2026 descending and drops zero-revenue accounts', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'A', rev2026: 5000 }),
      makeAccount({ id: 'b', name: 'B', rev2026: 20000 }),
      makeAccount({ id: 'c', name: 'C', rev2026: 0 }),
    ]
    expect(topAccountsByRevenue2026(accounts)).toEqual([
      { name: 'B', value: 20000 },
      { name: 'A', value: 5000 },
    ])
  })

  it('excludes wound-down and spend-out accounts, and respects the limit', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'A', rev2026: 5000, counterpartyStatus: 'wound_down' }),
      makeAccount({ id: 'b', name: 'B', rev2026: 20000, dealDirection: 'spend_out' }),
      makeAccount({ id: 'c', name: 'C', rev2026: 3000 }),
      makeAccount({ id: 'd', name: 'D', rev2026: 4000 }),
    ]
    expect(topAccountsByRevenue2026(accounts, 1)).toEqual([{ name: 'D', value: 4000 }])
  })
})

describe('monthlyDealValue', () => {
  it('buckets rev2025 + rev2026 by the month of keyDate, sorted chronologically', () => {
    const accounts = [
      makeAccount({ id: 'a', rev2025: 0, rev2026: 8000, keyDate: '2026-06-30' }),
      makeAccount({ id: 'b', rev2025: 2100, rev2026: 0, keyDate: '2026-01-08' }),
      makeAccount({ id: 'c', rev2025: 0, rev2026: 2000, keyDate: '2026-06-15' }),
    ]
    expect(monthlyDealValue(accounts)).toEqual([
      { month: '2026-01', value: 2100 },
      { month: '2026-06', value: 10000 },
    ])
  })

  it('excludes accounts with no keyDate and dead/spend-out accounts', () => {
    const accounts = [
      makeAccount({ id: 'a', rev2026: 5000 }),
      makeAccount({ id: 'b', rev2026: 5000, keyDate: '2026-01-08', counterpartyStatus: 'wound_down' }),
      makeAccount({ id: 'c', rev2026: 5000, keyDate: '2026-01-08', dealDirection: 'spend_out' }),
    ]
    expect(monthlyDealValue(accounts)).toEqual([])
  })
})

describe('dealsInMonth', () => {
  it('returns only accounts whose keyDate falls in the given month', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'A', keyDate: '2027-03-15' }),
      makeAccount({ id: 'b', name: 'B', keyDate: '2027-04-01' }),
      makeAccount({ id: 'c', name: 'C', keyDate: '2027-03-02' }),
    ]
    expect(dealsInMonth(accounts, '2027-03').map((a) => a.name)).toEqual(['A', 'C'])
  })

  it('excludes accounts with no keyDate and dead/spend-out accounts', () => {
    const accounts = [
      makeAccount({ id: 'a', keyDate: '2027-03-15' }),
      makeAccount({ id: 'b', keyDate: '2027-03-15', counterpartyStatus: 'wound_down' }),
      makeAccount({ id: 'c' }),
    ]
    expect(dealsInMonth(accounts, '2027-03')).toHaveLength(1)
  })
})
