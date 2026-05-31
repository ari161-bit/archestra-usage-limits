'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'

const STATUSES = ['Not Started', 'In Progress', 'Submitted', 'Accepted', 'Rejected']

type Status = typeof STATUSES[number]

interface App {
  id: number
  name: string
  deadline: string
  status: Status
  notes: string
}

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Not Started': { bg: '#2a2a2a', color: '#888' },
  'In Progress': { bg: '#1a3a2a', color: '#4ade80' },
  'Submitted': { bg: '#1a1a3a', color: '#818cf8' },
  'Accepted': { bg: '#1a3a1a', color: '#86efac' },
  'Rejected': { bg: '#3a1a1a', color: '#f87171' },
}

export default function TrackerPage() {
  const [apps, setApps] = useState<App[]>([
    { id: 1, name: 'Gates Cambridge Scholarship', deadline: '2026-10-15', status: 'In Progress', notes: 'Need to complete personal statement' },
    { id: 2, name: 'Google Summer of Code', deadline: '2026-11-04', status: 'Not Started', notes: '' },
    { id: 3, name: 'Fulbright Program', deadline: '2026-10-11', status: 'Submitted', notes: 'Submitted on Oct 8' },
  ])
  const [adding, setAdding] = useState(false)
  const [newApp, setNewApp] = useState({ name: '', deadline: '', status: 'Not Started' as Status, notes: '' })

  const addApp = () => {
    if (!newApp.name) return
    setApps(a => [...a, { ...newApp, id: Date.now() }])
    setNewApp({ name: '', deadline: '', status: 'Not Started', notes: '' })
    setAdding(false)
  }

  const removeApp = (id: number) => setApps(a => a.filter(x => x.id !== id))
  const updateStatus = (id: number, status: Status) => setApps(a => a.map(x => x.id === id ? { ...x, status } : x))

  return (
    <div className="min-h-full px-8 py-7" style={{ background: '#0d0d0d' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontFamily: 'Georgia, serif', color: '#e8e2d9', fontWeight: 400 }}>Tracker</h1>
          <p style={{ fontSize: 13, color: '#4a4a4a', marginTop: 4 }}>{apps.length} applications being tracked</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: '#c9a84c', color: '#0d0d0d' }}
        >
          <Plus size={15} /> Add Application
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="mb-5 p-5 rounded-xl" style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <input
              placeholder="Scholarship name"
              value={newApp.name}
              onChange={e => setNewApp(n => ({ ...n, name: e.target.value }))}
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#d0c9be', outline: 'none' }}
            />
            <input
              type="date"
              value={newApp.deadline}
              onChange={e => setNewApp(n => ({ ...n, deadline: e.target.value }))}
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#d0c9be', outline: 'none' }}
            />
            <input
              placeholder="Notes (optional)"
              value={newApp.notes}
              onChange={e => setNewApp(n => ({ ...n, notes: e.target.value }))}
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#d0c9be', outline: 'none' }}
            />
            <select
              value={newApp.status}
              onChange={e => setNewApp(n => ({ ...n, status: e.target.value as Status }))}
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#d0c9be', outline: 'none' }}
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addApp} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#c9a84c', color: '#0d0d0d' }}>Add</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#2a2a2a', color: '#888' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e1e' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#161616', borderBottom: '1px solid #1e1e1e' }}>
              {['Scholarship', 'Deadline', 'Status', 'Notes', ''].map(h => (
                <th key={h} style={{ fontSize: 11, color: '#3d3d3d', fontWeight: 600, letterSpacing: '0.08em', textAlign: 'left', padding: '10px 16px' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apps.map((app, i) => (
              <tr key={app.id} style={{ background: i % 2 === 0 ? '#111' : '#0f0f0f', borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#d0c9be', fontWeight: 500 }}>{app.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#555' }}>{app.deadline || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={app.status}
                    onChange={e => updateStatus(app.id, e.target.value as Status)}
                    style={{
                      fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 6, cursor: 'pointer', outline: 'none',
                      background: STATUS_STYLE[app.status].bg,
                      color: STATUS_STYLE[app.status].color,
                      border: 'none',
                    }}
                  >
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#555' }}>{app.notes || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => removeApp(app.id)} style={{ color: '#333' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
