import { describe, expect, it } from 'vitest'
import { parseBulkLeadReply } from './ipLeadsImport'

describe('parseBulkLeadReply', () => {
  it('parses plain pipe-delimited lines with a lead-type column', () => {
    const text = `Ministop | Sanrio (Hello Kitty) | Convenience and grocery | prestige | In-store combo, Aug 2026
7-Eleven Korea | Line Friends | Convenience and grocery | revenue | Disclosed $200k licensing fee, Jul 2026`
    const parsed = parseBulkLeadReply(text)
    expect(parsed).toEqual([
      {
        companyName: 'Ministop',
        licensedIp: 'Sanrio (Hello Kitty)',
        vertical: 'Convenience and grocery',
        dealType: 'prestige',
        evidence: 'In-store combo, Aug 2026',
      },
      {
        companyName: '7-Eleven Korea',
        licensedIp: 'Line Friends',
        vertical: 'Convenience and grocery',
        dealType: 'revenue',
        evidence: 'Disclosed $200k licensing fee, Jul 2026',
      },
    ])
  })

  it('normalizes an unrecognized lead-type cell to the conservative "prestige" default', () => {
    const parsed = parseBulkLeadReply('Ministop | Sanrio | Convenience | unclear | some evidence')
    expect(parsed[0]?.dealType).toBe('prestige')
  })

  it('matches "revenue" case-insensitively even with extra wording', () => {
    const parsed = parseBulkLeadReply('Ministop | Sanrio | Convenience | Revenue-focused | some evidence')
    expect(parsed[0]?.dealType).toBe('revenue')
  })

  it('skips a markdown table header and separator row', () => {
    const text = `| Company | Licensed IP | Vertical | Lead Type | Evidence |
| --- | --- | --- | --- | --- |
| Ministop | Sanrio | Convenience | prestige | seen in-store |`
    const parsed = parseBulkLeadReply(text)
    expect(parsed).toEqual([
      {
        companyName: 'Ministop',
        licensedIp: 'Sanrio',
        vertical: 'Convenience',
        dealType: 'prestige',
        evidence: 'seen in-store',
      },
    ])
  })

  it('ignores preamble and closing commentary without pipes', () => {
    const text = `Here are 20 companies matching your criteria:
Ministop | Sanrio | Convenience | prestige | seen in-store
Hope this helps with your outreach!`
    expect(parseBulkLeadReply(text)).toHaveLength(1)
  })

  it('defaults vertical and evidence to empty strings when omitted', () => {
    const parsed = parseBulkLeadReply('Ministop | Sanrio')
    expect(parsed).toEqual([
      { companyName: 'Ministop', licensedIp: 'Sanrio', vertical: '', dealType: 'prestige', evidence: '' },
    ])
  })

  it('skips lines missing a company name or licensed IP', () => {
    const text = `| Sanrio
Ministop |  | Convenience | prestige | seen in-store`
    expect(parseBulkLeadReply(text)).toEqual([])
  })

  it('caps results at the given limit', () => {
    const lines = Array.from({ length: 25 }, (_, i) => `Co${i} | IP${i}`).join('\n')
    expect(parseBulkLeadReply(lines, 20)).toHaveLength(20)
  })

  it('returns an empty array for text with no pipe-delimited lines', () => {
    expect(parseBulkLeadReply('no data here, just prose')).toEqual([])
  })
})
