'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra UI — Toast component
// components/ui/Toast.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { X, AlertTriangle, AlertOctagon, CheckCircle2, Info, ShieldAlert } from 'lucide-react'
import { Toast, ToastVariant, useToast } from '@/hooks/useToast'

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

interface VariantConfig {
  icon:         React.ReactNode
  border:       string
  iconColor:    string
  titleColor:   string
  bar:          string
}

function getConfig(variant: ToastVariant): VariantConfig {
  switch (variant) {
    case 'success':
      return {
        icon:       <CheckCircle2 size={16} />,
        border:     'border-emerald-500/30',
        iconColor:  'text-emerald-400',
        titleColor: 'text-emerald-200',
        bar:        'bg-emerald-500',
      }
    case 'warning':
      return {
        icon:       <AlertTriangle size={16} />,
        border:     'border-amber-500/30',
        iconColor:  'text-amber-400',
        titleColor: 'text-amber-200',
        bar:        'bg-amber-400',
      }
    case 'danger':
      return {
        icon:       <AlertOctagon size={16} />,
        border:     'border-orange-500/30',
        iconColor:  'text-orange-400',
        titleColor: 'text-orange-200',
        bar:        'bg-orange-500',
      }
    case 'error':
      return {
        icon:       <ShieldAlert size={16} />,
        border:     'border-red-500/30',
        iconColor:  'text-red-400',
        titleColor: 'text-red-200',
        bar:        'bg-red-500',
      }
    default:
      return {
        icon:       <Info size={16} />,
        border:     'border-white/10',
        iconColor:  'text-sky-400',
        titleColor: 'text-sky-200',
        bar:        'bg-sky-500',
      }
  }
}

// ---------------------------------------------------------------------------
// Single toast item
// ---------------------------------------------------------------------------

export function ToastItem({ toast }: { toast: Toast }) {
  const { dismiss } = useToast()
  const cfg = getConfig(toast.variant)

  return (
    <div
      className={[
        'relative overflow-hidden w-80 rounded-xl border bg-[#18181f] shadow-2xl',
        'transition-all duration-300',
        cfg.border,
      ].join(' ')}
      role="alert"
    >
      {/* Coloured left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-[3px] ${cfg.bar}`} />

      <div className="flex items-start gap-3 px-4 py-3 pl-5">
        {/* Icon */}
        <span className={`mt-0.5 flex-shrink-0 ${cfg.iconColor}`}>{cfg.icon}</span>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${cfg.titleColor}`}>
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-xs leading-relaxed text-[#8a8490]">
              {toast.description}
            </p>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => dismiss(toast.id)}
          className="flex-shrink-0 mt-0.5 text-[#4a4750] hover:text-[#9a96a0] transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      {/* Auto-dismiss progress stripe */}
      {toast.duration > 0 && (
        <div className="h-[2px] w-full bg-white/5 overflow-hidden">
          <div
            className={`h-full ${cfg.bar} opacity-40`}
            style={{
              animation:            `shrink ${toast.duration}ms linear forwards`,
              transformOrigin:      'left',
            }}
          />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toast container (rendered by ToastProvider)
// ---------------------------------------------------------------------------

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 items-end"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
