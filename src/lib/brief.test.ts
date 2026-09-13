import { describe, expect, it } from 'vitest'
import type { IpLead } from '../types'
import { buildIpLeadBrief } from './brief'

function makeLead(overrides: Partial<IpLead>): IpLead {
  return {
    id: 'test',
    companyName: 'Test Co',
    licensedIp: 'Sanrio (Hello Kitty)',
    vertical: 'F&B and QSR chains',
    territory: 'Southeast Asia',
    evidence: '',
    status: 'new',
    dateAdded: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('buildIpLeadBrief', () => {
  it('defaults the IP focus when none is given', () => {
    const brief = buildIpLeadBrief({ territory: 'Southeast Asia', existingLeads: [] })
    expect(brief).toContain('Sanrio, Disney, Pokemon')
    expect(brief).toContain('Southeast Asia')
  })

  it('targets a specific IP when provided', () => {
    const brief = buildIpLeadBrief({
      territory: 'Korea and Japan',
      licensedIp: 'Line Friends',
      existingLeads: [],
    })
    expect(brief).toContain('Line Friends')
    expect(brief).not.toContain('Sanrio, Disney, Pokemon')
  })

  it('lists already-tracked companies so they are not repeated', () => {
    const brief = buildIpLeadBrief({
      territory: 'Southeast Asia',
      existingLeads: [makeLead({ companyName: 'Ministop', licensedIp: 'Sanrio (Hello Kitty)' })],
    })
    expect(brief).toContain("don't repeat")
    expect(brief).toContain('Ministop (Sanrio (Hello Kitty))')
  })

  it('omits the already-tracked line when no leads exist yet', () => {
    const brief = buildIpLeadBrief({ territory: 'Southeast Asia', existingLeads: [] })
    expect(brief).not.toContain("don't repeat")
  })
})
