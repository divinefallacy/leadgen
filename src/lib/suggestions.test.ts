import { describe, expect, it } from 'vitest'
import type { Account } from '../types'
import { buildSuggestions } from './suggestions'

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

describe('buildSuggestions', () => {
  it('flags an urgent lapsed account as high priority, scoped to its line', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'BigCo', line: 'Event', action: 'lapse', rev2025: 200000, rev2026: 0 }),
    ]
    const suggestions = buildSuggestions(accounts)
    const urgent = suggestions.find((s) => s.id === 'urgent-lapsed-Event')
    expect(urgent).toBeDefined()
    expect(urgent?.priority).toBe('high')
    expect(urgent?.accountNames).toEqual(['BigCo'])
  })

  it('does not flag a lapsed account below the urgent threshold', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'SmallCo', line: 'Event', action: 'lapse', rev2025: 5000, rev2026: 0 }),
    ]
    expect(buildSuggestions(accounts).find((s) => s.id === 'urgent-lapsed-Event')).toBeUndefined()
  })

  it('flags accounts with a dataIssue', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'Suplay', line: 'Licensing', dataIssue: 'conflicting revenue columns' }),
    ]
    const suggestion = buildSuggestions(accounts).find((s) => s.id === 'data-issue-Licensing')
    expect(suggestion?.accountNames).toEqual(['Suplay'])
  })

  it('flags cross-sell accounts with no 2025 baseline', () => {
    const accounts = [makeAccount({ id: 'a', name: 'FreshCo', line: 'Licensing', action: 'cross', rev2026: 20000 })]
    const suggestion = buildSuggestions(accounts).find((s) => s.id === 'cross-Licensing')
    expect(suggestion?.detail).toContain('$20,000')
  })

  it('flags a stalled open lead but not a disqualified one', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'OpenLead', line: 'Event', action: 'cold', stage: 'Proposal Follow-Up' }),
      makeAccount({ id: 'b', name: 'DeadLead', line: 'Event', action: 'cold', stage: 'Not Qualified' }),
    ]
    const suggestion = buildSuggestions(accounts).find((s) => s.id === 'stalled-Event')
    expect(suggestion?.accountNames).toEqual(['OpenLead'])
  })

  it('excludes wound-down and spend-out accounts from every rule', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'Dead', line: 'Event', action: 'lapse', rev2025: 200000, counterpartyStatus: 'wound_down' }),
      makeAccount({ id: 'b', name: 'SpendOut', line: 'Event', action: 'lapse', rev2025: 200000, dealDirection: 'spend_out' }),
    ]
    expect(buildSuggestions(accounts).find((s) => s.id === 'urgent-lapsed-Event')).toBeUndefined()
  })

  it('flags revenue concentration risk when one account dominates a line', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'Whale', line: 'Event', action: 'cross', rev2026: 90000 }),
      makeAccount({ id: 'b', name: 'Minnow', line: 'Event', action: 'cross', rev2026: 5000 }),
    ]
    const suggestion = buildSuggestions(accounts).find((s) => s.id === 'concentration-Event')
    expect(suggestion?.title).toContain('Whale')
  })

  it('sorts suggestions by priority: high before medium before low', () => {
    const accounts = [
      makeAccount({ id: 'a', name: 'Whale', line: 'Event', action: 'cross', rev2026: 90000 }),
      makeAccount({ id: 'b', name: 'Minnow', line: 'Event', action: 'cross', rev2026: 5000 }),
      makeAccount({ id: 'c', name: 'OpenLead', line: 'Event', action: 'cold', stage: 'Lead' }),
      makeAccount({ id: 'd', name: 'BigLapse', line: 'Event', action: 'lapse', rev2025: 200000 }),
    ]
    const priorities = buildSuggestions(accounts).map((s) => s.priority)
    expect(priorities).toEqual(['high', 'medium', 'medium', 'low'])
  })

  it('returns nothing for a clean, unremarkable account', () => {
    const accounts = [makeAccount({ id: 'a', name: 'Quiet', line: 'Event', action: 'repeat', rev2025: 1000, rev2026: 1000 })]
    expect(buildSuggestions(accounts)).toEqual([])
  })
})
