'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import ScholarshipsPage from '@/components/ScholarshipsPage'
import TrackerPage from '@/components/TrackerPage'
import CalendarPage from '@/components/CalendarPage'
import NotesPage from '@/components/NotesPage'
import AICoachPage from '@/components/AICoachPage'

export type Page = 'dashboard' | 'scholarships' | 'second-brain' | 'ai-coach' | 'tracker' | 'calendar' | 'notes' | 'alerts'

export default function Home() {
  const [page, setPage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />
      case 'scholarships': return <ScholarshipsPage />
      case 'tracker': return <TrackerPage />
      case 'calendar': return <CalendarPage />
      case 'notes': return <NotesPage />
      case 'ai-coach': return <AICoachPage />
      default: return <Dashboard onNavigate={setPage} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>
      <Sidebar active={page} onNavigate={setPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}
