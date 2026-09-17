# BDR CRM Specification Document

## Project Title & Description
BDR CRM is a lightweight CRM-style web app built for individual B2B sales reps (BDRs) to track their prospects and daily sales activity in one place. It's designed for someone managing a personal pipeline of accounts and leads who needs a simple way to see what's happening and what's next, without the overhead of a full enterprise CRM.

The initial release focuses on core pipeline workflows: authentication, a dashboard of accounts and follow-up tasks, lead detail tracking, task management, and reusable sales resources.

## Purpose & Target Audience
- Audience: Individual B2B sales development reps (BDRs) managing a personal pipeline of accounts and leads
- Purpose: Give a BDR a single, simple place to see which leads need a call, email, or follow-up next, without the overhead of a full enterprise CRM

## User Stories
1. As a BDR, I want to log in so that I only ever see my own accounts and tasks.
2. As a BDR, I want a dashboard listing my accounts and upcoming follow-up tasks sorted by due date so that I know what to work on next.
3. As a BDR, I want to create a new lead/account so that I can start tracking it in my pipeline.
4. As a BDR, I want to open a lead's detail view showing account info, key contacts, and related tasks/notes so that I have full context before reaching out.
5. As a BDR, I want to create, update, and mark follow-up tasks as complete so that I stay on top of next steps.
6. As a BDR, I want to save and reuse email templates and call scripts on a resources page so that I don't have to rewrite them every time.

## Acceptance Criteria

### Story 1: Log in
- Given a registered rep, when they sign in with valid credentials, then they are authenticated and redirected to their dashboard.
- Given an unauthenticated visitor, when they request any account or task data, then the API rejects the request.

### Story 2: Dashboard of accounts and follow-up tasks
- Given a signed-in rep, when they open the dashboard, then they see only their own accounts and tasks, with tasks sorted by soonest due date first.
- Given a rep with no accounts yet, when they open the dashboard, then the system displays an empty-state message.

### Story 4: Lead detail view
- Given a rep, when they open one of their accounts, then they see the account's info, key contacts, and its related tasks and notes.
- Given a rep, when they try to open an account that belongs to another rep, then the system denies access.

### Story 5: Manage follow-up tasks
- Given a rep viewing a lead, when they create a follow-up task with a due date, then it appears on their dashboard sorted correctly.
- Given an open task, when the rep marks it complete, then it no longer appears in the upcoming follow-ups list.

## Technical Requirements
- Frontend: Next.js App Router, TypeScript, Tailwind CSS, hosted on Vercel
- Backend: NestJS REST API, hosted on Render
- Data: PostgreSQL (Neon) with Prisma ORM
- Auth: Clerk handles sign-in/sign-up on the frontend and issues a JWT; the NestJS API validates that JWT via a Passport JWT strategy against Clerk's JWKS endpoint
- Data isolation: every account, contact, task, and resource is scoped to the authenticated rep's user ID, enforced server-side

## Core API Endpoints
- GET /accounts
- GET /accounts/:id
- POST /accounts
- PATCH /accounts/:id
- GET /accounts/:id/tasks
- POST /tasks
- PATCH /tasks/:id
- GET /resources
- POST /resources

## Implementation Priority
- P0: Auth, dashboard (accounts + tasks sorted by due date), create/view account, create/update/complete tasks
- P1: Lead detail view (contacts + notes), edit account
- P2: Resources page (email templates, call scripts), search/filter accounts
