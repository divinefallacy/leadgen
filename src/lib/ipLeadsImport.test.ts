import { describe, expect, it } from 'vitest'
import { parseBulkLeadReply } from './ipLeadsImport'

describe('parseBulkLeadReply', () => {
  it('parses plain pipe-delimited lines', () => {
    const text = `Ministop | Sanrio (Hello Kitty) | Convenience and grocery | In-store combo, Aug 2026
7-Eleven Korea | Line Friends | Convenience and grocery | Packaging spotted Jul 2026`
    const parsed = parseBulkLeadReply(text)
    expect(parsed).toEqual([
      {
        companyName: 'Ministop',
        licensedIp: 'Sanrio (Hello Kitty)',
        vertical: 'Convenience and grocery',
        evidence: 'In-store combo, Aug 2026',
      },
      {
        companyName: '7-Eleven Korea',
        licensedIp: 'Line Friends',
        vertical: 'Convenience and grocery',
        evidence: 'Packaging spotted Jul 2026',
      },
    ])
  })

  it('skips a markdown table header and separator row', () => {
    const text = `| Company | Licensed IP | Vertical | Evidence |
| --- | --- | --- | --- |
| Ministop | Sanrio | Convenience | seen in-store |`
    const parsed = parseBulkLeadReply(text)
    expect(parsed).toEqual([
      { companyName: 'Ministop', licensedIp: 'Sanrio', vertical: 'Convenience', evidence: 'seen in-store' },
    ])
  })

  it('ignores preamble and closing commentary without pipes', () => {
    const text = `Here are 20 companies matching your criteria:
Ministop | Sanrio | Convenience | seen in-store
Hope this helps with your outreach!`
    expect(parseBulkLeadReply(text)).toHaveLength(1)
  })

  it('defaults vertical and evidence to empty strings when omitted', () => {
    const parsed = parseBulkLeadReply('Ministop | Sanrio')
    expect(parsed).toEqual([{ companyName: 'Ministop', licensedIp: 'Sanrio', vertical: '', evidence: '' }])
  })

  it('skips lines missing a company name or licensed IP', () => {
    const text = `| Sanrio
Ministop |  | Convenience | seen in-store`
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
