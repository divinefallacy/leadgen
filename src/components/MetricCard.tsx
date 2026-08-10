type MetricCardProps = {
  label: string
  value: string
  tone?: 'neutral' | 'red' | 'green'
}

const TONE_CLASSES: Record<NonNullable<MetricCardProps['tone']>, string> = {
  neutral: 'text-neutral-100',
  red: 'text-red-400',
  green: 'text-green-400',
}

export function MetricCard({ label, value, tone = 'neutral' }: MetricCardProps) {
  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</div>
    </div>
  )
}
