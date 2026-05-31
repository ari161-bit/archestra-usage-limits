'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra UI — Progress Bar primitive
// components/ui/Progress.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { CSSProperties } from 'react'

interface ProgressProps {
  /** 0–100 */
  value:       number
  /** Tailwind bg-* class for the fill */
  colorClass:  string
  className?:  string
  animated?:   boolean
  height?:     number
}

export function Progress({
  value,
  colorClass,
  className   = '',
  animated    = true,
  height      = 4,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const isPulsing = clamped >= 100 && animated

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full overflow-hidden rounded-full bg-white/[0.06] ${className}`}
      style={{ height }}
    >
      <div
        className={[
          'h-full rounded-full transition-all duration-700 ease-out',
          colorClass,
          isPulsing ? 'animate-pulse' : '',
        ].join(' ')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
