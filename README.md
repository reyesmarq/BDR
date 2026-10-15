# BDR CRM

A lightweight CRM for individual B2B sales reps (BDRs) to track their accounts, follow-up tasks, and reusable outreach content in one place.

- **Live app:** https://bdr-omega.vercel.app
- **API:** NestJS REST API deployed on Render (see [Access Instructions](./ACCESS_INSTRUCTIONS.md) for how the web app reaches it)
- **Repository:** this repo, `main` branch

## Team

1. Mauricio Reyes
2. Daniel Osorio

## What it does

A rep signs in and sees a dashboard of their own accounts (leads) and upcoming follow-up tasks, sorted by due date. Opening an account shows its contacts, open follow-ups, and notes. From there a rep can create and edit accounts, create/edit/complete follow-up tasks, and save reusable email templates and call scripts on a separate Resources page. Every record is scoped server-side to the signed-in rep — nobody can see or edit another rep's data.

See [`docs/specification.md`](./docs/specification.md) for the full purpose statement, user stories, and acceptance criteria this was built against, and [`docs/systemdesign.md`](./docs/systemdesign.md) for the design system (palette, type scale, spacing conventions).

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS — deployed on Vercel |
| Backend | NestJS REST API, TypeScript — deployed on Render |
| Database | PostgreSQL (Neon), accessed through Prisma ORM |
| Auth | Clerk — sign-up/sign-in/session UI on the frontend; the API independently verifies every request's Clerk-issued JWT against Clerk's JWKS endpoint via a Passport strategy |

**A note on the two-service architecture:** the frontend and backend are separate deployed services (Vercel + Render) rather than the backend living inside Next.js Route Handlers. This was a deliberate choice made at the start of the project (see `docs/specification.md`) so the API has its own lifecycle, tests, and validation pipeline independent of the frontend. The full client → server → database cycle is real in either architecture — the client fetches, the NestJS route handler queries Postgres through Prisma, and the result renders in a server component — it just crosses a service boundary instead of staying inside a single Next.js process.

## Project structure

```
api/    NestJS API — one module per resource (accounts, tasks, resources, users, auth)
web/    Next.js App Router frontend
docs/   Specification, system design, and DB model documentation
```

## Local development setup

Requires Node 20+, a Postgres connection string (a free [Neon](https://neon.tech) project works), and a [Clerk](https://clerk.com) application (test/dev keys are fine for local work).

### 1. API (`api/`)

```bash
cd api
npm install
cp .env.example .env   # fill in DATABASE_URL and CLERK_ISSUER (see below)
npx prisma migrate deploy
npm run start:dev      # runs on http://localhost:8000
```

`CLERK_ISSUER` is the Frontend API URL for your Clerk instance, e.g. `https://your-app.clerk.accounts.dev` — found on the Clerk dashboard's API Keys page. The API uses it to fetch Clerk's JWKS and verify incoming JWTs; it never talks to Clerk's backend API itself.

### 2. Web (`web/`)

```bash
cd web
npm install
cp .env.example .env.local   # fill in Clerk keys; NEXT_PUBLIC_API_URL defaults to http://localhost:8000
npm run dev                  # runs on http://localhost:3000
```

### Running checks

Both packages have the same three commands:

```bash
npm run lint    # ESLint, auto-fixing where possible
npm test        # Vitest (api only — unit tests for every service/controller)
npm run build   # production build
```

## Deployment

- **Web** deploys to Vercel on every push to `main` (and gets a preview deployment per pull request). Environment variables are configured in the Vercel project settings, mirroring `.env.example`.
- **API** deploys to Render on every push to `main`. Environment variables are configured in the Render service settings, mirroring `api/.env.example`. `FRONTEND_URL` on the API must be set to the deployed web app's origin so CORS allows it.
- **Database** is a Neon Postgres project; Prisma migrations (`api/prisma/migrations`) are the source of truth for schema changes — run `npx prisma migrate deploy` against production when a new migration lands.

## API routes

All routes except `GET /` require a valid Clerk-issued `Authorization: Bearer <JWT>` header. Every route scopes its query to the signed-in rep's own data server-side (via their Clerk user ID → internal `User` row) — requesting or modifying another rep's record returns `404`, not `403`, so existence can't be inferred.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Public health check |
| GET | `/me` | Returns the decoded Clerk user for the current session |
| GET | `/accounts` | List the signed-in rep's accounts |
| POST | `/accounts` | Create an account (`name`, optional `status`) |
| GET | `/accounts/:id` | Get one account with its contacts, tasks, and notes |
| PATCH | `/accounts/:id` | Update an account's `name` and/or `status` |
| DELETE | `/accounts/:id` | Soft-delete an account (sets `status` to `archived`; excluded from `GET /accounts` and `GET /tasks` from then on) |
| POST | `/accounts/:accountId/tasks` | Create a follow-up task on an account (`title`, `dueDate`, optional `description`) |
| PATCH | `/accounts/:accountId/tasks/:taskId` | Update a task's `title`, `dueDate`, and/or `description` |
| PATCH | `/accounts/:accountId/tasks/:taskId/complete` | Mark a task complete (sets `status` and `completedAt`) |
| GET | `/tasks` | List all of the signed-in rep's tasks across their (non-archived) accounts, with each account's name attached — powers the dashboard's upcoming follow-ups |
| GET | `/resources` | List the signed-in rep's saved resources |
| POST | `/resources` | Save a resource (`title`, `type`: `email_template` \| `call_script`, `content`) |

## Known issues and opportunities

- **Delete is implemented for accounts only** (a soft delete — `status` becomes `archived`). Tasks and resources don't have a delete action yet; a hard delete on tasks is the next logical addition.
- **Contacts and notes are read-only.** The data model and detail-page UI support them, but there's no create/edit form yet — the seeded demo data was added directly through Prisma. Adding a note-creation form is a natural next step.
- **Clerk is running on development keys** in production, which shows a "Development mode" badge to users and applies stricter bot-protection than a production instance would. Functionally everything still works; it's a polish item before this would be a real public product.

## Issue history

Each feature shipped as its own issue, feature branch, and pull request:

| # | Feature |
| --- | --- |
| 5 | Lead detail page — account info, contacts, tasks, notes |
| 6 | Task CRUD — create, update, mark complete |
| 7 | Resources page — store/display email templates & call scripts |
| 8 | Edit account details |
| 9 | Search/filter accounts by name or status |
