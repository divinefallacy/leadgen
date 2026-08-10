import type { Account } from '../types'
import { getDelta, isExcludedFromPipeline, isUrgent } from '../lib/metrics'
import { formatCurrency, formatDelta } from '../lib/format'
import { ActionPill } from './ActionPill'
import { Chip } from './Chip'

function deltaClass(delta: number): string {
  if (delta > 0) return 'text-green-400'
  if (delta < 0) return 'text-red-400'
  return 'text-neutral-500'
}

function deadReason(account: Account): string {
  if (account.counterpartyStatus === 'wound_down') return 'Counterparty wound down'
  if (account.dealDirection === 'spend_out') return 'Spend-out, not revenue'
  return ''
}

export function AccountRow({ account }: { account: Account }) {
  const delta = getDelta(account)
  const urgent = isUrgent(account)
  const dead = isExcludedFromPipeline(account)

  return (
    <div
      className={`flex flex-col gap-2 border-b border-neutral-800 p-4 sm:flex-row sm:items-center sm:justify-between ${
        dead ? 'opacity-50' : ''
      } ${urgent ? 'border-2 border-red-600' : ''}`}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-neutral-100">{account.name}</span>
          <ActionPill action={account.action} />
          {dead && <Chip tone="grey">{deadReason(account)}</Chip>}
          {account.dataIssue && <Chip tone="amber">{account.dataIssue}</Chip>}
        </div>
        <div className="text-xs text-neutral-500">
          {account.vertical} · {account.line} · {account.stage}
        </div>
        {account.note && <div className="text-sm text-neutral-400">{account.note}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-6 text-right">
        <div>
          <div className="text-xs text-neutral-500">2025</div>
          <div className="text-sm text-neutral-200">{formatCurrency(account.rev2025)}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">2026</div>
          <div className="text-sm text-neutral-200">{formatCurrency(account.rev2026)}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Δ YoY</div>
          <div className={`text-sm font-medium ${deltaClass(delta)}`}>{formatDelta(delta)}</div>
        </div>
      </div>
    </div>
  )
}
