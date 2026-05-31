'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra UI — Tooltip (no external deps)
// components/ui/Tooltip.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, ReactNode, CSSProperties } from 'react'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  content:    ReactNode
  children:   ReactNode
  side?:      TooltipSide
  className?: string
  /** Delay before showing in ms */
  delayMs?:   number
}

const SIDE_STYLES: Record<TooltipSide, CSSProperties> = {
  top:    { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  bottom: { top:    'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  left:   { right:  'calc(100% + 8px)', top:  '50%', transform: 'translateY(-50%)' },
  right:  { left:   'calc(100% + 8px)', top:  '50%', transform: 'translateY(-50%)' },
}

export function Tooltip({
  content,
  children,
  side      = 'top',
  className = '',
  delayMs   = 200,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), delayMs)
  }
  const hide = () => {
    if (timer.current) clearTimeout(timer.current)
    setVisible(false)
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={[
            'absolute z-50 pointer-events-none',
            'rounded-lg border border-white/10 bg-[#1c1c22] shadow-xl',
            'px-3 py-2 text-xs text-[#c9c4bc] whitespace-nowrap',
            'animate-in fade-in-0 zoom-in-95 duration-100',
            className,
          ].join(' ')}
          style={SIDE_STYLES[side]}
        >
          {content}
        </span>
      )}
    </span>
  )
}
