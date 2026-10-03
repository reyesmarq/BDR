# Copilot instructions — BDR CRM

BDR CRM is a lightweight CRM for individual B2B sales reps. Full product spec:
[docs/specification.md](../docs/specification.md).

## Repo layout

Two independent npm projects, no shared root package.json or workspace tooling:

- `api/` — NestJS backend
- `web/` — Next.js frontend
- `docs/` — specification, data model, design system docs (source of truth for product decisions)

## Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS v4, deployed on Vercel
- **Backend**: NestJS (Express platform), TypeScript, deployed on Render
- **Data**: PostgreSQL (Neon) via Prisma ORM — schema not yet implemented (see `docs/dbmodel.md` for the designed model)
- **Auth**: Clerk on the frontend; the NestJS API validates Clerk-issued JWTs via a Passport `jwt` strategy against Clerk's JWKS endpoint (`api/src/auth/`)

## API conventions (`api/`)

- ESM throughout (`"type": "module"` in package.json) — relative imports **must** include the `.js` extension even though the source is `.ts` (e.g. `import { AppService } from './app.service.js'`).
- All routes are **authenticated by default**. The `JwtAuthGuard` is registered globally via `APP_GUARD` in `AuthModule`. To expose a route without auth, annotate it with `@Public()` (`src/auth/decorators/public.decorator.ts`), as `AppController`'s root health-check route does.
- Read the authenticated user with the `@CurrentUser()` param decorator (`src/auth/decorators/current-user.decorator.ts`); it returns a `ClerkUser` whose `id` is the Clerk `sub` claim and maps to `User.clerkId` in the data model.
- Config is read through `@nestjs/config`'s `ConfigService` (global), not `process.env` directly. Required env vars: `DATABASE_URL`, `CLERK_ISSUER` (see `api/.env.example`).
- Tests use **Vitest**, not Jest, with globals enabled (`describe`/`it`/`expect`/`vi` available without imports). Unit specs live next to the file under test as `*.spec.ts`; e2e specs live in `api/test/`.
- Lint/format: ESLint (flat config, typescript-eslint `recommendedTypeChecked`) + Prettier, single quotes, trailing commas. Run `npm run lint` before committing.

## Data model

Every `Account` and `Resource` carries a direct `userId`; `Contact`, `Task`, and `Note` inherit isolation through their parent `Account`. Full entity list and fields: [docs/dbmodel.md](../docs/dbmodel.md). When adding Prisma models, follow that schema — don't invent new entities or fields without updating the doc first.

## Design system (`web/`)

Tailwind-only, no custom CSS/hex values — use Tailwind's default palette and spacing scale exclusively. Full rules (colors, type scale, spacing, card pattern): [docs/systemdesign.md](../docs/systemdesign.md). Key points Copilot should default to:

- Accent color is `teal-600` / `teal-700` (hover); neutrals are `slate-*`.
- Standard card: `rounded-lg border border-slate-200 bg-white p-4` (or `p-6`).
- Page containers: `max-w-7xl mx-auto`, with `p-4 sm:p-6 lg:p-8`.
- System font stack only (`font-sans`) — no custom Google Fonts.

## Naming conventions

- Files: kebab-case (`jwt-auth.guard.ts`, `current-user.decorator.ts`).
- NestJS building blocks keep their suffix: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.guard.ts`, `*.strategy.ts`, `*.decorator.ts`.
- Branches: `<initials>/<short-description>` (e.g. `mr/clerk-jwt-auth`).
