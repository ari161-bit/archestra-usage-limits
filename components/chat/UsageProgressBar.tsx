'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra — UsageProgressBar
// components/chat/UsageProgressBar.tsx
//
// Renders the critical-limit progress bar in the chat header.
// Shows: coloured fill, animated tooltip with used/limit + kind + reset text.
// ─────────────────────────────────────────────────────────────────────────────

import { Activity, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Progress }  from '@/components/ui/Progress'
import { Tooltip }   from '@/components/ui/Tooltip'
import {
  UsageLimit,
  getUsagePercent,
  formatUsage,
  getResetCountdown,
  getLimitBarColor,
  getLimitTextColor,
  getLimitBadgeStyle,
  LIMIT_KIND_LABELS,
  LIMIT_KIND_ICONS,
  SCOPE_LABELS,
} from '@/lib/limits'

// ---------------------------------------------------------------------------
// Tooltip content
// ---------------------------------------------------------------------------

function TooltipContent({ limit }: { limit: UsageLimit }) {
  const percent   = getUsagePercent(limit)
  const barColor  = getLimitBarColor(percent)
  const textColor = getLimitTextColor(percent)
  const badge     = getLimitBadgeStyle(percent)

  return (
    <div className="flex flex-col gap-2 min-w-[220px] p-1 whitespace-normal pointer-events-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-[#e8e2d9] text-xs leading-tight">{limit.label}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
          {percent.toFixed(1)}%
        </span>
      </div>

      {/* Mini progress */}
      <Progress value={percent} colorClass={barColor} height={3} />

      {/* Stats row */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#6a6570]">
          {LIMIT_KIND_ICONS[limit.kind]}&nbsp;
          <span className="text-[#9a96a0]">{LIMIT_KIND_LABELS[limit.kind]}</span>
        </span>
        <span className={`font-mono font-semibold ${textColor}`}>{formatUsage(limit)}</span>
      </div>

      {/* Scope + reset */}
      <div className="flex items-center justify-between text-[10px] text-[#4a4750]">
        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
          {SCOPE_LABELS[limit.scope]}
        </span>
        <span className="text-[#5a5760]">{getResetCountdown(limit.resetsAt)}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Expanded all-limits panel
// ---------------------------------------------------------------------------

function AllLimitsPanel({ limits }: { limits: UsageLimit[] }) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-40 rounded-xl border border-white/10 bg-[#13131a] shadow-2xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5">
        <span className="text-[11px] font-semibold text-[#6a6570] tracking-wider uppercase">
          All usage limits
        </span>
      </div>
      <ul className="divide-y divide-white/[0.04]">
        {limits.map((limit) => {
          const pct   = getUsagePercent(limit)
          const color = getLimitBarColor(pct)
          const text  = getLimitTextColor(pct)
          const badge = getLimitBadgeStyle(pct)
          return (
            <li key={limit.id} className="px-4 py-3 flex flex-col gap-1.5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-medium text-[#c9c4bc] leading-snug truncate block">
                    {limit.label}
                  </span>
                  <span className="text-[10px] text-[#4a4750]">
                    {LIMIT_KIND_ICONS[limit.kind]} {LIMIT_KIND_LABELS[limit.kind]} · {SCOPE_LABELS[limit.scope]}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`font-mono text-[11px] ${text}`}>{formatUsage(limit)}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
              <Progress value={pct} colorClass={color} height={3} />
              <span className="text-[10px] text-[#3a3740]">{getResetCountdown(limit.resetsAt)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface UsageProgressBarProps {
  criticalLimit: UsageLimit | null
  allLimits:     UsageLimit[]
}

export function UsageProgressBar({ criticalLimit, allLimits }: UsageProgressBarProps) {
  const [expanded, setExpanded] = useState(false)

  if (!criticalLimit) return null

  const percent   = getUsagePercent(criticalLimit)
  const barColor  = getLimitBarColor(percent)
  const textColor = getLimitTextColor(percent)

  return (
    <div className="relative px-4 py-2.5 border-b border-white/[0.06] bg-[#0f0f16]">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <Activity size={13} className={`flex-shrink-0 ${textColor}`} />

        {/* Label */}
        <span className="text-[11px] text-[#5a5760] truncate max-w-[160px] hidden sm:block">
          {criticalLimit.label}
        </span>

        {/* Progress bar + tooltip */}
        <Tooltip content={<TooltipContent limit={criticalLimit} />} side="bottom" delayMs={100}>
          <div className="flex-1 cursor-default min-w-[80px]">
            <Progress value={percent} colorClass={barColor} height={5} />
          </div>
        </Tooltip>

        {/* Percentage badge */}
        <span className={`text-[11px] font-mono font-bold flex-shrink-0 ${textColor}`}>
          {percent.toFixed(1)}%
        </span>

        {/* Expand/collapse all limits */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex-shrink-0 text-[#3a3740] hover:text-[#7a7780] transition-colors ml-1"
          aria-label={expanded ? 'Hide all limits' : 'Show all limits'}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && <AllLimitsPanel limits={allLimits} />}
    </div>
  )
}
