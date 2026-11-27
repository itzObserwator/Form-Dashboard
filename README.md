# Form Dashboard — iGYM

Standalone gym-owner dashboard extracted from the Form gym app. Built with Next.js 16, React 19, Urbanist, Roboto Condensed, Matricha and Hugeicons.

## Run locally

Use Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3001. The dashboard is also available at `/admin`.

```sh
npm run typecheck
npm run build
npm start
```

The production server listens on `0.0.0.0:3001`. For managed hosting, use `npm run build` and the platform's Next.js runtime.

## Included

- Overview with collections, occupancy, renewals, attendance and nutrition summaries.
- Member creation, CSV import/export, profile editing, preferred timings and membership actions.
- Membership plan pricing and benefits management.
- Trainer onboarding, contact details, availability, presence, member assignment and deactivation safeguards.
- Classes, named rosters, capacity, waitlists, attendance and scheduling-conflict checks.
- Shared nutrition summaries, progress examples and notifications.
- Payment recording, discounts, refunds, printable receipts, expenses and operating balance.
- Responsive layouts and matching modal forms using the grey, lime, green and amber dashboard theme.

## Demo data and integrations

Operational records are sample data held in the current browser page session. Reloading resets members, bookings, invoices and expenses. Payments are recorded as demonstrations; no money is charged or refunded. Trainer WhatsApp invitations are previews marked **Not sent**. Authentication, temporary-password creation and WhatsApp Business delivery are not connected.

The gym name defaults to **iGYM** and is editable under Settings. It is stored locally in `.form-data/gym-identity.json`, which is excluded from Git. A shared checkout lets the dashboard and Form member app use the same gym identity. Separate deployments need shared persistent storage for this setting. The local file is not suitable as persistent storage on serverless hosts.

This preview has no authentication or role enforcement. Add those and persistent storage before using it with real gym records on a public deployment.

## Tests

```sh
npx playwright install chromium
npm test
```

The test configuration starts a local development server when necessary. Tests cover member, trainer, class, nutrition and workflow rules.
