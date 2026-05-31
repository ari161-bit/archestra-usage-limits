'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra MCP Gateway — ChatInterface
// components/chat/ChatInterface.tsx
//
// Top-level composition: header → usage bar → messages → input.
// Wires together useChatSession + useUsageLimits + all sub-components.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import {
  Cpu, Settings, ChevronRight, Circle, Wifi,
  BarChart2, Layers, Shield, Terminal,
} from 'lucide-react'

import { UsageProgressBar }    from '@/components/chat/UsageProgressBar'
import { ChatMessageComponent } from '@/components/chat/ChatMessage'
import { ChatInput }           from '@/components/chat/ChatInput'
import { useUsageLimits }      from '@/hooks/useUsageLimits'
import { useChatSession }      from '@/hooks/useChatSession'
import { getUsagePercent }     from '@/lib/limits'

// ---------------------------------------------------------------------------
// Sidebar nav (left panel)
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { icon: <Terminal  size={15} />, label: 'Chat',       active: true  },
  { icon: <BarChart2 size={15} />, label: 'Usage',      active: false },
  { icon: <Layers    size={15} />, label: 'Tools',      active: false },
  { icon: <Shield    size={15} />, label: 'Audit log',  active: false },
  { icon: <Settings  size={15} />, label: 'Settings',   active: false },
]

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-14 flex-shrink-0 border-r border-white/[0.05] bg-[#09090f]">
      {/* Logo mark */}
      <div className="h-14 flex items-center justify-center border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg bg-[#6c5ce7] flex items-center justify-center">
          <Cpu size={14} className="text-white" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 py-3">
        {NAV_ITEMS.map(({ icon, label, active }) => (
          <button
            key={label}
            title={label}
            className={[
              'w-9 h-9 flex items-center justify-center rounded-lg transition-all',
              active
                ? 'bg-[#6c5ce7]/20 text-[#9d94f0]'
                : 'text-[#3a3750] hover:bg-white/[0.04] hover:text-[#6a6780]',
            ].join(' ')}
          >
            {icon}
          </button>
        ))}
      </nav>

      {/* User dot */}
      <div className="h-14 flex items-center justify-center border-t border-white/[0.05]">
        <div className="w-7 h-7 rounded-full bg-[#2a1f4a] border border-[#3a2f5a] flex items-center justify-center text-[10px] font-bold text-[#a89be0]">
          T
        </div>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Header bar
// ---------------------------------------------------------------------------

interface HeaderProps {
  modelId: string
}

function Header({ modelId }: HeaderProps) {
  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-5 border-b border-white/[0.05] bg-[#09090f]">
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] text-[#3a3750]">Archestra</span>
        <ChevronRight size={11} className="text-[#2a2740]" />
        <span className="text-[11px] text-[#3a3750]">Engineering Workspace</span>
        <ChevronRight size={11} className="text-[#2a2740]" />
        <span className="text-xs text-[#7a77a0] font-medium">Chat</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1">
          <Circle size={6} className="text-emerald-400 fill-emerald-400" />
          <span className="text-[11px] text-[#6a6780] font-mono">{modelId}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#3a3750]">
          <Wifi size={12} />
          <span>connected</span>
        </div>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function ChatInterface() {
  const { limits, criticalLimit, context, incrementUsed } = useUsageLimits()
  const { messages, isLoading, sendMessage, retryLast }   = useChatSession()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // After each assistant message completes, simulate consuming tokens on the
  // most constrained model limit (keeps the demo live).
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.status === 'done' && last.role === 'assistant' && last.tokenCount) {
      incrementUsed('model-tok-min', last.tokenCount)
      incrementUsed('model-tok-day', last.tokenCount)
      incrementUsed('ws-req-day',    1)
      incrementUsed('org-req-day',   1)
      incrementUsed('user-req-hour', 1)
    }
  }, [messages, incrementUsed])

  const isLimitExceeded = criticalLimit
    ? getUsagePercent(criticalLimit) >= 100
    : false

  const handleSend = (content: string, simulateRateLimit = false) => {
    sendMessage(content, { simulateRateLimit })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090f]">
      <Sidebar />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header modelId={context.modelId} />

        {/* Usage bar — always visible in chat header */}
        <UsageProgressBar
          criticalLimit={criticalLimit}
          allLimits={limits}
        />

        {/* Message list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto py-6 space-y-5 scroll-smooth"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e1e2a transparent' }}
        >
          {messages.map((msg) => (
            <ChatMessageComponent
              key={msg.id}
              message={msg}
              onRetry={msg.status === 'error' ? retryLast : undefined}
            />
          ))}

          {/* Loading indicator for brand-new pending message */}
          {isLoading && messages[messages.length - 1]?.status !== 'streaming' && (
            <div className="px-4 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0f1a2a] border border-[#1f2f3a] flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-[#1f2f3a] border-t-[#5ab8e8] rounded-full animate-spin" />
              </div>
              <span className="text-xs text-[#3a3750]">Archestra is thinking…</span>
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          isLimitExceeded={isLimitExceeded}
        />
      </div>
    </div>
  )
}
