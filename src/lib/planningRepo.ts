import type { MonthPlan } from '../types'

const STORAGE_KEY = 'leadgen.planning.v1'

function emptyMonth(month: string): MonthPlan {
  return {
    month,
    targetEvents: [],
    eventsRevenueTarget: 0,
    licensingTarget: '',
    licensingRevenueTarget: 0,
    licensingGoalMet: false,
  }
}

// Merges over emptyMonth() so plans saved before a MonthPlan field was added
// (e.g. the revenue targets) still come back fully shaped instead of undefined.
function hydrate(month: string, saved: MonthPlan | undefined): MonthPlan {
  return { ...emptyMonth(month), ...saved, month }
}

function monthsOf(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`)
}

// Data access boundary, same shape as AccountRepo/IpLeadRepo. Backed by
// localStorage since this is forward-planning data the team fills in ahead
// of time — nothing in either source CSV describes next year.
export interface PlanningRepo {
  getYearPlan(year: number): Promise<MonthPlan[]>
  updateMonth(month: string, patch: Partial<Omit<MonthPlan, 'month'>>): Promise<MonthPlan>
}

function readAll(): Record<string, MonthPlan> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(plans: Record<string, MonthPlan>): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

class LocalStoragePlanningRepo implements PlanningRepo {
  async getYearPlan(year: number): Promise<MonthPlan[]> {
    const saved = readAll()
    return monthsOf(year).map((month) => hydrate(month, saved[month]))
  }

  async updateMonth(month: string, patch: Partial<Omit<MonthPlan, 'month'>>): Promise<MonthPlan> {
    const saved = readAll()
    const updated: MonthPlan = { ...hydrate(month, saved[month]), ...patch, month }
    writeAll({ ...saved, [month]: updated })
    return updated
  }
}

export const planningRepo: PlanningRepo = new LocalStoragePlanningRepo()
