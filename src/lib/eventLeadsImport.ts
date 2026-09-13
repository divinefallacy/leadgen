export type ParsedEventLead = {
  companyName: string
  vertical: string
  capitalSignal: string
  evidence: string
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((c) => /^:?-+:?$/.test(c.trim()))
}

function isHeaderRow(companyName: string, vertical: string): boolean {
  return /^company( name)?$/i.test(companyName) && /^vertical/i.test(vertical)
}

/**
 * Parses a pasted AI reply (from buildEventLeadBrief's pipe-delimited
 * format, or a markdown table — models drift toward tables even when asked
 * not to) back into leads ready to bulk-add. Any line without at least two
 * pipe-separated, non-empty cells is silently skipped rather than rejected
 * outright — a reply's preamble/closing commentary is expected noise, not
 * an error.
 */
export function parseBulkEventLeadReply(text: string, limit = 20): ParsedEventLead[] {
  const results: ParsedEventLead[] = []

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

    const [companyName, vertical = '', capitalSignal = '', evidence = ''] = cells
    if (!companyName || !vertical || isHeaderRow(companyName, vertical)) continue

    results.push({ companyName, vertical, capitalSignal, evidence })
  }

  return results
}
