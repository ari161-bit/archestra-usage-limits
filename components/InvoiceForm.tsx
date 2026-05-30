'use client'

import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { InvoiceData, LineItem, CURRENCIES } from '@/lib/invoice'

interface Props {
  data: InvoiceData
  onChange: (d: InvoiceData) => void
}

function Field({
  label, value, onChange, placeholder = '', type = 'text', mono = false,
}: {
  label: string; value: string | number; onChange: (v: string) => void
  placeholder?: string; type?: string; mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold tracking-widest text-ink-500 uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-900 placeholder-ink-300 transition-all hover:border-ink-300 ${mono ? 'font-mono text-xs' : ''}`}
      />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold tracking-widest text-ink-400 uppercase">{title}</span>
        <div className="flex-1 h-px bg-ink-100" />
      </div>
      {children}
    </div>
  )
}

export default function InvoiceForm({ data, onChange }: Props) {
  const set = (patch: Partial<InvoiceData>) => onChange({ ...data, ...patch })

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    set({ items: data.items.map(i => i.id === id ? { ...i, ...patch } : i) })
  }

  const addItem = () => {
    const newItem: LineItem = { id: crypto.randomUUID(), description: '', qty: 1, rate: 0 }
    set({ items: [...data.items, newItem] })
  }

  const removeItem = (id: string) => {
    if (data.items.length > 1) set({ items: data.items.filter(i => i.id !== id) })
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">

      {/* Currency */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold tracking-widest text-ink-500 uppercase">Currency</label>
        <div className="relative">
          <select
            value={data.currency}
            onChange={e => set({ currency: e.target.value })}
            className="w-full appearance-none bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-900 transition-all hover:border-ink-300 cursor-pointer pr-8"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </div>

      {/* Invoice Meta */}
      <Section title="Invoice Details">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Invoice #" value={data.invoiceNumber} onChange={v => set({ invoiceNumber: v })} mono />
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold tracking-widest text-ink-500 uppercase">Tax Rate (%)</label>
            <input
              type="number" min={0} max={100} step={0.5}
              value={data.taxRate}
              onChange={e => set({ taxRate: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-900 transition-all hover:border-ink-300 font-mono"
            />
          </div>
          <Field label="Issue Date" value={data.issueDate} onChange={v => set({ issueDate: v })} type="date" />
          <Field label="Due Date" value={data.dueDate} onChange={v => set({ dueDate: v })} type="date" />
        </div>
      </Section>

      {/* From */}
      <Section title="From (You)">
        <Field label="Your Name / Business" value={data.senderName} onChange={v => set({ senderName: v })} placeholder="Acme Studio" />
        <Field label="Email" value={data.senderEmail} onChange={v => set({ senderEmail: v })} placeholder="hello@acme.com" type="email" />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold tracking-widest text-ink-500 uppercase">Address</label>
          <textarea
            value={data.senderAddress}
            onChange={e => set({ senderAddress: e.target.value })}
            placeholder={"123 Main St\nKarachi, Pakistan"}
            rows={2}
            className="w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-900 placeholder-ink-300 resize-none transition-all hover:border-ink-300"
          />
        </div>
      </Section>

      {/* To */}
      <Section title="Bill To (Client)">
        <Field label="Client Name / Company" value={data.clientName} onChange={v => set({ clientName: v })} placeholder="Sunset Agency" />
        <Field label="Client Email" value={data.clientEmail} onChange={v => set({ clientEmail: v })} placeholder="billing@client.com" type="email" />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold tracking-widest text-ink-500 uppercase">Client Address</label>
          <textarea
            value={data.clientAddress}
            onChange={e => set({ clientAddress: e.target.value })}
            placeholder={"456 Business Ave\nDubai, UAE"}
            rows={2}
            className="w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-900 placeholder-ink-300 resize-none transition-all hover:border-ink-300"
          />
        </div>
      </Section>

      {/* Line Items */}
      <Section title="Line Items">
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-1 px-1">
            <span className="col-span-6 text-[9px] font-semibold tracking-widest text-ink-400 uppercase">Description</span>
            <span className="col-span-2 text-[9px] font-semibold tracking-widest text-ink-400 uppercase text-center">Qty</span>
            <span className="col-span-3 text-[9px] font-semibold tracking-widest text-ink-400 uppercase text-right">Rate</span>
            <span className="col-span-1" />
          </div>

          {data.items.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-1 items-center bg-white border border-ink-100 rounded-xl px-2 py-2 transition-all hover:border-ink-200 group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <input
                className="col-span-6 bg-transparent text-sm text-ink-900 placeholder-ink-300 border-none outline-none"
                placeholder="Design services"
                value={item.description}
                onChange={e => updateItem(item.id, { description: e.target.value })}
              />
              <input
                type="number" min={0}
                className="col-span-2 bg-transparent text-sm text-ink-700 font-mono text-center border-none outline-none"
                value={item.qty}
                onChange={e => updateItem(item.id, { qty: parseFloat(e.target.value) || 0 })}
              />
              <input
                type="number" min={0}
                className="col-span-3 bg-transparent text-sm text-ink-700 font-mono text-right border-none outline-none"
                value={item.rate}
                onChange={e => updateItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
              />
              <button
                onClick={() => removeItem(item.id)}
                className="col-span-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity text-ink-300 hover:text-red-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          <button
            onClick={addItem}
            className="flex items-center gap-2 text-xs font-medium text-ink-500 hover:text-ink-800 transition-colors py-1 px-1 rounded-lg hover:bg-ink-100 w-fit"
          >
            <Plus size={14} />
            Add line item
          </button>
        </div>
      </Section>

      {/* Notes */}
      <Section title="Notes / Payment Terms">
        <textarea
          value={data.notes}
          onChange={e => set({ notes: e.target.value })}
          placeholder="Payment is due within 30 days. Bank transfer or Stripe accepted. Thank you for your business!"
          rows={3}
          className="w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-900 placeholder-ink-300 resize-none transition-all hover:border-ink-300"
        />
      </Section>

    </div>
  )
}
