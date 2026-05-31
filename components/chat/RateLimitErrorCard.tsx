'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra — RateLimitErrorCard (429 visualisation)
// components/chat/RateLimitErrorCard.tsx
//
// Replaces the bare "429 Too Many Requests" text with a rich error card.
// Shows: which limit was hit, used/total, reset countdown, retry CTA.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react'
import { ShieldOff, RefreshCw, Clock, ArrowRight, Copy, Check } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import {
  RateLimitError,
  LIMIT_KIND_LABELS,
  LIMIT_KIND_ICONS,
  SCOPE_LABELS,
  formatCount,
  getResetCountdown,
  getLimitBadgeStyle,
} from '@/lib/limits'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function useCountdown(targetMs: number): string {
  const [remaining, setRemaining] = useState(Math.max(0, targetMs - Date.now()))

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1000))
    }, 1_000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (remaining <= 0) return 'now'
  const secs = Math.ceil(remaining / 1000)
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  return `${mins}m ${secs % 60}s`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface RateLimitErrorCardProps {
  error:     RateLimitError
  onRetry?:  () => void
}

export function RateLimitErrorCard({ error, onRetry }: RateLimitErrorCardProps) {
  const retryTarget  = Date.now() + error.retryAfterMs
  const countdown    = useCountdown(retryTarget)
  const canRetry     = countdown === 'now'
  const [copied, setCopied] = useState(false)

  const usedPct      = error.total > 0 ? Math.min(100, (error.used / error.total) * 100) : 100
  const badge        = getLimitBadgeStyle(100) // always exceeded
  const kindLabel    = LIMIT_KIND_LABELS[error.kind]
  const kindIcon     = LIMIT_KIND_ICONS[error.kind]
  const scopeLabel   = SCOPE_LABELS[error.scope]

  const copyRequestId = useCallback(() => {
    if (!error.requestId) return
    navigator.clipboard.writeText(error.requestId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [error.requestId])

  return (
    <div className="rounded-2xl border border-red-500/20 bg-[#130d0d] overflow-hidden shadow-xl shadow-red-950/20 max-w-lg">

      {/* ── Header ── */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-red-500/10">
        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
          <ShieldOff size={17} className="text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-red-300">Rate limit exceeded</span>
            <span className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1.5 py-0.5">
              HTTP 429
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#6a3a3a] leading-snug">
            {error.label}
          </p>
        </div>
      </div>

      {/* ── Limit breakdown ── */}
      <div className="px-5 py-4 space-y-4">

        {/* Kind + scope badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9a8080] bg-white/[0.04] border border-white/[0.07] rounded-full px-2.5 py-1">
            {kindIcon} {kindLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9a8080] bg-white/[0.04] border border-white/[0.07] rounded-full px-2.5 py-1">
            🏢 {scopeLabel} scope
          </span>
        </div>

        {/* Visual usage breakdown */}
        <div className="space-y-2 rounded-xl bg-white/[0.025] border border-white/[0.05] px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5a4a4a]">Consumption</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-red-400 font-bold">
                {formatCount(error.used)}
              </span>
              <span className="text-[#3a2a2a]">/</span>
              <span className="font-mono text-[#6a5050]">
                {formatCount(error.total)}
              </span>
            </div>
          </div>
          <Progress value={usedPct} colorClass="bg-red-500" height={6} animated />
          <div className="flex justify-between text-[10px] text-[#3a2020]">
            <span>0</span>
            <span className="text-red-700 font-semibold">100% — exhausted</span>
            <span>{formatCount(error.total)}</span>
          </div>
        </div>

        {/* Reset countdown */}
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] border border-white/[0.05] px-4 py-3">
          <Clock size={14} className="text-[#5a4a4a] flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[11px] text-[#5a4a4a]">Limit resets in</div>
            <div className={`text-sm font-mono font-bold ${canRetry ? 'text-emerald-400' : 'text-[#c09070]'}`}>
              {canRetry ? '✓ Ready to retry' : countdown}
            </div>
          </div>
          {error.resetsAt && (
            <div className="text-right">
              <div className="text-[10px] text-[#3a2a2a]">Reset at</div>
              <div className="text-[11px] text-[#5a4050] font-mono">
                {error.resetsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          )}
        </div>

        {/* Request ID */}
        {error.requestId && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#3a2a2a] font-mono flex-1 truncate">
              req: {error.requestId}
            </span>
            <button
              onClick={copyRequestId}
              className="flex-shrink-0 text-[#3a2a2a] hover:text-[#7a5a5a] transition-colors"
              aria-label="Copy request ID"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2 px-5 pb-5">
        <button
          onClick={onRetry}
          disabled={!canRetry}
          className={[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
            canRetry
              ? 'bg-emerald-500 text-[#0a1a0f] hover:bg-emerald-400 active:scale-[0.98]'
              : 'bg-white/[0.04] text-[#4a3a3a] border border-white/[0.06] cursor-not-allowed',
          ].join(' ')}
        >
          <RefreshCw size={13} />
          {canRetry ? 'Retry now' : `Retry in ${countdown}`}
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#5a4a4a] hover:text-[#9a7a7a] transition-colors"
          onClick={() => window.open('https://docs.archestra.dev/limits', '_blank')}
        >
          View limits docs <ArrowRight size={11} />
        </button>
      </div>
    </div>
  )
}
