import Anthropic from '@anthropic-ai/sdk'

// Minimal shape of the request/response objects Vercel's Node runtime passes
// to a function handler — avoids depending on @vercel/node just for types.
type VercelRequest = {
  method?: string
  body?: unknown
}

type VercelResponse = {
  status(code: number): VercelResponse
  json(body: unknown): void
}

export type LeadResult = {
  name: string
  vertical: string
  whyFit: string
  signal: string
  distribution: string
  productFormat: string
  sourceUrls: string[]
  unverified: boolean
}

const RETURN_LEADS_TOOL: Anthropic.Tool = {
  name: 'return_leads',
  description:
    'Return the final list of qualified leads found through web research. Call this exactly once, after you are done searching, with every lead you found.',
  input_schema: {
    type: 'object',
    properties: {
      leads: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Company or project name' },
            vertical: { type: 'string', description: 'Industry or category' },
            whyFit: { type: 'string', description: 'Why this company fits the brief' },
            signal: {
              type: 'string',
              description: 'Capital raised or disclosed revenue, with date',
            },
            distribution: {
              type: 'string',
              description: 'Retail or distribution footprint',
            },
            productFormat: {
              type: 'string',
              description: 'The specific Pudgy Penguins product format to pitch',
            },
            sourceUrls: {
              type: 'array',
              items: { type: 'string' },
              description: 'URLs backing the signal and fit claims',
            },
            unverified: {
              type: 'boolean',
              description: 'True if a funding or revenue figure could not be verified',
            },
          },
          required: [
            'name',
            'vertical',
            'whyFit',
            'signal',
            'distribution',
            'productFormat',
            'sourceUrls',
            'unverified',
          ],
        },
      },
    },
    required: ['leads'],
  },
}

function isToolUseBlock(
  block: Anthropic.ContentBlock,
): block is Anthropic.ToolUseBlock {
  return block.type === 'tool_use'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' })
    return
  }

  const body = req.body as { brief?: unknown } | undefined
  const brief = typeof body?.brief === 'string' ? body.brief.trim() : ''
  if (!brief) {
    res.status(400).json({ error: 'Missing "brief" in request body.' })
    return
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 8000,
      tools: [
        { type: 'web_search_20260209', name: 'web_search', max_uses: 8 },
        RETURN_LEADS_TOOL,
      ],
      messages: [
        {
          role: 'user',
          content: `${brief}\n\nUse web search to find real, currently operating companies that fit — do not invent names or figures. When you are done researching, call the return_leads tool exactly once with your full list. Do not reply with plain text.`,
        },
      ],
    })

    const toolUse = message.content.filter(isToolUseBlock).find((block) => block.name === 'return_leads')

    if (!toolUse) {
      res.status(502).json({ error: 'Model did not return a structured lead list. Try again.' })
      return
    }

    const leads = (toolUse.input as { leads?: LeadResult[] }).leads ?? []
    res.status(200).json({ leads })
  } catch (err) {
    console.error('search-leads failed', err)
    res.status(502).json({ error: 'Lead search failed. Try again.' })
  }
}
