import { useState } from 'react'
import { DashboardView } from './views/DashboardView'
import { EventsView } from './views/EventsView'
import { LicensingView } from './views/LicensingView'
import { PlanningView } from './views/PlanningView'
import { EventLeadsView } from './views/EventLeadsView'
import { IpLeadsView } from './views/IpLeadsView'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', Component: DashboardView },
  { id: 'events', label: 'Events', Component: EventsView },
  { id: 'licensing', label: 'IP Licensing', Component: LicensingView },
  { id: 'planning', label: 'Planning', Component: PlanningView },
  { id: 'event-leads', label: 'Event leads', Component: EventLeadsView },
  { id: 'ip-leads', label: 'IP licensee leads', Component: IpLeadsView },
] as const

type View = (typeof TABS)[number]['id']

function App() {
  const [view, setView] = useState<View>('dashboard')
  const ActiveView = TABS.find((t) => t.id === view)?.Component ?? DashboardView

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold">Pudgy Penguins Asia Partnership Intelligence</h1>
            <p className="text-sm text-neutral-500">Pudgy Penguins Asia · revenue expansion &amp; outbound</p>
          </div>
          <nav className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`rounded px-3 py-1.5 text-sm ${
                  view === tab.id
                    ? 'bg-neutral-800 text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <ActiveView />
      </main>
    </div>
  )
}

export default App
