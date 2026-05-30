'use client'

import {
  InvoiceData, calcSubtotal, calcTax, calcTotal,
  formatMoney, getSymbol,
} from '@/lib/invoice'

interface Props {
  data: InvoiceData
  printRef?: React.RefObject<HTMLDivElement>
}

export default function InvoicePreview({ data, printRef }: Props) {
  const sym = getSymbol(data.currency)
  const subtotal = calcSubtotal(data.items)
  const tax = calcTax(data.items, data.taxRate)
  const total = calcTotal(data.items, data.taxRate)

  const formatDate = (s: string) => {
    if (!s) return '—'
    try {
      return new Date(s + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    } catch { return s }
  }

  return (
    <div
      ref={printRef}
      className="invoice-paper bg-white rounded-2xl invoice-shadow overflow-hidden w-full max-w-[640px] mx-auto"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Gold accent top bar */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #f0b429 0%, #fcd97a 50%, #f0b429 100%)' }} />

      <div className="p-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1
              className="text-3xl font-bold text-ink-950 leading-none mb-1"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
            >
              {data.senderName || 'Your Business'}
            </h1>
            {data.senderEmail && (
              <p className="text-sm text-ink-500 mt-1">{data.senderEmail}</p>
            )}
            {data.senderAddress && (
              <p className="text-xs text-ink-400 mt-1 whitespace-pre-line leading-relaxed">{data.senderAddress}</p>
            )}
          </div>

          <div className="text-right">
            <div
              className="text-[10px] font-semibold tracking-[0.2em] text-ink-400 uppercase mb-1"
            >Invoice</div>
            <div className="text-xl font-mono font-semibold text-ink-800">
              {data.invoiceNumber || '—'}
            </div>
          </div>
        </div>

        {/* Dates + Client */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* Bill To */}
          <div className="bg-ink-50 rounded-xl p-4">
            <div className="text-[9px] font-semibold tracking-[0.18em] text-ink-400 uppercase mb-2">Bill To</div>
            <div className="text-sm font-semibold text-ink-900">{data.clientName || '—'}</div>
            {data.clientEmail && <div className="text-xs text-ink-500 mt-0.5">{data.clientEmail}</div>}
            {data.clientAddress && <div className="text-xs text-ink-400 mt-1 whitespace-pre-line leading-relaxed">{data.clientAddress}</div>}
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[9px] font-semibold tracking-[0.18em] text-ink-400 uppercase mb-0.5">Issue Date</div>
              <div className="text-sm font-medium text-ink-800">{formatDate(data.issueDate)}</div>
            </div>
            <div>
              <div className="text-[9px] font-semibold tracking-[0.18em] text-ink-400 uppercase mb-0.5">Due Date</div>
              <div className="text-sm font-semibold text-ink-900">{formatDate(data.dueDate)}</div>
            </div>
            <div>
              <div className="text-[9px] font-semibold tracking-[0.18em] text-ink-400 uppercase mb-0.5">Currency</div>
              <div className="text-sm font-medium text-ink-700">{data.currency}</div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-ink-200">
            <span className="col-span-6 text-[9px] font-semibold tracking-[0.15em] text-ink-400 uppercase">Description</span>
            <span className="col-span-2 text-[9px] font-semibold tracking-[0.15em] text-ink-400 uppercase text-center">Qty</span>
            <span className="col-span-2 text-[9px] font-semibold tracking-[0.15em] text-ink-400 uppercase text-right">Rate</span>
            <span className="col-span-2 text-[9px] font-semibold tracking-[0.15em] text-ink-400 uppercase text-right">Amount</span>
          </div>

          {/* Rows */}
          {data.items.map((item, idx) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-2 py-3 text-sm ${idx < data.items.length - 1 ? 'border-b border-ink-100' : ''}`}
            >
              <span className="col-span-6 text-ink-800 font-medium">
                {item.description || <span className="text-ink-300 italic">No description</span>}
              </span>
              <span className="col-span-2 text-ink-600 font-mono text-center">{item.qty}</span>
              <span className="col-span-2 text-ink-600 font-mono text-right">{formatMoney(item.rate, sym)}</span>
              <span className="col-span-2 text-ink-900 font-mono font-medium text-right">
                {formatMoney(item.qty * item.rate, sym)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-ink-600">
              <span>Subtotal</span>
              <span className="font-mono">{formatMoney(subtotal, sym)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between text-sm text-ink-600">
                <span>Tax ({data.taxRate}%)</span>
                <span className="font-mono">{formatMoney(tax, sym)}</span>
              </div>
            )}
            <div className="h-px bg-ink-200 my-1" />
            <div
              className="flex justify-between items-center rounded-xl px-3 py-2.5"
              style={{ background: 'linear-gradient(135deg, #f8f4ec 0%, #fef9ef 100%)', border: '1px solid #f0b42930' }}
            >
              <span className="text-sm font-semibold text-ink-800">Total Due</span>
              <span
                className="text-lg font-bold font-mono text-ink-950"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {formatMoney(total, sym)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="border-t border-ink-100 pt-6">
            <div className="text-[9px] font-semibold tracking-[0.18em] text-ink-400 uppercase mb-2">Notes</div>
            <p className="text-xs text-ink-500 leading-relaxed">{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-ink-100 flex items-center justify-between">
          <span className="text-[10px] text-ink-300 tracking-wide">
            Generated with InvoiceFlow
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse-dot" />
            <span className="text-[10px] font-mono text-ink-400">{data.currency} · {data.invoiceNumber}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
