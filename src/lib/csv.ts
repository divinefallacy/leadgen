import type { Account } from '../types'

const HEADERS = [
  'name',
  'vertical',
  'line',
  'stage',
  'counterpartyStatus',
  'dealDirection',
  'rev2025',
  'rev2026',
  'delta',
  'action',
  'note',
  'dataIssue',
] as const

function escapeCsvCell(value: string | number): string {
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function accountsToCsv(accounts: Account[]): string {
  const rows = accounts.map((a) =>
    [
      a.name,
      a.vertical,
      a.line,
      a.stage,
      a.counterpartyStatus,
      a.dealDirection,
      a.rev2025,
      a.rev2026,
      a.rev2026 - a.rev2025,
      a.action,
      a.note,
      a.dataIssue ?? '',
    ]
      .map(escapeCsvCell)
      .join(','),
  )
  return [HEADERS.join(','), ...rows].join('\n')
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
