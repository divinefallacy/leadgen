import { useState } from 'react'
import { AccountsView } from './views/AccountsView'
import { ProspectView } from './views/ProspectView'

type View = 'accounts' | 'prospect'

function App() {
  const [view, setView] = useState<View>('accounts')

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold">Pudgy APAC Partnership Intelligence</h1>
            <p className="text-sm text-neutral-500">Igloo APAC · revenue expansion &amp; outbound</p>
          </div>
          <nav className="flex gap-1">
            <button
              type="button"
              onClick={() => setView('accounts')}
              className={`rounded px-3 py-1.5 text-sm ${
                view === 'accounts'
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Accounts
            </button>
            <button
              type="button"
              onClick={() => setView('prospect')}
              className={`rounded px-3 py-1.5 text-sm ${
                view === 'prospect'
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Find new leads
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {view === 'accounts' ? <AccountsView /> : <ProspectView />}
      </main>
    </div>
  )
}

export default App
