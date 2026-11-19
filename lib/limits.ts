// ─────────────────────────────────────────────────────────────────────────────
// Archestra MCP Gateway — Usage Limits Core
// lib/limits.ts
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export type LimitKind =
  | 'requests_per_minute'
  | 'requests_per_hour'
  | 'requests_per_day'
  | 'tokens_per_minute'
  | 'tokens_per_hour'
  | 'tokens_per_day'
  | 'tokens_per_month'
  | 'concurrent_requests'

export const LIMIT_KIND_LABELS: Record<LimitKind, string> = {
  requests_per_minute:  'Requests / min',
  requests_per_hour:    'Requests / hour',
  requests_per_day:     'Requests / day',
  tokens_per_minute:    'Tokens / min',
  tokens_per_hour:      'Tokens / hour',
  tokens_per_day:       'Tokens / day',
  tokens_per_month:     'Tokens / month',
  concurrent_requests:  'Concurrent requests',
}

export const LIMIT_KIND_ICONS: Record<LimitKind, string> = {
  requests_per_minute:  '⚡',
  requests_per_hour:    '🔁',
  requests_per_day:     '📅',
  tokens_per_minute:    '🪙',
  tokens_per_hour:      '🕐',
  tokens_per_day:       '📊',
  tokens_per_month:     '📆',
  concurrent_requests:  '🔀',
}

/** Hierarchy: organisation is broadest, model is narrowest. */
export type LimitScope = 'organization' | 'workspace' | 'user' | 'model'

export const SCOPE_HIERARCHY: readonly LimitScope[] = [
  'organization',
  'workspace',
  'user',
  'model',
] as const

export const SCOPE_LABELS: Record<LimitScope, string> = {
  organization: 'Organization',
  workspace:    'Workspace',
  user:         'User',
  model:        'Model',
}

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export interface UsageLimit {
  readonly id:             string
  readonly kind:           LimitKind
  readonly scope:          LimitScope
  readonly label:          string
  used:                    number
  readonly total:          number
  /** null = this limit never resets (e.g. concurrent_requests) */
  readonly resetsAt:       Date | null
  readonly modelId?:       string
  readonly workspaceId?:   string
  readonly organizationId?: string
}

export interface ChatSessionContext {
  readonly organizationId: string
  readonly workspaceId:    string
  readonly userId:         string
  readonly modelId:        string
}

export interface RateLimitError {
  readonly limitId:      string
  readonly kind:         LimitKind
  readonly scope:        LimitScope
  readonly label:        string
  readonly used:         number
  readonly total:        number
  readonly resetsAt:     Date | null
  readonly retryAfterMs: number
  readonly requestId?:   string
}

export type AlertThreshold = 75 | 90 | 100

export const ALERT_THRESHOLDS: readonly AlertThreshold[] = [75, 90, 100] as const

export interface FiredAlert {
  readonly limitId:    string
  readonly threshold:  AlertThreshold
  readonly firedAt:    Date
}

// ---------------------------------------------------------------------------
// Algorithm: selectCriticalLimit
//
// From all limits that apply to the current session context, returns the one
// with the least remaining capacity (i.e. highest % used). On an exact tie in
// remaining count, the broader scope wins (org beats workspace beats user).
// ---------------------------------------------------------------------------

export function selectCriticalLimit(
  limits:  readonly UsageLimit[],
  context: ChatSessionContext,
): UsageLimit | null {
  const applicable = limits.filter((limit) => {
    // A limit applies when every scoping field it carries matches the context.
    if (limit.organizationId !== undefined && limit.organizationId !== context.organizationId) return false
    if (limit.workspaceId    !== undefined && limit.workspaceId    !== context.workspaceId)    return false
    if (limit.modelId        !== undefined && limit.modelId        !== context.modelId)        return false
    return true
  })

  if (applicable.length === 0) return null

  return applicable.reduce((critical, limit) => {
    const criticalRemaining = critical.total - critical.used
    const limitRemaining    = limit.total    - limit.used

    // Primary sort: fewest remaining = most critical
    if (limitRemaining < criticalRemaining) return limit
    if (limitRemaining > criticalRemaining) return critical

    // Tie-break: broader scope takes precedence (lower index in hierarchy)
    const criticalIdx = SCOPE_HIERARCHY.indexOf(critical.scope)
    const limitIdx    = SCOPE_HIERARCHY.indexOf(limit.scope)
    return limitIdx < criticalIdx ? limit : critical
  })
}

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

export function getUsagePercent(limit: UsageLimit): number {
  if (limit.total === 0) return 100
  return Math.min(100, Math.round((limit.used / limit.total) * 1000) / 10)
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export function formatUsage(limit: UsageLimit): string {
  return `${formatCount(limit.used)} / ${formatCount(limit.total)}`
}

export function getResetCountdown(resetsAt: Date | null): string {
  if (resetsAt === null) return 'never resets'

  const ms = resetsAt.getTime() - Date.now()
  if (ms <= 0) return 'resetting now'

  const totalSec = Math.floor(ms / 1000)
  if (totalSec < 60)   return `resets in ${totalSec}s`

  const minutes = Math.floor(totalSec / 60)
  if (minutes < 60)    return `resets in ${minutes}m ${totalSec % 60}s`

  const hours = Math.floor(minutes / 60)
  if (hours < 24)      return `resets in ${hours}h ${minutes % 60}m`

  const days = Math.floor(hours / 24)
  return `resets in ${days}d ${hours % 24}h`
}

/**
 * Returns the highest threshold the given percentage has crossed,
 * or null if below 75%.
 */
export function getThresholdForPercent(percent: number): AlertThreshold | null {
  if (percent >= 100) return 100
  if (percent >= 90)  return 90
  if (percent >= 75)  return 75
  return null
}

export function getLimitBarColor(percent: number): string {
  if (percent >= 100) return 'bg-red-500'
  if (percent >= 90)  return 'bg-orange-500'
  if (percent >= 75)  return 'bg-amber-400'
  return 'bg-emerald-500'
}

export function getLimitTextColor(percent: number): string {
  if (percent >= 100) return 'text-red-400'
  if (percent >= 90)  return 'text-orange-400'
  if (percent >= 75)  return 'text-amber-400'
  return 'text-emerald-400'
}

export function getLimitBadgeStyle(percent: number): { bg: string; text: string; border: string } {
  if (percent >= 100) return { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/30' }
  if (percent >= 90)  return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' }
  if (percent >= 75)  return { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/30' }
  return               { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' }
}
