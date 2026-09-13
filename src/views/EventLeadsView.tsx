import { useEffect, useMemo, useState } from 'react'
import type { Account, EventLead, LeadStatus } from '../types'
import {
  CAPITAL_SIGNALS,
  DEFAULT_CAPITAL_SIGNAL,
  EXCLUSION_OPTIONS,
  TERRITORIES,
  VERTICAL_OPTIONS,
  type CapitalSignal,
  type Territory,
} from '../config'
import { accountRepo } from '../lib/repo'
import { topAccountsByRevenue2026 } from '../lib/metrics'
import { eventLeadRepo } from '../lib/eventLeadsRepo'
import { eventLeadsToCsv, downloadCsv } from '../lib/csv'
import { buildEventLeadBrief } from '../lib/brief'
import { parseBulkEventLeadReply } from '../lib/eventLeadsImport'
import { MetricCard } from '../components/MetricCard'
import { EventLeadRow } from '../components/EventLeadRow'
import { PillRadioGroup } from '../components/PillRadioGroup'
import { CheckboxGroup } from '../components/CheckboxGroup'

type StatusFilter = 'all' | LeadStatus

const FILTER_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'researching', label: 'Researching' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'disqualified', label: 'Disqualified' },
]

function idsWithDefault(options: { id: string; defaultOn: boolean }[]): Set<string> {
  return new Set(options.filter((o) => o.defaultOn).map((o) => o.id))
}

const emptyForm = {
  companyName: '',
  vertical: VERTICAL_OPTIONS[0]?.label ?? '',
  territory: TERRITORIES[0] as Territory,
  capitalSignal: '',
  evidence: '',
}

export function EventLeadsView() {
  const [leads, setLeads] = useState<EventLead[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [form, setForm] = useState(emptyForm)

  const [territory, setTerritory] = useState<Territory>(TERRITORIES[0] as Territory)
  const [verticalIds, setVerticalIds] = useState(() => idsWithDefault(VERTICAL_OPTIONS))
  const [exclusionIds, setExclusionIds] = useState(() => idsWithDefault(EXCLUSION_OPTIONS))
  const [capital, setCapital] = useState<CapitalSignal>(DEFAULT_CAPITAL_SIGNAL)
  const [copied, setCopied] = useState(false)
  const [importText, setImportText] = useState('')
  const [importResult, setImportResult] = useState<string | null>(null)

  const refresh = () => {
    eventLeadRepo.listLeads().then(setLeads)
  }

  useEffect(refresh, [])
  useEffect(() => {
    accountRepo.listAccounts().then(setAccounts)
  }, [])

  const filtered = useMemo(
    () => (filter === 'all' ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter],
  )

  const qualifiedCount = leads.filter((l) => l.status === 'qualified').length
  const newCount = leads.filter((l) => l.status === 'new').length

  const toggleVertical = (id: string) => {
    setVerticalIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExclusion = (id: string) => {
    setExclusionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName.trim()) return
    await eventLeadRepo.addLead(form)
    setForm({ ...emptyForm, vertical: form.vertical, territory: form.territory })
    refresh()
  }

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    await eventLeadRepo.updateStatus(id, status)
    refresh()
  }

  const handleRemove = async (id: string) => {
    await eventLeadRepo.removeLead(id)
    refresh()
  }

  const handleExport = () => {
    downloadCsv('event-leads.csv', eventLeadsToCsv(filtered))
  }

  const benchmarkAccounts = useMemo(
    () => topAccountsByRevenue2026(accounts.filter((a) => a.line === 'Event'), 4).map((a) => a.name),
    [accounts],
  )

  const brief = buildEventLeadBrief({ territory, verticalIds, exclusionIds, capital, benchmarkAccounts, existingLeads: leads })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleImport = async () => {
    const parsed = parseBulkEventLeadReply(importText, 20)
    if (parsed.length === 0) {
      setImportResult("Couldn't find any pipe-delimited rows in that text — paste the chat's reply as-is.")
      return
    }

    const existingNames = new Set(leads.map((l) => l.companyName.trim().toLowerCase()))
    const fresh = parsed.filter((p) => !existingNames.has(p.companyName.trim().toLowerCase()))
    const duplicateCount = parsed.length - fresh.length

    if (fresh.length > 0) {
      await eventLeadRepo.addLeads(
        fresh.map((p) => ({
          companyName: p.companyName,
          vertical: p.vertical || 'Unknown',
          territory,
          capitalSignal: p.capitalSignal,
          evidence: p.evidence,
        })),
      )
    }

    setImportResult(
      `Added ${fresh.length} lead${fresh.length === 1 ? '' : 's'}` +
        (duplicateCount > 0 ? ` (skipped ${duplicateCount} already tracked)` : '.'),
    )
    setImportText('')
    refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-neutral-400">
          New event-sponsorship prospects — not existing accounts (see the Events tab for those). Track
          them here as you find them, and generate more below without repeating anyone already on the list.
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
            placeholder="e.g. Kaia Wave"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Capital or revenue signal</label>
          <input
            value={form.capitalSignal}
            onChange={(e) => setForm({ ...form, capitalSignal: e.target.value })}
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
            placeholder="e.g. $15M raised Series A, Jun 2026"
          />
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
            placeholder="Where you saw the funding/revenue signal — press release, filing, article"
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
            No leads in this view yet. Add one above, or generate some below.
          </div>
        ) : (
          filtered.map((lead) => (
            <EventLeadRow key={lead.id} lead={lead} onStatusChange={handleStatusChange} onRemove={handleRemove} />
          ))
        )}
      </div>

      <div className="flex flex-col gap-4 rounded border border-neutral-800 bg-neutral-900 p-4">
        <div>
          <div className="text-sm font-medium text-neutral-300">Generate 20 leads</div>
          <p className="text-xs text-neutral-500">
            No API calls, no cost — this rides on any Claude chat you already have. Set the criteria, copy
            the prompt, run it in a chat, then paste the reply back to add all 20 at once.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-300">Territory</div>
              <PillRadioGroup options={TERRITORIES.map((t) => ({ id: t, label: t }))} value={territory} onChange={setTerritory} />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-300">Capital signal</div>
              <PillRadioGroup options={CAPITAL_SIGNALS} value={capital} onChange={setCapital} />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-300">Verticals</div>
              <CheckboxGroup options={VERTICAL_OPTIONS} selected={verticalIds} onToggle={toggleVertical} />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-300">
                Hard exclusions <span className="text-neutral-500">(each individually liftable)</span>
              </div>
              <CheckboxGroup options={EXCLUSION_OPTIONS} selected={exclusionIds} onToggle={toggleExclusion} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-neutral-400">1. Copy the research prompt</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Asks for exactly 20, in a format step 3 can parse.</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
                >
                  {copied ? 'Copied' : 'Copy prompt'}
                </button>
              </div>
              <textarea
                readOnly
                value={brief}
                rows={8}
                className="w-full resize-none rounded border border-neutral-800 bg-neutral-950 p-3 font-mono text-sm text-neutral-200 focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-neutral-400">2. Run it in a Claude chat</div>
              <a
                href="https://claude.ai/new"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
              >
                Open a new Claude chat ↗
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-neutral-400">3. Paste the reply here to add all 20</div>
              <textarea
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value)
                  setImportResult(null)
                }}
                rows={6}
                placeholder="Paste the chat's reply — one company per line, pipe-separated"
                className="w-full resize-none rounded border border-neutral-700 bg-neutral-950 p-3 font-mono text-sm text-neutral-200 focus:border-neutral-500 focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">{importResult ?? 'Duplicates already tracked are skipped automatically.'}</span>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="rounded bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Import leads
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
