'use client'

import { useState } from 'react'
import { Plus, Trash2, Search } from 'lucide-react'

interface Note {
  id: number
  title: string
  content: string
  tag: string
  createdAt: string
}

const TAGS = ['All', 'Research', 'SOP', 'Essays', 'Tips', 'Requirements']

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Gates Cambridge — SOP Draft', content: 'Focus on research impact and global contribution. Mention AI ethics project and community work.', tag: 'SOP', createdAt: 'Oct 2, 2026' },
    { id: 2, title: 'Fulbright Tips', content: 'US cultural exchange aspect is critical. Talk about bringing knowledge back to home country.', tag: 'Tips', createdAt: 'Sep 28, 2026' },
    { id: 3, title: 'Recommender Requirements', content: 'Gates: 3 academic refs. Fulbright: 2 refs. Chevening: no refs at initial stage.', tag: 'Requirements', createdAt: 'Sep 20, 2026' },
  ])
  const [selected, setSelected] = useState<Note | null>(notes[0])
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(false)

  const filtered = notes.filter(n => {
    const matchQ = n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase())
    const matchF = filter === 'All' || n.tag === filter
    return matchQ && matchF
  })

  const addNote = () => {
    const n: Note = { id: Date.now(), title: 'New Note', content: '', tag: 'Research', createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
    setNotes(prev => [n, ...prev])
    setSelected(n)
    setEditing(true)
  }

  const updateSelected = (field: keyof Note, val: string) => {
    if (!selected) return
    const updated = { ...selected, [field]: val }
    setSelected(updated)
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
  }

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    setSelected(null)
  }

  return (
    <div className="flex h-full" style={{ background: '#0d0d0d' }}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: '#1e1e1e', background: '#111' }}>
        <div className="p-4 border-b" style={{ borderColor: '#1e1e1e' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e8e2d9' }}>Notes & Library</span>
            <button onClick={addNote} style={{ color: '#c9a84c' }}><Plus size={16} /></button>
          </div>
          <div className="relative">
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes..."
              style={{ background: '#161616', border: '1px solid #222', borderRadius: 7, padding: '7px 10px 7px 30px', fontSize: 12, color: '#888', outline: 'none', width: '100%' }}
            />
          </div>
        </div>
        <div className="flex gap-1.5 px-3 py-2 flex-wrap" style={{ borderBottom: '1px solid #1e1e1e' }}>
          {TAGS.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: filter === t ? '#c9a84c' : '#1e1e1e', color: filter === t ? '#0d0d0d' : '#555', border: 'none', fontWeight: 500 }}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.map(n => (
            <button
              key={n.id}
              onClick={() => { setSelected(n); setEditing(false) }}
              className="w-full text-left px-4 py-3 transition-all"
              style={{ background: selected?.id === n.id ? '#1a1a1a' : 'transparent', borderLeft: selected?.id === n.id ? '2px solid #c9a84c' : '2px solid transparent' }}
            >
              <div style={{ fontSize: 12, color: '#d0c9be', fontWeight: 500 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: '#3d3d3d', marginTop: 2 }}>{n.tag} · {n.createdAt}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {selected ? (
        <div className="flex-1 flex flex-col p-8">
          <div className="flex items-center justify-between mb-6">
            <input
              value={selected.title}
              onChange={e => updateSelected('title', e.target.value)}
              style={{ fontSize: 22, fontFamily: 'Georgia, serif', color: '#e8e2d9', background: 'transparent', border: 'none', outline: 'none', flex: 1 }}
            />
            <button onClick={() => deleteNote(selected.id)} style={{ color: '#333' }}><Trash2 size={16} /></button>
          </div>
          <div style={{ fontSize: 11, color: '#3d3d3d', marginBottom: 16 }}>{selected.tag} · {selected.createdAt}</div>
          <textarea
            value={selected.content}
            onChange={e => updateSelected('content', e.target.value)}
            placeholder="Start writing..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#9a9a9a', lineHeight: 1.8, resize: 'none' }}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div style={{ textAlign: 'center', color: '#2a2a2a' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <div style={{ fontSize: 14 }}>Select a note or create a new one</div>
          </div>
        </div>
      )}
    </div>
  )
}
