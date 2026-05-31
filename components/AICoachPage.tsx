'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  'Which scholarships match my profile best?',
  'Review my Gates Cambridge SOP',
  'What should I focus on this week?',
  'How do I stand out for Fulbright?',
]

const RESPONSES: Record<string, string> = {
  default: "I'm your AI scholarship coach! I can help you with application strategy, essay reviews, deadline planning, and finding scholarships that match your profile. What would you like to work on today?",
  match: "Based on your profile, your top 3 matches are:\n\n1. **HEC Overseas Scholarship** (97% match) — Your academic background aligns perfectly. Apply before Dec 15.\n2. **Gates Cambridge** (91% match) — Strong research profile needed. Your AI ethics work is a plus.\n3. **Fulbright Program** (85% match) — Focus on cultural exchange narrative.\n\nWant me to help you prioritize which to apply to first?",
  sop: "For your Gates Cambridge SOP, focus on these 4 elements:\n\n• **Research vision** — What problem are you solving and why does it matter globally?\n• **Why Cambridge** — Specific faculty, labs, or programs that align with your goals.\n• **Impact** — How will this degree amplify your contribution to society?\n• **Fit** — Cambridge values leadership and intellectual curiosity.\n\nShare your current draft and I'll give you specific feedback!",
  week: "This week's priority tasks:\n\n✅ Gates Cambridge deadline in 137 days — start your SOP now\n⚡ Fulbright deadline is closest (133 days) — check your essays\n📋 Complete your profile preferences to get better matches\n🤖 Schedule your recommenders — give them at least 6 weeks\n\nFocus on Fulbright first since it's the earliest deadline!",
  fulbright: "To stand out for Fulbright:\n\n1. **Cultural ambassador angle** — You're representing your country, not just getting a degree\n2. **Clear return plan** — Show how you'll apply your US experience at home\n3. **Leadership evidence** — Community projects, volunteer work, or initiatives\n4. **Specificity** — Name your host university, professors, and research goals\n\nThe strongest Fulbright essays are personal stories, not academic CVs. What's your unique story?",
}

function getResponse(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('match') || t.includes('profile')) return RESPONSES.match
  if (t.includes('sop') || t.includes('statement') || t.includes('gates') || t.includes('review')) return RESPONSES.sop
  if (t.includes('week') || t.includes('focus') || t.includes('priority')) return RESPONSES.week
  if (t.includes('fulbright') || t.includes('stand out')) return RESPONSES.fulbright
  return RESPONSES.default
}

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', text: RESPONSES.default },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = (text?: string) => {
    const msg = text ?? input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(m => [...m, { id: Date.now(), role: 'user', text: msg }])
    setLoading(true)
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', text: getResponse(msg) }])
      setLoading(false)
    }, 900)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#0d0d0d' }}>
      {/* Header */}
      <div className="px-8 py-5 border-b" style={{ borderColor: '#1e1e1e', background: '#111' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1a2a1a' }}>
            <Bot size={18} style={{ color: '#4ade80' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#e8e2d9' }}>AI Coach</div>
            <div style={{ fontSize: 11, color: '#3d3d3d' }}>Your personal scholarship strategist · Always available</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
            <span style={{ fontSize: 11, color: '#4ade80' }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: m.role === 'assistant' ? '#1a2a1a' : '#2a1a00' }}>
              {m.role === 'assistant' ? <Bot size={15} style={{ color: '#4ade80' }} /> : <User size={15} style={{ color: '#c9a84c' }} />}
            </div>
            <div
              className="rounded-2xl px-4 py-3 max-w-lg"
              style={{
                background: m.role === 'assistant' ? '#161616' : '#1e1a0f',
                border: `1px solid ${m.role === 'assistant' ? '#2a2a2a' : '#3a2a10'}`,
                fontSize: 13,
                color: '#d0c9be',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#1a2a1a' }}>
              <Bot size={15} style={{ color: '#4ade80' }} />
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#3a3a3a', animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-8 pb-3 flex gap-2 flex-wrap">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => send(s)}
            style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: '#161616', color: '#555', border: '1px solid #222' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-8 pb-7">
        <div className="flex gap-3 items-end rounded-2xl p-3" style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
          <textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask your AI Coach anything..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#d0c9be', resize: 'none', lineHeight: 1.5 }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: input.trim() ? '#c9a84c' : '#1e1e1e', color: input.trim() ? '#0d0d0d' : '#333' }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
