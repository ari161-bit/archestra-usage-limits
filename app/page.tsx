'use client'

import { useRef, useState } from 'react'
import { Download, Eye, Printer, Zap, Star, Check } from 'lucide-react'
import InvoiceForm from '@/components/InvoiceForm'
import InvoicePreview from '@/components/InvoicePreview'
import {
  InvoiceData, generateInvoiceNumber, todayStr, dueDateStr,
  calcTotal, getSymbol, formatMoney,
} from '@/lib/invoice'

const DEFAULT: InvoiceData = {
  senderName: '',
  senderEmail: '',
  senderAddress: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  invoiceNumber: generateInvoiceNumber(),
  issueDate: todayStr(),
  dueDate: dueDateStr(30),
  currency: 'USD',
  items: [
    { id: crypto.randomUUID(), description: 'Website Design & Development', qty: 1, rate: 2500 },
    { id: crypto.randomUUID(), description: 'SEO Setup & Optimization', qty: 3, rate: 150 },
  ],
  notes: 'Payment is due within 30 days. Bank transfer or Stripe accepted.\nThank you for your business!',
  taxRate: 0,
}

export default function Home() {
  const [data, setData] = useState<InvoiceData>(DEFAULT)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [printed, setPrinted] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const total = calcTotal(data.items, data.taxRate)
  const sym = getSymbol(data.currency)

  const handlePrint = () => {
    setPrinted(true)
    setTimeout(() => setPrinted(false), 2000)
    window.print()
  }

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">

      {/* Top nav */}
      <header className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0b429, #d49913)' }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-base font-semibold text-ink-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              InvoiceFlow
            </span>
          </div>

          {/* Total badge */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono font-medium text-ink-800" style={{ background: 'linear-gradient(135deg, #f8f4ec, #fef9ef)', border: '1px solid #f0b42940' }}>
            <span className="text-ink-400 text-xs">Total</span>
            <span className="font-bold text-ink-950">{formatMoney(total, sym)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-50 transition-all hover:border-ink-300"
            >
              {printed ? <Check size={13} className="text-green-500" /> : <Printer size={13} />}
              {printed ? 'Sent!' : 'Print / PDF'}
            </button>
            <button
              className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f0b429, #d49913)' }}
            >
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="no-print lg:hidden sticky top-14 z-40 bg-white border-b border-ink-100 px-4 py-2">
        <div className="flex rounded-lg bg-ink-100 p-0.5 gap-0.5">
          {(['edit', 'preview'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md capitalize transition-all ${tab === t ? 'bg-white text-ink-900 card-shadow' : 'text-ink-500 hover:text-ink-700'}`}
            >
              {t === 'edit' ? '✏️ Edit' : '👁 Preview'}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8 h-full">

          {/* LEFT: Form panel */}
          <div className={`w-full lg:w-[380px] lg:flex-shrink-0 flex flex-col ${tab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
            <div
              className="no-print flex-1 bg-white rounded-2xl card-shadow border border-ink-100 p-5 flex flex-col overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 100px)', position: 'sticky', top: '88px' }}
            >
              <div className="flex items-center justify-between mb-5 flex-shrink-0">
                <h2 className="text-sm font-semibold text-ink-800">Invoice Details</h2>
                <span className="text-[10px] font-mono text-ink-400 bg-ink-50 px-2 py-0.5 rounded-md border border-ink-100">
                  {data.invoiceNumber}
                </span>
              </div>
              <InvoiceForm data={data} onChange={setData} />
            </div>
          </div>

          {/* RIGHT: Live preview */}
          <div className={`flex-1 flex flex-col gap-4 ${tab === 'edit' ? 'hidden lg:flex' : 'flex'}`}>

            {/* Preview label */}
            <div className="no-print flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-ink-400" />
                <span className="text-xs font-medium text-ink-500">Live Preview</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
              </div>
              <span className="text-[10px] text-ink-400 font-mono">Updates in real-time</span>
            </div>

            {/* Invoice paper */}
            <InvoicePreview data={data} printRef={printRef} />

            {/* CTA upgrade card */}
            <div
              className="no-print rounded-2xl p-5 flex items-center gap-4 mt-2"
              style={{
                background: 'linear-gradient(135deg, #1a1510 0%, #2a1f0e 100%)',
                border: '1px solid rgba(240,180,41,0.15)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f0b429, #d49913)' }}
              >
                <Star size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white mb-0.5">Unlock InvoiceFlow Pro</div>
                <div className="text-xs text-ink-400 leading-relaxed">
                  Send invoices by email · Client portal · Payment tracking · Auto-reminders · Stripe integration
                </div>
              </div>
              <button
                className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl text-ink-950 transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #f0b429, #fcd97a)' }}
              >
                $9 / mo →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
