export interface LineItem {
  id: string
  description: string
  qty: number
  rate: number
}

export interface InvoiceData {
  // Sender
  senderName: string
  senderEmail: string
  senderAddress: string

  // Client
  clientName: string
  clientEmail: string
  clientAddress: string

  // Invoice meta
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string

  // Items
  items: LineItem[]

  // Notes
  notes: string
  taxRate: number
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
]

export function getSymbol(code: string): string {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? '$'
}

export function calcSubtotal(items: LineItem[]): number {
  return items.reduce((s, i) => s + i.qty * i.rate, 0)
}

export function calcTax(items: LineItem[], taxRate: number): number {
  return calcSubtotal(items) * (taxRate / 100)
}

export function calcTotal(items: LineItem[], taxRate: number): number {
  return calcSubtotal(items) + calcTax(items, taxRate)
}

export function formatMoney(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const yr = now.getFullYear().toString().slice(2)
  const mo = String(now.getMonth() + 1).padStart(2, '0')
  const rand = Math.floor(Math.random() * 900 + 100)
  return `INV-${yr}${mo}-${rand}`
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function dueDateStr(days = 30): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}
