# Archestra usage limits

A prototype of the usage-limit UX for an MCP gateway chat, built for Archestra issue #4758. It shows people how close they are to their limits before a request fails, instead of after.

**Live:** https://inventory-ruby-chi.vercel.app

## What it does

- **Usage bar** in the chat header shows the limit you're closest to hitting. Hover it for used/total, limit type and reset time; expand it to see every limit.
- **Alerts** pop up once each at 75%, 90% and 100% of a limit.
- **Rate-limit card** replaces a bare 429 error with which limit was hit and when it resets.
- When several limits apply, the one with the fewest units left wins; ties go to the wider scope (org > workspace > user > model).

The chat itself is simulated, so you can send messages and watch the limits fill up.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, lucide-react. No backend.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/page.tsx                    renders the chat
components/chat/                ChatInterface, UsageProgressBar, RateLimitErrorCard, input, messages
components/ui/                  Progress, Tooltip, Toast
hooks/useUsageLimits.ts         limit state and threshold alerts
hooks/useChatSession.ts         simulated streaming chat with 429s
lib/limits.ts                   limit types and selectCriticalLimit()
```

Older components from earlier versions of this repo (invoice generator, scholarship dashboard) are still in `components/` but aren't used by the current page.
