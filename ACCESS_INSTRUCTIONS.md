# Access Instructions

- **Live app:** https://bdr-omega.vercel.app
- **Auth provider:** Clerk (email + password)

## Demo credentials

| | |
| --- | --- |
| Email | `demo@bdrcrm.io` |
| Password | `BdrDemo#2026!` |

This account is pre-seeded with 3 accounts in different pipeline stages, contacts, a mix of open and completed follow-up tasks, a note, and two saved resources (one email template, one call script) — so the dashboard and account detail views show real, meaningful data immediately rather than empty states.

> **Heads up:** Clerk is running on development keys for this project (noted in [Known issues](./README.md#known-issues-and-opportunities)), which shows a Cloudflare "Verify you are human" checkbox on the sign-in page. It's a one-click pass for a real browser — just check the box and continue.

## Suggested walkthrough (≈5 minutes)

1. **Sign in** at the live app with the credentials above.
2. **Dashboard** — note the 3 seeded accounts (try the search box and the status filter) and the upcoming follow-ups list.
3. **Open "Acme Robotics"** from the account list — this is the fullest-featured account: a contact, an open task, a completed task (hidden from the open list on purpose), and a note.
4. **Create a follow-up task** on that account (title + due date), then **mark it complete** and watch it drop off the open list.
5. **Click "Edit"** on the account header and change its status.
6. **Go to Resources** (top-right of the dashboard) to see the two saved templates, and save a new one.
7. **Sign out**, then try visiting `/dashboard` directly — confirms the route is actually protected, not just hidden in the nav.
8. Optional: **sign up for a brand-new account** to see the empty-state dashboard, or try opening another rep's account URL directly (e.g. by guessing an ID) to confirm it 404s instead of leaking data.

## Running it locally instead

See the [Local development setup](./README.md#local-development-setup) section of the README.
