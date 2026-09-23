BDR CRM — Design System
Color Palette

Corporate, trustworthy, restrained — inspired by HubSpot's UI, which keeps color usage minimal and purposeful. One primary accent color, neutrals doing most of the work.

Role	Tailwind class	Usage
Primary text / nav background	slate-900	Top nav, headings, high-emphasis text
Page background	white or slate-50	Main content canvas
Card / section background	white	Cards, panels, modals
Border / divider	slate-200	Card borders, table dividers, separators
Secondary text	slate-600	Body copy, descriptions
Muted / metadata text	slate-500	Timestamps, labels, helper text
Primary accent	teal-600	Links, primary buttons, active nav state, focus rings
Primary accent (hover)	teal-700	Hover state for accent elements
Success / positive	green-600	"Won" status, success messages, completed states
Warning / attention	amber-500	Caution states, pending attention
Danger / destructive	red-600	"Lost" status, delete actions, error messages

Rule: No custom hex values or CSS. Use Tailwind's default palette exclusively, per the project constitution's "utility-first, no custom CSS unless necessary" principle.

Typography
Font: Tailwind's default font-sans (system font stack). No custom Google Font.
Rationale: Dense, data-heavy B2B interfaces (HubSpot, Salesforce, Linear) favor system fonts for legibility at small sizes and zero load-time cost over personality-driven typefaces.
Scale: Use Tailwind's default text scale (text-sm, text-base, text-lg, text-xl, text-2xl) consistently. Avoid arbitrary font sizes.
Weight: font-medium or font-semibold for headings and emphasis; font-normal for body text.
Layout & Spacing Conventions
Spacing unit: Tailwind's default scale (based on 4px increments: p-1=4px, p-2=8px, p-4=16px, p-6=24px, p-8=32px). Use these consistently rather than arbitrary values.
Max content width: max-w-7xl (or max-w-screen-xl) for main page containers, centered with mx-auto, so tables and lists stay readable on wide screens.
Card pattern: rounded-lg border border-slate-200 bg-white p-4 (or p-6 for more spacious cards) — the standard container style for prospect cards, activity items, and panels.
Page padding: p-4 on mobile, p-6 or p-8 on larger screens (sm:p-6 lg:p-8).
Vertical rhythm: space-y-4 or space-y-6 between stacked sections; avoid inconsistent manual margins.