'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra UI — Toast Provider
// components/ui/ToastProvider.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { ReactNode } from 'react'
import { ToastContext, useToastState } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

export function ToastProvider({ children }: { children: ReactNode }) {
  const state = useToastState()

  return (
    <ToastContext.Provider value={state}>
      {children}
      <ToastContainer toasts={state.toasts} />
    </ToastContext.Provider>
  )
}
