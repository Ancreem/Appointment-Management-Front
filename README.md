# Appointment Management System — Frontend

React SPA for the Appointment Management System prueba técnica. Communicates with the Spring Boot backend via REST API, handles JWT authentication with silent session restore, and enforces role-based access control at the UI level.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites & Local Setup](#prerequisites--local-setup)
3. [Environment Variables](#environment-variables)
4. [Session & Token Management](#session--token-management)
5. [Folder Structure](#folder-structure)
6. [Key Architecture Decisions](#key-architecture-decisions)
7. [Role-Based UI](#role-based-ui)
8. [Frontend Validations](#frontend-validations)
9. [Good Practices Applied](#good-practices-applied)
10. [SDD — Spec-Driven Development](#sdd--spec-driven-development)
11. [Running Tests](#running-tests)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | ~5.6 | Type safety |
| Vite | 5 | Dev server and bundler |
| MUI (Material UI) | v6 | Component library |
| React Router | v6 | Client-side routing |
| Axios | ^1.7 | HTTP client with JWT interceptor |
| Sonner | ^2.0 | Toast notifications |
| dayjs | ^1.11 | Date formatting |
| Vitest + React Testing Library | ^2.1 / ^16 | Unit tests |
| Playwright | ^1.49 | E2E tests (configured) |
| MSW | ^2.6 | API mocking in tests |

---

## Prerequisites & Local Setup

The backend must be running before starting the frontend. See the backend README for setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL to point at the running backend

# 3. Start dev server
npm run dev
```

App available at **http://localhost:5173**

**Build for production:**

```bash
npm run build
npm run preview
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |

---

## Session & Token Management

This is the most security-sensitive part of the frontend — implemented deliberately.

### Access token

- Stored in **memory only** (module-level variable in `src/api/client.ts`)
- Never written to `localStorage` or cookies
- Lost on page reload — recovered transparently via the refresh token (see below)
- Attached to every outgoing request as `Authorization: Bearer <token>`

### Refresh token

- Stored in **`localStorage`** (key: `refreshToken`)
- Survives page reloads and browser restarts
- 7-day lifetime
- Rotated on every use: the server invalidates the old token and issues a new one

### Session restore on reload (F5)

1. App mounts → `AuthContext` checks `localStorage` for a `refreshToken`
2. If found → calls `POST /api/v1/auth/refresh`
3. New access token stored in memory, new refresh token written to `localStorage`
4. User identity decoded from JWT claims (`sub`, `role`, `email`, `name`)
5. If refresh fails → stale token is cleared, user stays on login page

The provider renders `null` while the restore is in flight, preventing a flash of the login screen for authenticated users.

### Concurrent 401 handling (`src/api/client.ts`)

When the access token expires, multiple simultaneous requests may all receive 401. Without deduplication, each would independently trigger a refresh call — a race condition that invalidates tokens unpredictably.

The Axios response interceptor solves this with a **dedup queue**:

- A boolean flag (`isRefreshing`) tracks whether a refresh call is already in flight
- If a 401 arrives while `isRefreshing = true`, the failed request is pushed onto `failedQueue` instead of triggering a new refresh
- Once the single refresh call completes, all queued requests are replayed with the new token
- If the refresh itself fails, all queued requests are rejected and the session is cleared

---

## Folder Structure

```
src/
├── api/                    # Axios client + endpoint functions
│   ├── client.ts           # Axios instance, JWT interceptor, dedup queue
│   ├── auth.api.ts
│   ├── appointments.api.ts
│   └── users.api.ts
├── components/
│   ├── features/           # Business components
│   │   ├── AppointmentTable.tsx
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentFiltersBar.tsx
│   │   └── UserTable.tsx
│   └── ui/                 # Reusable primitives
│       ├── StatusChip.tsx
│       ├── SkeletonTable.tsx
│       └── ConfirmDialog.tsx
├── context/
│   ├── AuthContext.tsx      # Auth state: login / logout / silent restore
│   └── ColorModeContext.tsx # Dark/light mode + MUI ThemeProvider
├── hooks/                  # useAppointments, useUsers, useAuth
├── layouts/
│   ├── AppLayout.tsx        # AppBar + responsive Drawer
│   └── AuthLayout.tsx       # Centered card for unauthenticated pages
├── pages/                  # LoginPage, DashboardPage, AppointmentsPage,
│   │                       # AppointmentFormPage, UsersPage
├── routes/                 # AppRouter, PrivateRoute, AdminRoute
├── theme/                  # MUI theme (superseded by ColorModeContext)
├── types/                  # TypeScript interfaces matching backend DTOs
└── utils/
    └── date.ts             # dayjs formatting helpers (isoToDatetimeLocal, etc.)
```

### Routes

```
/login                    → AuthLayout   → LoginPage
/dashboard                → AppLayout    → DashboardPage          (authenticated)
/appointments             → AppLayout    → AppointmentsPage       (authenticated)
/appointments/new         → AppLayout    → AppointmentFormPage    (authenticated)
/appointments/:id/edit    → AppLayout    → AppointmentFormPage    (authenticated)
/users                    → AppLayout    → UsersPage              (ADMIN only)
```

---

## Key Architecture Decisions

### No global state library

Context API + custom hooks is sufficient for this scope. Adding Redux or Zustand would introduce accidental complexity with no measurable benefit. If the app grew to 10+ feature domains with cross-cutting shared state, the decision should be revisited.

### Soft delete with undo

Deleting an appointment sets its status to `DELETED` — no row is physically removed from the database. The UI removes the row immediately (optimistic update) and shows a Sonner toast with an **UNDO** button. If undo is clicked within 5 seconds, the API call is cancelled via `clearTimeout`. The user gets instant feedback; the data is always recoverable.

### Dirty check on edit

The appointment edit form captures the original values on mount. Before submitting, it compares current values against the originals (ISO string comparison for dates, value equality for strings). If nothing changed, the API is never called — the user sees a "No changes detected" toast instead. This prevents unnecessary mutation calls and gives honest feedback.

### Timezone handling

The backend stores and returns all datetimes as UTC ISO 8601 strings.

| Context | Conversion |
|---|---|
| Table display | `new Date(isoString)` → browser local time |
| Edit form pre-fill | UTC ISO → `datetime-local` format via `isoToDatetimeLocal` |
| Form submission | `datetime-local` value → UTC ISO via `new Date(value).toISOString()` |

The user always sees and enters times in their local timezone. The backend always receives UTC.

### Dark mode

`ColorModeProvider` wraps the entire app and manages the active MUI theme. Toggling persists to `localStorage` (key: `ams-color-mode`) so the preference survives reloads. The Sonner `Toaster` also receives the current mode so toast styling remains consistent.

---

## Role-Based UI

| Feature | ADMIN | USER |
|---|---|---|
| See all appointments | Yes | No (own appointments only) |
| Create appointment for any user | Yes | No (self only) |
| Users listing page (`/users`) | Yes | No (redirected to `/dashboard`) |
| "Users" link in Drawer | Yes | No (hidden) |
| Assigned-to selector in form | Yes | No (hidden) |

`PrivateRoute` redirects unauthenticated users to `/login`.  
`AdminRoute` redirects authenticated non-admin users to `/dashboard`.

**These checks are UI-only.** The backend validates permissions on every request regardless of what the frontend renders.

---

## Frontend Validations

### AppointmentForm

| Field | Rule |
|---|---|
| Title | Required, max 255 characters |
| Start time | Required |
| End time | Required, must be strictly after start time |
| Assigned user | Required when the authenticated user is ADMIN |

### Login form

| Field | Rule |
|---|---|
| Email | Required, valid format |
| Password | Required |

### Edit form — dirty check

If no fields have changed relative to the loaded appointment, the form does not call the API and shows a "No changes detected" toast.

### API error display

All data hooks extract `error.response.data.message` from Axios errors and surface it as an MUI `Alert` inside the relevant page. For example, a `409 Conflict` from the backend renders:

> "The user already has an appointment scheduled from ... Please choose a different time slot."

---

## Good Practices Applied

| Practice | Where |
|---|---|
| TypeScript strict mode — no `any`, all types explicit | All source files |
| Axios interceptor dedup queue — prevents concurrent refresh race conditions | `src/api/client.ts` |
| Optimistic UI + undo — instant feedback, backend called after 5 s timeout | `AppointmentsPage` delete handler |
| Skeleton loading — contextual `MUI Skeleton` instead of a generic spinner | `SkeletonTable` component |
| API error extraction — `error.response.data.message` propagated to UI | All data hooks |
| Timezone-aware date handling — display in local time, submit in UTC | `src/utils/date.ts` + form handlers |
| Dark mode — system-level preference with `localStorage` persistence | `ColorModeContext.tsx` |
| Context API over Redux — right-sized state management for this scope | `AuthContext`, `ColorModeContext` |
| Lazy-loaded routes — Vite code splitting per route | `src/routes/AppRouter.tsx` |
| Centralised API paths — no hardcoded strings outside `src/api/` | `src/api/*.ts` |

---

## SDD — Spec-Driven Development

### What is SDD?

SDD is a methodology where formal artifacts — spec, design, and task breakdown — are created and reviewed **before writing code**. The developer (and any AI assistant) always implements against a written contract, not against assumptions.

### Why it matters for this project

The entire frontend architecture (33 files, routing strategy, interceptor design, role-based rendering, timezone handling, optimistic updates) was fully specified in `SDD/06_Frontend_Architecture.md` before a single line of implementation was written.

Consequences:

- Every UX decision (soft delete, undo, skeleton loading, dirty check) was driven by the spec requirements, not added arbitrarily mid-implementation
- The test matrix (`SDD/07_Test_Matrix.md`) defined exactly what to test before any tests were written — no coverage gaps, no test-after-the-fact rationalisation
- Deviations from the spec are visible by diffing the implementation against the artifact, not by reading commit history

### The SDD/ directory

The `SDD/` directory at the project root contains all 11 process documentation files, showing the complete thought process from initial requirements through API spec, backend architecture, frontend architecture, test matrix, and final decisions. It is the audit trail for every non-obvious choice in this codebase.

---

## Running Tests

```bash
# Unit tests (single run)
npm run test

# Unit tests (watch mode)
npm run test:watch

# Unit tests (browser UI)
npm run test:ui

# E2E tests — requires backend running + Playwright browsers installed
npx playwright install
npm run test:e2e
```
