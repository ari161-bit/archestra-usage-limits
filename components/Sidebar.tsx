'use client'

import { LayoutDashboard, GraduationCap, Brain, Bot, ListChecks, Calendar, BookOpen, Bell, ChevronRight } from 'lucide-react'
import type { Page } from '@/app/page'

const NAV_MAIN = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scholarships', label: 'Scholarships', icon: GraduationCap, badge: 37 },
  { id: 'second-brain', label: 'Second Brain', icon: Brain },
  { id: 'ai-coach', label: 'AI Coach', icon: Bot },
]

const NAV_TRACK = [
  { id: 'tracker', label: 'Tracker', icon: ListChecks },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'notes', label: 'Notes & Library', icon: BookOpen },
  { id: 'alerts', label: 'Alerts', icon: Bell },
]

interface Props {
  active: Page
  onNavigate: (p: Page) => void
}

export default function Sidebar({ active, onNavigate }: Props) {
  return (
    <aside
      className="w-52 flex-shrink-0 flex flex-col h-screen border-r"
      style={{ background: '#111111', borderColor: '#1e1e1e' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-1.5">
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#e8c97e', fontStyle: 'italic', fontWeight: 400 }}>
            path
          </span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#c9a84c', fontStyle: 'italic', fontWeight: 700 }}>
            finder
          </span>
        </div>
        <div style={{ fontSize: 10, color: '#4a4a4a', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
          scholarship intelligence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto">
        <div>
          <div style={{ fontSize: 10, color: '#3a3a3a', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, paddingLeft: 8, marginBottom: 4 }}>
            MAIN
          </div>
          {NAV_MAIN.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => onNavigate(id as Page)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all group"
              style={{
                background: active === id ? '#1e1e1e' : 'transparent',
                color: active === id ? '#e8e2d9' : '#5a5a5a',
                borderLeft: active === id ? '2px solid #c9a84c' : '2px solid transparent',
              }}
            >
              <Icon size={15} style={{ color: active === id ? '#c9a84c' : '#4a4a4a', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: active === id ? 500 : 400 }}>{label}</span>
              {badge && (
                <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-md" style={{ background: '#1e2a1e', color: '#4ade80', fontSize: 10 }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 10, color: '#3a3a3a', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, paddingLeft: 8, marginBottom: 4 }}>
            TRACK
          </div>
          {NAV_TRACK.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id as Page)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all"
              style={{
                background: active === id ? '#1e1e1e' : 'transparent',
                color: active === id ? '#e8e2d9' : '#5a5a5a',
                borderLeft: active === id ? '2px solid #c9a84c' : '2px solid transparent',
              }}
            >
              <Icon size={15} style={{ color: active === id ? '#c9a84c' : '#4a4a4a', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: active === id ? 500 : 400 }}>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#1e1e1e' }}>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: '#1a1a1a' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#2a2a1a', color: '#c9a84c', border: '1px solid #3a3a2a' }}>
            T
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 12, color: '#d0c9be', fontWeight: 500 }}>thehaayder</div>
            <div style={{ fontSize: 10, color: '#4a4a4a' }}>Signed in</div>
          </div>
          <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: '#2a1a00', color: '#f0a020', fontSize: 9, border: '1px solid #3a2a00' }}>
            PRO
          </span>
        </div>
      </div>
    </aside>
  )
}
