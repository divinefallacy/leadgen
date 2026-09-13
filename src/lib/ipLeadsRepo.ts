import type { IpLead, IpLeadStatus, NewIpLeadInput } from '../types'

const STORAGE_KEY = 'leadgen.ipLeads.v1'

// Data access boundary, same shape as AccountRepo. Backed by localStorage for
// now since there's no server — swap for a real API without touching
// callers. This is the list IpLeadsView keeps growing over time as new
// IP-licensee companies are found, unlike the seed-data AccountRepo.
export interface IpLeadRepo {
  listLeads(): Promise<IpLead[]>
  addLead(input: NewIpLeadInput): Promise<IpLead>
  addLeads(inputs: NewIpLeadInput[]): Promise<IpLead[]>
  updateStatus(id: string, status: IpLeadStatus): Promise<void>
  removeLead(id: string): Promise<void>
}

function readAll(): IpLead[] {
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

function writeAll(leads: IpLead[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

class LocalStorageIpLeadRepo implements IpLeadRepo {
  async listLeads(): Promise<IpLead[]> {
    return readAll().sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
  }

  async addLead(input: NewIpLeadInput): Promise<IpLead> {
    const lead: IpLead = {
      ...input,
      id: makeId(),
      status: input.status ?? 'new',
      dateAdded: new Date().toISOString(),
    }
    writeAll([...readAll(), lead])
    return lead
  }

  async addLeads(inputs: NewIpLeadInput[]): Promise<IpLead[]> {
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

  async updateStatus(id: string, status: IpLeadStatus): Promise<void> {
    writeAll(readAll().map((lead) => (lead.id === id ? { ...lead, status } : lead)))
  }

  async removeLead(id: string): Promise<void> {
    writeAll(readAll().filter((lead) => lead.id !== id))
  }
}

export const ipLeadRepo: IpLeadRepo = new LocalStorageIpLeadRepo()
