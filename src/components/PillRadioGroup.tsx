export function PillRadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded border px-3 py-1.5 text-sm ${
            value === option.id
              ? 'border-neutral-100 bg-neutral-100 text-neutral-900'
              : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
