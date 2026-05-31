'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Archestra MCP Gateway — useUsageLimits
// hooks/useUsageLimits.ts
//
// • Manages a list of UsageLimit objects for the active session
// • Derives the critical limit via selectCriticalLimit()
// • Fires toast alerts exactly once per (limitId × threshold) pair
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  UsageLimit,
  ChatSessionContext,
  FiredAlert,
  AlertThreshold,
  ALERT_THRESHOLDS,
  selectCriticalLimit,
  getUsagePercent,
  getThresholdForPercent,
  getResetCountdown,
  LIMIT_KIND_LABELS,
  SCOPE_LABELS,
  formatUsage,
} from '@/lib/limits'
import { useToast } from '@/hooks/useToast'

// ---------------------------------------------------------------------------
// Mock data — replace with real API calls in production
// ---------------------------------------------------------------------------

function makeResetsAt(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000)
}

const MOCK_LIMITS: UsageLimit[] = [
  {
    id:             'org-req-day',
    kind:           'requests_per_day',
    scope:          'organization',
    label:          'Acme Corp · Daily requests',
    used:           7_892,
    total:          10_000,
    resetsAt:       makeResetsAt(187),
    organizationId: 'org_acme',
  },
  {
    id:             'ws-req-day',
    kind:           'requests_per_day',
    scope:          'workspace',
    label:          'Engineering Workspace · Daily requests',
    used:           4_532,
    total:          5_000,
    resetsAt:       makeResetsAt(187),
    organizationId: 'org_acme',
    workspaceId:    'ws_eng',
  },
  {
    id:             'user-req-hour',
    kind:           'requests_per_hour',
    scope:          'user',
    label:          'Personal · Hourly requests',
    used:           234,
    total:          1_000,
    resetsAt:       makeResetsAt(38),
    organizationId: 'org_acme',
    workspaceId:    'ws_eng',
  },
  {
    id:             'model-tok-min',
    kind:           'tokens_per_minute',
    scope:          'model',
    label:          'GPT-4o · Tokens / min',
    used:           87_500,
    total:          90_000,
    resetsAt:       makeResetsAt(1),
    organizationId: 'org_acme',
    workspaceId:    'ws_eng',
    modelId:        'gpt-4o',
  },
  {
    id:             'model-tok-day',
    kind:           'tokens_per_day',
    scope:          'model',
    label:          'GPT-4o · Daily tokens',
    used:           1_240_000,
    total:          2_000_000,
    resetsAt:       makeResetsAt(187),
    organizationId: 'org_acme',
    workspaceId:    'ws_eng',
    modelId:        'gpt-4o',
  },
]

const MOCK_CONTEXT: ChatSessionContext = {
  organizationId: 'org_acme',
  workspaceId:    'ws_eng',
  userId:         'usr_thehaayder',
  modelId:        'gpt-4o',
}

// ---------------------------------------------------------------------------
// Toast message builders per threshold
// ---------------------------------------------------------------------------

function buildToastPayload(
  limit:     UsageLimit,
  threshold: AlertThreshold,
  percent:   number,
) {
  const kindLabel  = LIMIT_KIND_LABELS[limit.kind]
  const scopeLabel = SCOPE_LABELS[limit.scope]
  const usage      = formatUsage(limit)
  const reset      = getResetCountdown(limit.resetsAt)

  switch (threshold) {
    case 75:
      return {
        variant:     'warning' as const,
        title:       `Usage warning — ${limit.label}`,
        description: `${kindLabel} at ${percent.toFixed(1)}% (${usage}). ${reset}.`,
        duration:    6_000,
      }
    case 90:
      return {
        variant:     'danger' as const,
        title:       `Approaching limit — ${limit.label}`,
        description: `${scopeLabel} ${kindLabel} at ${percent.toFixed(1)}% (${usage}). ${reset}.`,
        duration:    8_000,
      }
    case 100:
      return {
        variant:     'error' as const,
        title:       `Limit exceeded — ${limit.label}`,
        description: `${scopeLabel} ${kindLabel} exhausted (${usage}). ${reset}.`,
        duration:    0, // sticky
      }
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UsageLimitsReturn {
  limits:         UsageLimit[]
  criticalLimit:  UsageLimit | null
  context:        ChatSessionContext
  /** Imperatively increment a limit's used counter (simulate a request) */
  incrementUsed:  (limitId: string, by?: number) => void
  /** Fire an alert for a specific (limitId, threshold) — idempotent */
  fireAlert:      (limitId: string, threshold: AlertThreshold) => void
  firedAlerts:    FiredAlert[]
}

export function useUsageLimits(): UsageLimitsReturn {
  const { toast } = useToast()
  const [limits, setLimits]         = useState<UsageLimit[]>(MOCK_LIMITS)
  const firedAlerts                 = useRef<FiredAlert[]>([])
  const context                     = MOCK_CONTEXT

  const criticalLimit = selectCriticalLimit(limits, context)

  // ── Threshold monitoring ──────────────────────────────────────────────────
  // Run after every limits update. For each limit, check if it has crossed a
  // new threshold and hasn't had that alert fired yet.
  useEffect(() => {
    limits.forEach((limit) => {
      const percent   = getUsagePercent(limit)
      const threshold = getThresholdForPercent(percent)
      if (!threshold) return

      // Only fire thresholds that have been crossed and not yet fired
      ALERT_THRESHOLDS.forEach((t) => {
        if (t > threshold) return // not yet crossed
        const alreadyFired = firedAlerts.current.some(
          (a) => a.limitId === limit.id && a.threshold === t,
        )
        if (alreadyFired) return

        // Mark as fired before calling toast (avoids double-fire in StrictMode)
        firedAlerts.current = [
          ...firedAlerts.current,
          { limitId: limit.id, threshold: t, firedAt: new Date() },
        ]
        toast(buildToastPayload(limit, t, percent))
      })
    })
  }, [limits, toast])

  // ── Actions ───────────────────────────────────────────────────────────────
  const incrementUsed = useCallback((limitId: string, by = 1) => {
    setLimits((prev) =>
      prev.map((l) =>
        l.id === limitId
          ? { ...l, used: Math.min(l.total, l.used + by) }
          : l,
      ),
    )
  }, [])

  const fireAlert = useCallback(
    (limitId: string, threshold: AlertThreshold) => {
      const limit = limits.find((l) => l.id === limitId)
      if (!limit) return
      const alreadyFired = firedAlerts.current.some(
        (a) => a.limitId === limitId && a.threshold === threshold,
      )
      if (alreadyFired) return
      firedAlerts.current = [
        ...firedAlerts.current,
        { limitId, threshold, firedAt: new Date() },
      ]
      toast(buildToastPayload(limit, threshold, getUsagePercent(limit)))
    },
    [limits, toast],
  )

  return {
    limits,
    criticalLimit,
    context,
    incrementUsed,
    fireAlert,
    firedAlerts: firedAlerts.current,
  }
}
