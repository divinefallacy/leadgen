export type AccountFilter = 'all' | 'lapse' | 'cross' | 'repeat' | 'cold' | 'dead'

const TABS: { id: AccountFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'lapse', label: 'Lapsed' },
  { id: 'cross', label: 'Cross-sell' },
  { id: 'repeat', label: 'Repeaters' },
  { id: 'cold', label: 'Cold' },
  { id: 'dead', label: 'Dead counterparties' },
]

export function FilterTabs({
  active,
  onChange,
}: {
  active: AccountFilter
  onChange: (filter: AccountFilter) => void
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-neutral-800">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
            active === tab.id
              ? 'border-neutral-100 text-neutral-100'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
