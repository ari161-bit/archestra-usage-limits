'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DEADLINES = [
  { date: '2026-10-11', name: 'Fulbright Program', color: '#818cf8' },
  { date: '2026-10-15', name: 'Gates Cambridge', color: '#4ade80' },
  { date: '2026-11-04', name: 'Google Summer of Code', color: '#fbbf24' },
  { date: '2026-11-05', name: 'Chevening', color: '#f87171' },
  { date: '2026-11-30', name: 'HackerEarth Hackathon', color: '#c9a84c' },
  { date: '2026-12-15', name: 'HEC Overseas', color: '#c9a84c' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function CalendarPage() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(9) // October

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const getDeadlines = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return DEADLINES.filter(d => d.date === dateStr)
  }

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div className="min-h-full px-8 py-7" style={{ background: '#0d0d0d' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: 28, fontFamily: 'Georgia, serif', color: '#e8e2d9', fontWeight: 400 }}>Calendar</h1>
        <div className="flex items-center gap-3">
          <button onClick={prev} style={{ color: '#555', padding: 6 }}><ChevronLeft size={18} /></button>
          <span style={{ fontSize: 16, color: '#d0c9be', fontWeight: 500, minWidth: 160, textAlign: 'center' }}>{MONTHS[month]} {year}</span>
          <button onClick={next} style={{ color: '#555', padding: 6 }}><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e1e' }}>
        {/* Day headers */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', background: '#161616', borderBottom: '1px solid #1e1e1e' }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', padding: '10px 0', fontSize: 11, color: '#3d3d3d', fontWeight: 600, letterSpacing: '0.08em' }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} style={{ minHeight: 100, background: '#0d0d0d', borderRight: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }} />
          ))}
          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dl = getDeadlines(day)
            return (
              <div key={day} style={{ minHeight: 100, background: '#111', borderRight: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: 8 }}>
                <div style={{ fontSize: 12, color: '#3d3d3d', marginBottom: 6 }}>{day}</div>
                {dl.map(d => (
                  <div key={d.name} style={{ fontSize: 10, background: '#1a1a1a', color: d.color, border: `1px solid ${d.color}33`, borderRadius: 4, padding: '2px 5px', marginBottom: 3, lineHeight: 1.4 }}>
                    {d.name}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4">
        {DEADLINES.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span style={{ fontSize: 12, color: '#555' }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
