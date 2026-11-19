'use client'

import { useState } from 'react'
import { Search, ArrowRight, CheckCircle2, Circle, Flame, TrendingUp, ExternalLink } from 'lucide-react'
import type { Page } from '@/lib/navigation'

const APPLICATIONS = [
  { id: 1, name: 'Gates Cambridge Scholarship', date: 'Oct 15, 2026', days: 137, status: 'In Progress', statusColor: '#1a3a2a', statusText: '#4ade80', dot: '#4ade80' },
  { id: 2, name: 'Google Summer of Code', date: 'Nov 4, 2026', days: 157, status: 'Not Started', statusColor: '#2a2a2a', statusText: '#888', dot: '#555' },
  { id: 3, name: 'Fulbright Program', date: 'Oct 11, 2026', days: 133, status: 'Submitted', statusColor: '#1a1a3a', statusText: '#818cf8', dot: '#818cf8' },
]

const TOP_MATCHES = [
  { score: 97, name: 'HEC Overseas Scholarship (Pakistan)', org: 'Higher Education Commission Pakistan', tags: ['Masters', 'PhD'], color: '#c9a84c' },
  { score: 93, name: 'HackerEarth Global Hackathon', org: 'HackerEarth', tags: ['Coding', 'AI'], color: '#c9a84c' },
  { score: 89, name: 'Commonwealth Scholarship', org: 'Commonwealth Scholarship Commission', tags: ['Masters', 'UK'], color: '#888' },
  { score: 85, name: 'Chevening Scholarship', org: 'UK Government', tags: ['Masters', 'Leadership'], color: '#888' },
]

const STREAK_DAYS = 14

interface Props { onNavigate: (p: Page) => void }

export default function Dashboard({ onNavigate }: Props) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete profile preferences', done: false, priority: true },
    { id: 2, text: 'AI Coach weekly check-in', done: false, priority: false },
  ])
  const [search, setSearch] = useState('')

  const toggleTask = (id: number) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x))
  const doneCount = tasks.filter(t => t.done).length
  const pct = Math.round((doneCount / tasks.length) * 100)

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()

  return (
    <div className="min-h-full px-8 py-7" style={{ background: '#0d0d0d' }}>

      {/* Header row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div style={{ fontSize: 11, color: '#3d3d3d', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 8 }}>{dateStr}</div>
          <h1 style={{ fontSize: 38, fontFamily: 'Georgia, serif', fontWeight: 400, color: '#e8e2d9', lineHeight: 1.15 }}>
            Good morning, <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>thehaayder.</em>
          </h1>
          <p style={{ fontSize: 14, color: '#4a4a4a', marginTop: 8 }}>
            You have <span style={{ color: '#e8e2d9' }}>{tasks.length - doneCount} tasks</span> remaining today and{' '}
            <span style={{ color: '#c9a84c', fontWeight: 500 }}>23 new matches</span> waiting.
          </p>
        </div>
        {/* Search */}
        <div className="relative mt-1">
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3a3a3a' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search or ask anything"
            style={{
              background: '#161616', border: '1px solid #222', borderRadius: 8,
              padding: '8px 40px 8px 34px', fontSize: 13, color: '#9a9a9a',
              outline: 'none', width: 220,
            }}
          />
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#333', background: '#1e1e1e', padding: '1px 5px', borderRadius: 4, border: '1px solid #2a2a2a' }}>
            Ctrl K
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { val: '23', label: 'New Matches', sub: 'updated just now', valColor: '#c9a84c' },
          { val: '1', label: 'Active Tracking', sub: 'in progress', valColor: '#818cf8' },
          { val: '0', label: 'Saved', sub: 'save to track', valColor: '#e8e2d9' },
          { val: '0', label: 'Day Streak', sub: 'keep it going', valColor: '#f87171' },
        ].map(({ val, label, sub, valColor }) => (
          <div key={label} className="rounded-xl p-5" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            <div style={{ fontSize: 40, fontFamily: 'Georgia, serif', fontWeight: 400, color: valColor, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 13, color: '#e8e2d9', marginTop: 6, fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#3d3d3d', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Three-column main */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1.4fr 1fr' }}>

        {/* Action Plan */}
        <div className="rounded-xl p-5" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e8e2d9' }}>Action Plan</span>
            <span style={{ fontSize: 11, color: '#3d3d3d' }}>{doneCount} of {tasks.length} done</span>
          </div>

          {/* Progress bar */}
          <div className="mb-1 flex justify-between items-center">
            <span style={{ fontSize: 11, color: '#3d3d3d' }}>Progress</span>
            <span style={{ fontSize: 11, color: pct > 0 ? '#c9a84c' : '#3d3d3d' }}>{pct}%</span>
          </div>
          <div className="rounded-full mb-5" style={{ height: 3, background: '#1e1e1e' }}>
            <div className="rounded-full transition-all" style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #c9a84c, #e8c97e)' }} />
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 text-left group"
              >
                {task.done
                  ? <CheckCircle2 size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
                  : <Circle size={16} style={{ color: '#333', flexShrink: 0 }} />
                }
                <span style={{ fontSize: 13, color: task.done ? '#3d3d3d' : '#b0a99a', textDecoration: task.done ? 'line-through' : 'none', flex: 1 }}>
                  {task.text}
                </span>
                {task.priority && !task.done && (
                  <span style={{ fontSize: 9, background: '#2a1a00', color: '#f0a020', border: '1px solid #3a2a00', borderRadius: 4, padding: '1px 5px', fontWeight: 700, letterSpacing: '0.05em' }}>
                    PRIORITY
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('tracker')}
            className="mt-5 text-xs"
            style={{ color: '#3d3d3d', textDecoration: 'underline' }}
          >
            View your tracker
          </button>
        </div>

        {/* Priority Applications */}
        <div className="rounded-xl p-5" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e8e2d9' }}>Priority Applications</span>
            <button onClick={() => onNavigate('tracker')} style={{ fontSize: 12, color: '#c9a84c', display: 'flex', alignItems: 'center', gap: 4 }}>
              View Tracker <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {APPLICATIONS.map(app => (
              <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#161616' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: app.dot }} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, color: '#d0c9be', fontWeight: 500 }}>{app.name}</div>
                  <div style={{ fontSize: 11, color: '#3d3d3d', marginTop: 1 }}>{app.date} · {app.days} days</div>
                </div>
                <span className="text-xs rounded-md px-2 py-1 flex-shrink-0" style={{ background: app.statusColor, color: app.statusText, fontWeight: 500, fontSize: 11 }}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>

          {/* Top Matches */}
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e8e2d9' }}>Top Matches</span>
            <button onClick={() => onNavigate('scholarships')} style={{ fontSize: 12, color: '#c9a84c', display: 'flex', alignItems: 'center', gap: 4 }}>
              Explore <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {TOP_MATCHES.map(m => (
              <div key={m.name} className="flex items-start gap-3">
                <div style={{ fontSize: 22, fontFamily: 'Georgia, serif', color: m.color, fontWeight: 400, lineHeight: 1, minWidth: 34, textAlign: 'right' }}>
                  {m.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, color: '#d0c9be', fontWeight: 500, lineHeight: 1.3 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#3d3d3d', marginTop: 2 }}>{m.org}</div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {m.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, background: '#1e1e1e', color: '#555', border: '1px solid #2a2a2a', borderRadius: 4, padding: '1px 6px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Streak + Activity */}
        <div className="space-y-5">

          {/* Current Streak */}
          <div className="rounded-xl p-5" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#e8e2d9' }}>Current Streak</span>
              <span style={{ fontSize: 11, color: '#3d3d3d' }}>0 days active</span>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 12 }}>
              {Array.from({ length: STREAK_DAYS }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{ height: 14, background: i === 0 ? '#3a2a1a' : '#1a1a1a', border: i === 0 ? '1px solid #5a3a1a' : '1px solid #222' }}
                />
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#3d3d3d' }}>Each square is a day. Keep showing up.</div>
          </div>

          {/* Activity Overview */}
          <div className="rounded-xl p-5" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#e8e2d9' }}>Activity Overview</span>
              <button style={{ fontSize: 11, color: '#c9a84c', display: 'flex', alignItems: 'center', gap: 3 }}>
                Full History <ArrowRight size={11} />
              </button>
            </div>

            {/* Mini chart */}
            <div className="flex items-end gap-1 mb-4" style={{ height: 60 }}>
              {[20, 45, 30, 60, 25, 80, 40, 55, 35, 70, 50, 90, 45, 30].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 13 ? '#c9a84c' : '#1e1e1e' }} />
              ))}
            </div>

            <div style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.6 }}>
              <span style={{ color: '#d0c9be' }}>3</span> total apps tracked.{' '}
              <span style={{ color: '#d0c9be' }}>1</span> currently active.
            </div>
            <div style={{ fontSize: 12, color: '#3d3d3d', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={12} style={{ color: '#4ade80' }} />
              Keep pushing forward.
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl p-5" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e8e2d9', marginBottom: 12 }}>Quick Actions</div>
            <div className="space-y-2">
              {[
                { label: 'Browse Scholarships', action: 'scholarships' as Page, icon: '🎓' },
                { label: 'Chat with AI Coach', action: 'ai-coach' as Page, icon: '🤖' },
                { label: 'Update Tracker', action: 'tracker' as Page, icon: '📋' },
              ].map(({ label, action, icon }) => (
                <button
                  key={label}
                  onClick={() => onNavigate(action)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                  style={{ background: '#161616', border: '1px solid #222' }}
                >
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
                  <ExternalLink size={11} style={{ color: '#333', marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
