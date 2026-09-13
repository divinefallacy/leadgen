import { useEffect, useMemo, useState } from 'react'
import type { IpLead, IpLeadStatus } from '../types'
import { COMMON_LICENSED_IPS, TERRITORIES, VERTICAL_OPTIONS, type Territory } from '../config'
import { ipLeadRepo } from '../lib/ipLeadsRepo'
import { ipLeadsToCsv, downloadCsv } from '../lib/csv'
import { buildIpLeadBrief } from '../lib/brief'
import { MetricCard } from '../components/MetricCard'
import { IpLeadRow } from '../components/IpLeadRow'

type StatusFilter = 'all' | IpLeadStatus

const FILTER_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'researching', label: 'Researching' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'disqualified', label: 'Disqualified' },
]

const emptyForm = {
  companyName: '',
  licensedIp: '',
  vertical: VERTICAL_OPTIONS[0]?.label ?? '',
  territory: TERRITORIES[0] as Territory,
  evidence: '',
}

export function IpLeadsView() {
  const [leads, setLeads] = useState<IpLead[]>([])
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [form, setForm] = useState(emptyForm)
  const [briefTerritory, setBriefTerritory] = useState<Territory>(TERRITORIES[0] as Territory)
  const [briefIp, setBriefIp] = useState('')
  const [copied, setCopied] = useState(false)

  const refresh = () => {
    ipLeadRepo.listLeads().then(setLeads)
  }

  useEffect(refresh, [])

  const filtered = useMemo(
    () => (filter === 'all' ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter],
  )

  const qualifiedCount = leads.filter((l) => l.status === 'qualified').length
  const newCount = leads.filter((l) => l.status === 'new').length

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName.trim() || !form.licensedIp.trim()) return
    await ipLeadRepo.addLead(form)
    setForm({ ...emptyForm, vertical: form.vertical, territory: form.territory })
    refresh()
  }

  const handleStatusChange = async (id: string, status: IpLeadStatus) => {
    await ipLeadRepo.updateStatus(id, status)
    refresh()
  }

  const handleRemove = async (id: string) => {
    await ipLeadRepo.removeLead(id)
    refresh()
  }

  const handleExport = () => {
    downloadCsv('ip-licensee-leads.csv', ipLeadsToCsv(filtered))
  }

  const brief = buildIpLeadBrief({ territory: briefTerritory, licensedIp: briefIp, existingLeads: leads })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-neutral-400">
          Companies already paying to license someone else's characters (Sanrio, Disney, Pokemon,
          etc.) have proven they'll pay for a character license — that makes them a warmer Pudgy
          prospect than a cold outbound target. Track them here as you find them.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricCard label="Tracked" value={String(leads.length)} />
        <MetricCard label="New" value={String(newCount)} />
        <MetricCard label="Qualified" value={String(qualifiedCount)} tone="green" />
      </div>

      <form
        onSubmit={handleAdd}
        className="grid gap-3 rounded border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Company name</label>
          <input
            required
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
            placeholder="e.g. Ministop"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Licenses IP from</label>
          <input
            required
            list="common-licensed-ips"
            value={form.licensedIp}
            onChange={(e) => setForm({ ...form, licensedIp: e.target.value })}
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
            placeholder="e.g. Sanrio (Hello Kitty)"
          />
          <datalist id="common-licensed-ips">
            {COMMON_LICENSED_IPS.map((ip) => (
              <option key={ip} value={ip} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Vertical</label>
          <select
            value={form.vertical}
            onChange={(e) => setForm({ ...form, vertical: e.target.value })}
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
          >
            {VERTICAL_OPTIONS.map((v) => (
              <option key={v.id} value={v.label}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Territory</label>
          <select
            value={form.territory}
            onChange={(e) => setForm({ ...form, territory: e.target.value as Territory })}
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
          >
            {TERRITORIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs text-neutral-500">Evidence (source, link, or note)</label>
          <textarea
            value={form.evidence}
            onChange={(e) => setForm({ ...form, evidence: e.target.value })}
            rows={2}
            className="resize-none rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
            placeholder="Where you saw the existing IP license — retailer listing, press release, packaging photo"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            Add to list
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 border-b border-neutral-800">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
                filter === tab.id
                  ? 'border-neutral-100 text-neutral-100'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded border border-neutral-800">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            No leads in this view yet. Add one above, or use the research prompt below to find some.
          </div>
        ) : (
          filtered.map((lead) => (
            <IpLeadRow
              key={lead.id}
              lead={lead}
              onStatusChange={handleStatusChange}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 rounded border border-neutral-800 bg-neutral-900 p-4">
        <div className="text-sm font-medium text-neutral-300">
          Research prompt — hand this to a researcher or LLM to keep generating this list
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={briefTerritory}
            onChange={(e) => setBriefTerritory(e.target.value as Territory)}
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
          >
            {TERRITORIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            list="common-licensed-ips"
            value={briefIp}
            onChange={(e) => setBriefIp(e.target.value)}
            placeholder="Focus IP (optional, e.g. Sanrio)"
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500">Copy, run it, then add what it finds above.</span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <textarea
          readOnly
          value={brief}
          rows={8}
          className="w-full resize-none rounded border border-neutral-800 bg-neutral-950 p-3 font-mono text-sm text-neutral-200 focus:border-neutral-500 focus:outline-none"
        />
      </div>
    </div>
  )
}
