import { useMemo, useState } from 'react'
import {
  CAPITAL_SIGNALS,
  DEFAULT_CAPITAL_SIGNAL,
  EXCLUSION_OPTIONS,
  REVENUE_LINES,
  TERRITORIES,
  VERTICAL_OPTIONS,
  type CapitalSignal,
  type RevenueLine,
  type Territory,
} from '../config'
import { buildBrief } from '../lib/brief'
import { PillRadioGroup } from '../components/PillRadioGroup'
import { CheckboxGroup } from '../components/CheckboxGroup'

function idsWithDefault(options: { id: string; defaultOn: boolean }[]): Set<string> {
  return new Set(options.filter((o) => o.defaultOn).map((o) => o.id))
}

export function ProspectView() {
  const [line, setLine] = useState<RevenueLine>('Licensing')
  const [territory, setTerritory] = useState<Territory>('Southeast Asia')
  const [verticalIds, setVerticalIds] = useState(() => idsWithDefault(VERTICAL_OPTIONS))
  const [exclusionIds, setExclusionIds] = useState(() => idsWithDefault(EXCLUSION_OPTIONS))
  const [capital, setCapital] = useState<CapitalSignal>(DEFAULT_CAPITAL_SIGNAL)
  const [editedBrief, setEditedBrief] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generatedBrief = useMemo(
    () => buildBrief({ line, territory, verticalIds, exclusionIds, capital }),
    [line, territory, verticalIds, exclusionIds, capital],
  )

  const brief = editedBrief ?? generatedBrief

  const toggleVertical = (id: string) => {
    setVerticalIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setEditedBrief(null)
  }

  const toggleExclusion = (id: string) => {
    setExclusionIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setEditedBrief(null)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-2 text-sm font-medium text-neutral-300">Revenue line</div>
            <PillRadioGroup
              options={REVENUE_LINES.map((l) => ({ id: l, label: l }))}
              value={line}
              onChange={(v) => {
                setLine(v)
                setEditedBrief(null)
              }}
            />
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-neutral-300">Territory</div>
            <PillRadioGroup
              options={TERRITORIES.map((t) => ({ id: t, label: t }))}
              value={territory}
              onChange={(v) => {
                setTerritory(v)
                setEditedBrief(null)
              }}
            />
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-neutral-300">Capital signal</div>
            <PillRadioGroup
              options={CAPITAL_SIGNALS}
              value={capital}
              onChange={(v) => {
                setCapital(v)
                setEditedBrief(null)
              }}
            />
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-neutral-300">Verticals</div>
            <CheckboxGroup
              options={VERTICAL_OPTIONS}
              selected={verticalIds}
              onToggle={toggleVertical}
            />
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-neutral-300">
              Hard exclusions <span className="text-neutral-500">(each individually liftable)</span>
            </div>
            <CheckboxGroup
              options={EXCLUSION_OPTIONS}
              selected={exclusionIds}
              onToggle={toggleExclusion}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-neutral-300">Search brief</div>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={brief}
            onChange={(e) => setEditedBrief(e.target.value)}
            rows={20}
            className="w-full flex-1 resize-none rounded border border-neutral-800 bg-neutral-900 p-3 font-mono text-sm text-neutral-200 focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
