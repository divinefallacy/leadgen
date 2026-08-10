import type { Lead } from '../types'

export async function searchLeads(brief: string): Promise<Lead[]> {
  const response = await fetch('/api/search-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief }),
  })

  const body = (await response.json().catch(() => null)) as
    | { leads?: Lead[]; error?: string }
    | null

  if (!response.ok) {
    throw new Error(body?.error ?? `Search failed (${response.status}).`)
  }

  return body?.leads ?? []
}
