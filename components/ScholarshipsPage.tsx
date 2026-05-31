'use client'

import { useState } from 'react'
import { Search, Filter, Star, BookmarkPlus, ExternalLink } from 'lucide-react'

const SCHOLARSHIPS = [
  { id: 1, score: 97, name: 'HEC Overseas Scholarship (Pakistan)', org: 'Higher Education Commission Pakistan', tags: ['Masters', 'PhD'], deadline: 'Dec 15, 2026', amount: '$25,000/yr', saved: false },
  { id: 2, score: 93, name: 'HackerEarth Global Hackathon', org: 'HackerEarth', tags: ['Coding', 'AI'], deadline: 'Nov 30, 2026', amount: '$10,000', saved: false },
  { id: 3, score: 91, name: 'Gates Cambridge Scholarship', org: 'Gates Foundation', tags: ['PhD', 'Research'], deadline: 'Oct 15, 2026', amount: 'Full Funding', saved: true },
  { id: 4, score: 89, name: 'Commonwealth Scholarship', org: 'Commonwealth Scholarship Commission', tags: ['Masters', 'UK'], deadline: 'Jan 20, 2027', amount: 'Full Funding', saved: false },
  { id: 5, score: 87, name: 'Chevening Scholarship', org: 'UK Government / FCO', tags: ['Masters', 'Leadership'], deadline: 'Nov 5, 2026', amount: 'Full Funding', saved: false },
  { id: 6, score: 85, name: 'Fulbright Program', org: 'US State Department', tags: ['Masters', 'Research', 'USA'], deadline: 'Oct 11, 2026', amount: 'Full Funding', saved: true },
  { id: 7, score: 82, name: 'DAAD Scholarships', org: 'German Academic Exchange Service', tags: ['Masters', 'PhD', 'Germany'], deadline: 'Jan 15, 2027', amount: '€850/month', saved: false },
  { id: 8, score: 78, name: 'Google Summer of Code', org: 'Google', tags: ['Coding', 'Open Source'], deadline: 'Nov 4, 2026', amount: '$6,000', saved: false },
  { id: 9, score: 75, name: 'Erasmus Mundus', org: 'European Commission', tags: ['Masters', 'Europe'], deadline: 'Jan 10, 2027', amount: '€1,400/month', saved: false },
  { id: 10, score: 73, name: 'Aga Khan Foundation Scholarship', org: 'Aga Khan Foundation', tags: ['Masters', 'Pakistan'], deadline: 'Dec 31, 2026', amount: '50% Grant', saved: false },
]

const FILTERS = ['All', 'Masters', 'PhD', 'Coding', 'Research', 'Saved']

export default function ScholarshipsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [scholarships, setScholarships] = useState(SCHOLARSHIPS)

  const toggleSave = (id: number) => setScholarships(s => s.map(x => x.id === id ? { ...x, saved: !x.saved } : x))

  const filtered = scholarships.filter(s => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase()) || s.org.toLowerCase().includes(query.toLowerCase())
    const matchF = filter === 'All' ? true : filter === 'Saved' ? s.saved : s.tags.includes(filter)
    return matchQ && matchF
  })

  return (
    <div className="min-h-full px-8 py-7" style={{ background: '#0d0d0d' }}>
      <div className="mb-6">
        <h1 style={{ fontSize: 28, fontFamily: 'Georgia, serif', color: '#e8e2d9', fontWeight: 400 }}>Scholarships</h1>
        <p style={{ fontSize: 13, color: '#4a4a4a', marginTop: 4 }}>37 matches found based on your profile</p>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1" style={{ maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3a3a3a' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search scholarships..."
            style={{ background: '#161616', border: '1px solid #222', borderRadius: 8, padding: '9px 12px 9px 34px', fontSize: 13, color: '#9a9a9a', outline: 'none', width: '100%' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 8, fontWeight: 500, transition: 'all 0.15s',
                background: filter === f ? '#c9a84c' : '#161616',
                color: filter === f ? '#0d0d0d' : '#555',
                border: `1px solid ${filter === f ? '#c9a84c' : '#222'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            {/* Score */}
            <div className="text-center flex-shrink-0" style={{ width: 44 }}>
              <div style={{ fontSize: 26, fontFamily: 'Georgia, serif', color: s.score >= 90 ? '#c9a84c' : '#666', fontWeight: 400, lineHeight: 1 }}>{s.score}</div>
              <div style={{ fontSize: 9, color: '#333', marginTop: 2, letterSpacing: '0.05em' }}>MATCH</div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 14, color: '#d0c9be', fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#3d3d3d', marginTop: 2 }}>{s.org}</div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {s.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 10, background: '#1e1e1e', color: '#555', border: '1px solid #2a2a2a', borderRadius: 4, padding: '1px 7px' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Deadline + amount */}
            <div className="text-right flex-shrink-0 hidden md:block">
              <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{s.amount}</div>
              <div style={{ fontSize: 11, color: '#3d3d3d', marginTop: 2 }}>Due {s.deadline}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggleSave(s.id)} style={{ color: s.saved ? '#c9a84c' : '#333' }}>
                <BookmarkPlus size={16} />
              </button>
              <button style={{ color: '#333' }}>
                <ExternalLink size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
