export function CheckboxGroup({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; label: string }[]
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isOn = selected.has(option.id)
        return (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-sm ${
              isOn
                ? 'border-neutral-100 bg-neutral-100 text-neutral-900'
                : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
            }`}
          >
            <input
              type="checkbox"
              checked={isOn}
              onChange={() => onToggle(option.id)}
              className="sr-only"
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
