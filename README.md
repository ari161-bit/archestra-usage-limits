# ⚡ InvoiceFlow — Beautiful Invoices in Seconds

> A polished, real-time invoice generator built with **Next.js 14 + Tailwind CSS**.  
> Ship it in a day. Start charging on day two.

---

## 🚀 Quick Start

```bash
cd invoiceflow
npm install
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
invoiceflow/
├── app/
│   ├── layout.tsx          # Root layout + Google Fonts
│   ├── page.tsx            # Main app page (state + layout)
│   └── globals.css         # Tailwind + custom utilities
├── components/
│   ├── InvoiceForm.tsx     # Left panel — all form inputs
│   └── InvoicePreview.tsx  # Right panel — live rendered invoice
├── lib/
│   └── invoice.ts          # Types, math helpers, currency data
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## ✨ Features (Free Tier)

- [x] Real-time live preview (updates as you type)
- [x] 8 currencies (USD, EUR, GBP, PKR, AED, CAD, AUD, INR)
- [x] Unlimited line items with auto-calculated totals
- [x] Tax rate support
- [x] Print-to-PDF (browser native, zero dependencies)
- [x] Mobile responsive with tab switcher
- [x] Auto-generated invoice numbers
- [x] Beautiful typography (Playfair Display + DM Sans)

---

## 💰 Monetization Plan (Pro Tier — $9–29/month)

### Features to gate behind Pro:
| Feature | Complexity | Value |
|---|---|---|
| Send invoice by email (Resend API) | Low | High |
| Client payment portal | Medium | Very High |
| Stripe payment link embedded | Medium | Very High |
| PDF download (Puppeteer/jsPDF) | Low | High |
| Payment status tracking | Medium | High |
| Auto-reminder emails | Medium | High |
| Custom branding (logo upload) | Low | Medium |
| Invoice history (Supabase/PlanetScale) | Medium | High |

### Recommended Stack for Pro:
- **Auth**: Clerk or NextAuth.js
- **Database**: Supabase (free tier) or PlanetScale
- **Payments**: Stripe Subscriptions
- **Email**: Resend API ($0 for 3k/month free)
- **PDF**: jsPDF or Puppeteer on Vercel Edge

---

## 📦 Deploy in 2 Minutes

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Done — get a public URL instantly
```

Or push to GitHub → connect Vercel → auto-deploy on every push.

---

## 🎯 Launch Checklist (Fast Money)

### Day 1 — Ship
- [ ] Deploy to Vercel (free)
- [ ] Get custom domain ($12/yr on Namecheap)
- [ ] Add Stripe payment link for Pro ($9/mo)

### Day 2 — Promote
- [ ] Post on Twitter/X with screen recording
- [ ] Share in r/freelance, r/webdev, r/entrepreneur
- [ ] Post on LinkedIn targeting freelancers
- [ ] Submit to Product Hunt
- [ ] Share in Facebook groups for freelancers in your city

### Week 1 — Grow
- [ ] Add Google Analytics (Vercel Analytics built-in)
- [ ] Add email capture (Mailchimp free tier)
- [ ] Reach out to 10 freelancers in your network directly
- [ ] List on Gumroad as a "Pay once" tool ($19)

---

## 🌍 Target Market

**Primary**: Freelance designers, developers, writers, consultants  
**Secondary**: Small agencies, solo business owners  
**Geo focus**: Pakistan, India, Middle East (huge underserved freelancer market)

---

## 🔧 Next Features to Build

1. `app/api/send-invoice/route.ts` — email the PDF via Resend
2. `app/api/stripe-checkout/route.ts` — Stripe subscription checkout
3. `app/(dashboard)/invoices/page.tsx` — invoice history list
4. `components/LogoUpload.tsx` — custom branding
5. `app/invoice/[id]/page.tsx` — shareable public invoice link

---

## 📸 What Makes It Impressive

- **Playfair Display** serif for elegance — feels premium, not template
- **Gold accent** (#f0b429) — conveys value and money
- **Live preview** — the "wow" moment when someone sees it update in real time
- **Print CSS** — zero-dependency PDF that actually looks great
- **Ink color palette** — warm neutrals, not cold gray — feels artisan

---

Built with Next.js 14, Tailwind CSS, TypeScript, Lucide React
