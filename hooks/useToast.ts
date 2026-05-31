'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra MCP Gateway — Toast System
// hooks/useToast.ts
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useReducer, useCallback, useRef, ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger' | 'error'

export interface Toast {
  readonly id:           string
  readonly variant:      ToastVariant
  readonly title:        string
  readonly description?: string
  readonly duration:     number   // ms; 0 = sticky
  readonly createdAt:    number
}

export type ToastInput = Omit<Toast, 'id' | 'createdAt'>

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action =
  | { type: 'ADD';    toast: Toast }
  | { type: 'REMOVE'; id: string  }
  | { type: 'CLEAR'               }

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case 'ADD':    return [action.toast, ...state].slice(0, 5) // cap at 5
    case 'REMOVE': return state.filter((t) => t.id !== action.id)
    case 'CLEAR':  return []
    default:       return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ToastContextValue {
  toasts:  Toast[]
  toast:   (input: ToastInput) => string
  dismiss: (id: string) => void
  clear:   () => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider hook (used inside ToastProvider)
// ---------------------------------------------------------------------------

let counter = 0
function nextId(): string {
  return `toast-${++counter}-${Date.now()}`
}

export function useToastState(): ToastContextValue {
  const [toasts, dispatch] = useReducer(reducer, [])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    dispatch({ type: 'REMOVE', id })
  }, [])

  const toast = useCallback(
    (input: ToastInput): string => {
      const id = nextId()
      dispatch({ type: 'ADD', toast: { ...input, id, createdAt: Date.now() } })
      if (input.duration > 0) {
        const timer = setTimeout(() => dismiss(id), input.duration)
        timers.current.set(id, timer)
      }
      return id
    },
    [dismiss],
  )

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current.clear()
    dispatch({ type: 'CLEAR' })
  }, [])

  return { toasts, toast, dismiss, clear }
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
