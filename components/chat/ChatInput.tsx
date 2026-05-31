'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra — ChatInput
// components/chat/ChatInput.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, KeyboardEvent, FormEvent } from 'react'
import { Send, Zap, AlertTriangle } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'

interface ChatInputProps {
  onSend:              (content: string, simulateRateLimit?: boolean) => void
  isLoading:           boolean
  isLimitExceeded:     boolean
}

export function ChatInput({ onSend, isLoading, isLimitExceeded }: ChatInputProps) {
  const [value, setValue]           = useState('')
  const [simulateRL, setSimulateRL] = useState(false)
  const textareaRef                 = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed, simulateRL)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  const disabled = isLoading || isLimitExceeded

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-4 mb-4 rounded-2xl border bg-[#0f0f18] transition-all"
      style={{ borderColor: isLimitExceeded ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)' }}
    >
      {/* Limit exceeded banner */}
      {isLimitExceeded && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <AlertTriangle size={12} className="text-red-400" />
          <span className="text-[11px] text-red-400">
            Rate limit exceeded — input disabled until quota resets
          </span>
        </div>
      )}

      <div className="flex items-end gap-2 px-4 py-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => { setValue(e.target.value); handleInput() }}
          onKeyDown={handleKeyDown}
          placeholder={isLimitExceeded ? 'Waiting for quota reset…' : 'Message Archestra… (⏎ send, ⇧⏎ newline)'}
          disabled={disabled}
          rows={1}
          className={[
            'flex-1 resize-none bg-transparent text-sm text-[#c9c4bc] placeholder:text-[#3a3750]',
            'outline-none leading-relaxed min-h-[24px]',
            disabled ? 'cursor-not-allowed opacity-40' : '',
          ].join(' ')}
          style={{ maxHeight: 160 }}
        />

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* 429 simulator toggle */}
          <Tooltip content="Simulate a 429 rate-limit response" side="top" delayMs={300}>
            <button
              type="button"
              onClick={() => setSimulateRL((s) => !s)}
              className={[
                'flex items-center justify-center w-7 h-7 rounded-lg transition-all border text-xs',
                simulateRL
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                  : 'bg-white/[0.04] border-white/[0.06] text-[#3a3750] hover:text-[#7a77a0]',
              ].join(' ')}
              aria-label="Toggle 429 simulation"
            >
              <Zap size={11} />
            </button>
          </Tooltip>

          {/* Send button */}
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className={[
              'flex items-center justify-center w-8 h-8 rounded-xl transition-all',
              disabled || !value.trim()
                ? 'bg-white/[0.04] text-[#2a2740] cursor-not-allowed'
                : 'bg-[#6c5ce7] text-white hover:bg-[#7d6ef0] active:scale-95',
            ].join(' ')}
            aria-label="Send message"
          >
            {isLoading
              ? <span className="w-3 h-3 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              : <Send size={13} />
            }
          </button>
        </div>
      </div>

      {/* Simulation label */}
      {simulateRL && (
        <div className="px-4 pb-2 flex items-center gap-1.5">
          <span className="text-[10px] text-orange-500/70 font-mono">
            ⚡ next message will return HTTP 429
          </span>
        </div>
      )}
    </form>
  )
}
