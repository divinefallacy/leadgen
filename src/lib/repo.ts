import type { Account } from '../types'
import { accounts as seedAccounts } from '../data/accounts'

// Data access boundary. Swap this in-memory implementation for one backed by
// the Notion API and Google Sheets API without touching callers — every
// consumer goes through this interface.
export interface AccountRepo {
  listAccounts(): Promise<Account[]>
}

class InMemoryAccountRepo implements AccountRepo {
  async listAccounts(): Promise<Account[]> {
    return seedAccounts
  }
}

export const accountRepo: AccountRepo = new InMemoryAccountRepo()
