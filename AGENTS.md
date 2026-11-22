# ShopLedger

## Stack

- Node.js application using Express 4 and `body-parser`; the entry point is `server.js`.
- Static browser UI is in `public/`; application data is stored in `data/db.json`.
- There are no test files in this repository today.

## Module map

- `routes/products.js` — lists products and active coupons.
- `routes/orders.js` — lists, creates, and cancels orders.
- `routes/customers.js` — lists customers and records Khata settlements.
- `routes/reports.js` — serves dashboard, GST reconciliation, pricing preview, and export endpoints.
- `lib/store.js` — reads/writes the JSON database and appends audit entries.
- `lib/orders.js` — creates, looks up, lists, and cancels orders.
- `lib/inventory.js` — finds products and checks, reserves, releases, and summarizes stock.
- `lib/ledger.js` — calculates customer balances and records Khata charges and settlements.
- `lib/pricing.js` — calculates subtotals, discounts, per-line GST, and checkout totals.
- `lib/coupons.js` — normalizes, validates, calculates, and lists coupons.
- `lib/tax.js` — resolves GST rates and splits CGST/SGST.
- `lib/dates.js` — formats and normalizes dates and calculates fiscal years.
- `lib/invoice.js` — calculates and renders printable HTML invoices.
- `lib/reports.js` — calculates dashboard and GST-reconciliation reports.

## Commands

- Start the app: `npm start`
- Run tests: `node --test`

## Rules

1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket

Invoice total and GST breakdown do not match what the customer was billed.

Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).
