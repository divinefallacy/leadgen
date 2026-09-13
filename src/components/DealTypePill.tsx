import type { IpLeadDealType } from '../types'

const DEAL_TYPE_STYLES: Record<IpLeadDealType, { label: string; className: string }> = {
  prestige: { label: 'Prestige', className: 'bg-neutral-800 text-neutral-300 border-neutral-600' },
  revenue: { label: 'Revenue', className: 'bg-green-950 text-green-400 border-green-900' },
}

export function DealTypePill({ dealType }: { dealType: IpLeadDealType }) {
  const style = DEAL_TYPE_STYLES[dealType]
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  )
}
