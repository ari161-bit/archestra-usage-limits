'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra MCP Gateway — useChatSession
// hooks/useChatSession.ts
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useId } from 'react'
import { RateLimitError, LimitKind, LimitScope } from '@/lib/limits'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus = 'pending' | 'streaming' | 'done' | 'error'

export interface ChatMessage {
  readonly id:          string
  readonly role:        MessageRole
  content:              string
  readonly createdAt:   Date
  status:               MessageStatus
  /** Set when this message triggered a 429 */
  rateLimitError?:      RateLimitError
  /** Token count returned by the API */
  tokenCount?:          number
}

export interface SendOptions {
  /** Simulate a 429 response for demo/testing */
  simulateRateLimit?: boolean
}

export interface ChatSessionReturn {
  messages:       ChatMessage[]
  isLoading:      boolean
  sendMessage:    (content: string, opts?: SendOptions) => Promise<void>
  clearMessages:  () => void
  retryLast:      () => Promise<void>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let msgCounter = 0
function makeMsgId(): string {
  return `msg-${++msgCounter}-${Math.random().toString(36).slice(2, 7)}`
}

// Simulate streaming text
async function* fakeStream(text: string): AsyncGenerator<string> {
  const words = text.split(' ')
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 60))
    yield word + ' '
  }
}

const MOCK_RESPONSES = [
  'Understood. I\'ve analysed the MCP tool calls in your pipeline and identified three potential bottlenecks in the context routing layer. The primary issue appears to be in how the gateway serialises intermediate results between tool invocations — each hop is adding roughly 12ms of unnecessary latency.',
  'The rate-limit hierarchy you\'ve described follows a clean cascade pattern. At the organisation level you have the broadest cap, then workspace-scoped limits apply, and finally per-model token budgets are enforced last. This means workspace limits are often the first to be exhausted in multi-tenant deployments.',
  'For the prompt caching strategy, I\'d recommend anchoring your system prompt at position zero in the context window and keeping it under 1024 tokens. This maximises cache hit rate across sessions that share the same base configuration — particularly effective in agentic workflows where the tool definitions are repeated verbatim.',
  'Looking at the tool-call graph you\'ve described, I see an opportunity to batch the three sequential read operations into a single parallel fan-out. This would reduce your P95 latency from roughly 800ms to around 280ms without any changes to the downstream MCP server implementations.',
]

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useChatSession(): ChatSessionReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id:        'sys-0',
      role:      'system',
      content:   'Archestra MCP Gateway connected. Model: **gpt-4o**. All tool calls are routed through the enterprise gateway with full audit logging.',
      createdAt: new Date(),
      status:    'done',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [lastInput,  setLastInput]  = useState('')

  const sendMessage = useCallback(async (content: string, opts: SendOptions = {}) => {
    if (!content.trim() || isLoading) return

    setLastInput(content)

    // Add user message
    const userMsg: ChatMessage = {
      id:        makeMsgId(),
      role:      'user',
      content,
      createdAt: new Date(),
      status:    'done',
    }

    // Placeholder assistant message
    const assistantId = makeMsgId()
    const assistantMsg: ChatMessage = {
      id:        assistantId,
      role:      'assistant',
      content:   '',
      createdAt: new Date(),
      status:    'pending',
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setIsLoading(true)

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400))

    // ── 429 simulation ────────────────────────────────────────────────────
    if (opts.simulateRateLimit) {
      const error: RateLimitError = {
        limitId:      'model-tok-min',
        kind:         'tokens_per_minute' as LimitKind,
        scope:        'model' as LimitScope,
        label:        'GPT-4o · Tokens / min',
        used:         90_000,
        total:        90_000,
        resetsAt:     new Date(Date.now() + 47_000),
        retryAfterMs: 47_000,
        requestId:    `req_${Math.random().toString(36).slice(2, 10)}`,
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, status: 'error', rateLimitError: error }
            : m,
        ),
      )
      setIsLoading(false)
      return
    }

    // ── Streaming response ────────────────────────────────────────────────
    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, status: 'streaming' } : m)),
    )

    const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
    let accumulated = ''

    for await (const chunk of fakeStream(response)) {
      accumulated += chunk
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: accumulated } : m,
        ),
      )
    }

    // Finalise with token count
    const tokenCount = Math.floor(accumulated.length / 4)
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId
          ? { ...m, content: accumulated.trimEnd(), status: 'done', tokenCount }
          : m,
      ),
    )
    setIsLoading(false)
  }, [isLoading])

  const retryLast = useCallback(async () => {
    if (!lastInput) return
    // Remove the last failed assistant message
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      return last?.status === 'error' ? prev.slice(0, -1) : prev
    })
    await sendMessage(lastInput)
  }, [lastInput, sendMessage])

  const clearMessages = useCallback(() => {
    setMessages([])
    setIsLoading(false)
  }, [])

  return { messages, isLoading, sendMessage, clearMessages, retryLast }
}
