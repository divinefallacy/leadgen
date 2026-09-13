export function StatHero({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-medium text-neutral-300">{label}</div>
      <div className="text-5xl font-semibold text-green-400">{value}</div>
    </div>
  )
}
