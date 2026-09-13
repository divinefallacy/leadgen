import type { IpLeadDealType } from '../types'

export type ParsedLead = {
  companyName: string
  licensedIp: string
  vertical: string
  dealType: IpLeadDealType
  evidence: string
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((c) => /^:?-+:?$/.test(c.trim()))
}

function isHeaderRow(companyName: string, licensedIp: string): boolean {
  return /^company( name)?$/i.test(companyName) && /^licensed/i.test(licensedIp)
}

/** Normalizes the model's free-text lead-type cell — defaults to the more conservative 'prestige' when ambiguous. */
function normalizeDealType(raw: string): IpLeadDealType {
  return /revenue/i.test(raw) ? 'revenue' : 'prestige'
}

/**
 * Parses a pasted AI reply (from buildIpLeadBrief's pipe-delimited format,
 * or a markdown table — models drift toward tables even when asked not to)
 * back into leads ready to bulk-add. Any line without at least two
 * pipe-separated, non-empty cells is silently skipped rather than rejected
 * outright — a reply's preamble/closing commentary is expected noise, not
 * an error.
 */
export function parseBulkLeadReply(text: string, limit = 20): ParsedLead[] {
  const results: ParsedLead[] = []

  for (const rawLine of text.split('\n')) {
    if (results.length >= limit) break

    const line = rawLine.trim()
    if (!line.includes('|')) continue

    const cells = line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim())
    if (cells.length < 2 || isSeparatorRow(cells)) continue

    const [companyName, licensedIp, vertical = '', dealTypeRaw = '', evidence = ''] = cells
    if (!companyName || !licensedIp || isHeaderRow(companyName, licensedIp)) continue

    results.push({ companyName, licensedIp, vertical, dealType: normalizeDealType(dealTypeRaw), evidence })
  }

  return results
}
