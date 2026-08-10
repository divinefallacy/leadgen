# Pudgy APAC Partnership Intelligence

A React + Vite app for tracking Pudgy Penguins APAC partnership revenue and finding new leads — companies that could sponsor Pudgy Penguins events or pay for IP licensing.

## Lead search

The "Find new leads" tab lets you filter by revenue line, territory, vertical, capital signal, and hard exclusions, then either:

- **Copy** the generated brief to paste into an external research tool, or
- **Search for leads**, which calls Claude (with web search) server-side and returns a structured, sourced list of candidate companies directly in the app.

### Setup

Lead search needs an Anthropic API key on the server — it is never exposed to the browser.

```bash
cp .env.example .env
# then set ANTHROPIC_API_KEY in .env
```

`api/search-leads.ts` is a Vercel serverless function. To run it locally alongside the Vite dev server:

```bash
npm install -g vercel   # if you don't already have it
vercel dev
```

`vercel dev` reads `.env` automatically and serves both the frontend and `/api/search-leads`. Running `npm run dev` alone starts only the Vite frontend — the search button will fail with a 404 against `/api/search-leads` since Vite doesn't serve the `api/` folder.

### Deploying

Deploy to Vercel (or any platform that runs Node serverless functions from an `api/` folder) and set `ANTHROPIC_API_KEY` as an environment variable in the project settings.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
