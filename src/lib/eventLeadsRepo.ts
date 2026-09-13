import type { EventLead, LeadStatus, NewEventLeadInput } from '../types'

const STORAGE_KEY = 'leadgen.eventLeads.v1'

// Data access boundary, same shape as IpLeadRepo. Backed by localStorage for
// now since there's no server — swap for a real API without touching
// callers. This is the list EventLeadsView keeps growing over time as new
// event-sponsorship prospects are found, unlike the seed-data AccountRepo.
export interface EventLeadRepo {
  listLeads(): Promise<EventLead[]>
  addLead(input: NewEventLeadInput): Promise<EventLead>
  addLeads(inputs: NewEventLeadInput[]): Promise<EventLead[]>
  updateStatus(id: string, status: LeadStatus): Promise<void>
  removeLead(id: string): Promise<void>
}

function readAll(): EventLead[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(leads: EventLead[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

class LocalStorageEventLeadRepo implements EventLeadRepo {
  async listLeads(): Promise<EventLead[]> {
    return readAll().sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
  }

  async addLead(input: NewEventLeadInput): Promise<EventLead> {
    const lead: EventLead = {
      ...input,
      id: makeId(),
      status: input.status ?? 'new',
      dateAdded: new Date().toISOString(),
    }
    writeAll([...readAll(), lead])
    return lead
  }

  async addLeads(inputs: NewEventLeadInput[]): Promise<EventLead[]> {
    const dateAdded = new Date().toISOString()
    const newLeads = inputs.map((input) => ({
      ...input,
      id: makeId(),
      status: input.status ?? 'new',
      dateAdded,
    }))
    writeAll([...readAll(), ...newLeads])
    return newLeads
  }

  async updateStatus(id: string, status: LeadStatus): Promise<void> {
    writeAll(readAll().map((lead) => (lead.id === id ? { ...lead, status } : lead)))
  }

  async removeLead(id: string): Promise<void> {
    writeAll(readAll().filter((lead) => lead.id !== id))
  }
}

export const eventLeadRepo: EventLeadRepo = new LocalStorageEventLeadRepo()
