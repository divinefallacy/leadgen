import { describe, expect, it } from 'vitest'
import { parseBulkEventLeadReply } from './eventLeadsImport'

describe('parseBulkEventLeadReply', () => {
  it('parses plain pipe-delimited lines', () => {
    const text = `Kaia Wave | Layer 1 Blockchain | $15M raised Series A, Jun 2026 | TechCrunch funding round
Nansen | Web3 Analytics | $30M revenue disclosed, Aug 2026 | Company blog post`
    const parsed = parseBulkEventLeadReply(text)
    expect(parsed).toEqual([
      {
        companyName: 'Kaia Wave',
        vertical: 'Layer 1 Blockchain',
        capitalSignal: '$15M raised Series A, Jun 2026',
        evidence: 'TechCrunch funding round',
      },
      {
        companyName: 'Nansen',
        vertical: 'Web3 Analytics',
        capitalSignal: '$30M revenue disclosed, Aug 2026',
        evidence: 'Company blog post',
      },
    ])
  })

  it('skips a markdown table header and separator row', () => {
    const text = `| Company | Vertical | Capital Signal | Evidence |
| --- | --- | --- | --- |
| Kaia Wave | Layer 1 | $15M Series A | TechCrunch |`
    const parsed = parseBulkEventLeadReply(text)
    expect(parsed).toEqual([
      { companyName: 'Kaia Wave', vertical: 'Layer 1', capitalSignal: '$15M Series A', evidence: 'TechCrunch' },
    ])
  })

  it('ignores preamble and closing commentary without pipes', () => {
    const text = `Here are 20 companies matching your criteria:
Kaia Wave | Layer 1 | $15M Series A | TechCrunch
Hope this helps with your outreach!`
    expect(parseBulkEventLeadReply(text)).toHaveLength(1)
  })

  it('defaults capitalSignal and evidence to empty strings when omitted', () => {
    const parsed = parseBulkEventLeadReply('Kaia Wave | Layer 1')
    expect(parsed).toEqual([{ companyName: 'Kaia Wave', vertical: 'Layer 1', capitalSignal: '', evidence: '' }])
  })

  it('skips lines missing a company name or vertical', () => {
    const text = `| Layer 1
Kaia Wave |  | $15M | TechCrunch`
    expect(parseBulkEventLeadReply(text)).toEqual([])
  })

  it('caps results at the given limit', () => {
    const lines = Array.from({ length: 25 }, (_, i) => `Co${i} | Vertical${i}`).join('\n')
    expect(parseBulkEventLeadReply(lines, 20)).toHaveLength(20)
  })

  it('returns an empty array for text with no pipe-delimited lines', () => {
    expect(parseBulkEventLeadReply('no data here, just prose')).toEqual([])
  })
})
