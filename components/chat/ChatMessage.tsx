'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra — ChatMessage
// components/chat/ChatMessage.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { Bot, User, Terminal, Loader2, Copy, Check } from 'lucide-react'
import { useState, useCallback } from 'react'
import { ChatMessage as ChatMessageType } from '@/hooks/useChatSession'
import { RateLimitErrorCard } from '@/components/chat/RateLimitErrorCard'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Very lightweight markdown-ish renderer: bold, code, line-breaks */
function renderContent(text: string): React.ReactNode {
  return text.split('\n').map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
    return (
      <span key={li}>
        {parts.map((part, pi) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pi} className="font-semibold text-[#e8e2d9]">{part.slice(2, -2)}</strong>
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={pi} className="font-mono text-[11px] bg-white/[0.07] text-[#a89be0] px-1 py-0.5 rounded">
                {part.slice(1, -1)}
              </code>
            )
          }
          return part
        })}
        {li < text.split('\n').length - 1 && <br />}
      </span>
    )
  })
}

// ---------------------------------------------------------------------------
// Skeleton / streaming cursor
// ---------------------------------------------------------------------------

function StreamingCursor() {
  return (
    <span className="inline-block w-[2px] h-[13px] bg-[#a89be0] ml-0.5 animate-pulse rounded-full align-middle" />
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#3a3650] animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ChatMessageProps {
  message:   ChatMessageType
  onRetry?:  () => void
}

export function ChatMessageComponent({ message, onRetry }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyContent = useCallback(() => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [message.content])

  // ── System message ────────────────────────────────────────────────────────
  if (message.role === 'system') {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg bg-[#0d0d14] border border-white/[0.05]">
        <Terminal size={12} className="text-[#4a4760] flex-shrink-0" />
        <p className="text-[11px] text-[#4a4760] font-mono leading-relaxed">
          {renderContent(message.content)}
        </p>
      </div>
    )
  }

  const isUser      = message.role === 'user'
  const isPending   = message.status === 'pending'
  const isStreaming = message.status === 'streaming'
  const isError     = message.status === 'error'

  return (
    <div className={`flex items-start gap-3 px-4 group ${isUser ? 'flex-row-reverse' : ''}`}>

      {/* Avatar */}
      <div
        className={[
          'mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg',
          isUser
            ? 'bg-[#2a1f4a] border border-[#3a2f5a]'
            : 'bg-[#0f1a2a] border border-[#1f2f3a]',
        ].join(' ')}
      >
        {isUser
          ? <User    size={13} className="text-[#a89be0]" />
          : <Bot     size={13} className="text-[#5ab8e8]" />
        }
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Name + timestamp */}
        <div className={`flex items-center gap-2 text-[10px] text-[#3a3750] ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-semibold text-[#5a5770]">{isUser ? 'You' : 'Archestra'}</span>
          <span>{message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.tokenCount && (
            <span className="font-mono bg-white/[0.03] border border-white/[0.06] rounded px-1.5 py-0.5">
              {message.tokenCount.toLocaleString()} tok
            </span>
          )}
        </div>

        {/* ── 429 Error card ─────────────────────────────────────────────── */}
        {isError && message.rateLimitError ? (
          <RateLimitErrorCard error={message.rateLimitError} onRetry={onRetry} />
        ) : (
          /* ── Regular content ─────────────────────────────────────────── */
          <div
            className={[
              'relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
              isUser
                ? 'bg-[#1e1640] border border-[#2e2650] text-[#c9c4e8] rounded-tr-sm'
                : 'bg-[#13131e] border border-white/[0.06] text-[#b0aab8] rounded-tl-sm',
            ].join(' ')}
          >
            {isPending  && <ThinkingDots />}
            {!isPending && (
              <>
                {renderContent(message.content)}
                {isStreaming && <StreamingCursor />}
              </>
            )}
          </div>
        )}

        {/* Copy action (assistant messages only, once done) */}
        {!isUser && message.status === 'done' && message.content && (
          <button
            onClick={copyContent}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-[#3a3750] hover:text-[#7a77a0] px-1"
          >
            {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  )
}
