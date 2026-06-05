# Appointment Management System — Frontend

React SPA for a full-stack Appointment Management System, built as a junior developer technical assessment. Communicates with the Spring Boot backend via REST API, handles JWT authentication with silent session restore, and enforces role-based access control at the UI level.

**Stack**: React 19 · TypeScript 5.6 · Vite 5 · MUI 6 · React Router 6 · Axios

---

## Table of Contents

1. [Project Description](#1-project-description)
2. [Tech Stack](#2-tech-stack)
3. [Architecture & Folder Structure](#3-architecture--folder-structure)
4. [Local Setup](#4-local-setup)
5. [Environment Variables](#5-environment-variables)
6. [Session & Token Management](#6-session--token-management)
7. [Routes](#7-routes)
8. [Role-Based UI](#8-role-based-ui)
9. [Frontend Validations](#9-frontend-validations)
10. [Key Architecture Decisions](#10-key-architecture-decisions)
11. [Good Practices Applied](#11-good-practices-applied)
12. [Backend Integration](#12-backend-integration)
13. [SDD — Spec-Driven Development](#13-sdd--spec-driven-development)
14. [Running Tests](#14-running-tests)

---

## 1. Project Description

This is the frontend for an Appointment Management System. It provides a complete UI for user authentication, appointment CRUD with overlap validation, role-based views, and a dashboard with summary statistics.

Key characteristics:

- Built with **React 19** and **TypeScript** — full type safety across the entire codebase
- **MUI 6** component library for a polished, responsive interface with built-in dark mode
- **JWT authentication** with access token in memory and refresh token in `localStorage`
- **Silent session restore** — refreshing the page restores the session without re-login
- **Concurrent 401 dedup** — Axios interceptor queues multiple 401-failed requests and replays them after a single refresh call
- **Soft delete with undo** — deleting an appointment shows a Sonner toast with a 5-second undo window
- **Lazy-loaded routes** — Vite code-splitting per route for faster initial load
- **Role-based rendering** — ADMIN sees all appointments and the users list; USER sees only their own appointments

---

## 2. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | ~5.6 | Type safety |
| Vite | 5 | Dev server and bundler |
| MUI (Material UI) | v6 | Component library |
| React Router | v6 | Client-side routing |
| Axios | ^1.7 | HTTP client with JWT interceptor |
| Sonner | ^2.0 | Toast notifications |
| dayjs | ^1.11 | Date formatting and timezone handling |
| Vitest + React Testing Library | ^2.1 / ^16 | Unit tests |
| Playwright | ^1.49 | E2E tests (configured) |
| MSW | ^2.6 | API mocking in tests |

---

## 3. Architecture & Folder Structure

```
src/
├── api/                      # Axios client + endpoint functions
│   ├── client.ts              # Axios instance, JWT interceptor, dedup queue
│   ├── auth.api.ts            # Login, refresh, logout
│   ├── appointments.api.ts    # Appointment CRUD + status update
│   └── users.api.ts           # List users (ADMIN only)
├── components/
│   ├── features/              # Business components
│   │   ├── AppointmentTable.tsx
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentFiltersBar.tsx
│   │   └── UserTable.tsx
│   └── ui/                    # Reusable primitives
│       ├── StatusChip.tsx
│       ├── SkeletonTable.tsx
│       ├── StatCardSkeleton.tsx
│       ├── ConfirmDialog.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       └── index.ts
├── context/
│   ├── AuthContext.tsx         # Global auth state: login, logout, silent restore
│   └── ColorModeContext.tsx    # Dark/light mode + MUI ThemeProvider
├── hooks/
│   ├── useAppointments.ts     # Appointment CRUD with loading/error state
│   ├── useUsers.ts            # User list fetching
│   └── useAuth.ts             # Re-export from AuthContext
├── layouts/
│   ├── AppLayout.tsx           # AppBar + permanent side Drawer + content area
│   └── AuthLayout.tsx          # Centered card layout for login
├── pages/
│   ├── LoginPage.tsx           # Email + password sign-in
│   ├── DashboardPage.tsx       # Welcome banner + summary stat cards
│   ├── AppointmentsPage.tsx    # Filterable, paginated appointment list
│   ├── AppointmentFormPage.tsx # Create/edit form (reuses AppointmentForm)
│   └── UsersPage.tsx           # User list (ADMIN only)
├── routes/
│   ├── AppRouter.tsx           # Centralized route config with lazy loading
│   ├── PrivateRoute.tsx        # Redirects unauthenticated users to /login
│   └── AdminRoute.tsx          # Redirects non-ADMIN users to /dashboard
├── theme/
│   └── theme.ts               # Base MUI theme (superseded by ColorModeContext)
├── types/
│   ├── auth.ts                 # AuthRequest, AuthResponse, AuthUser, UserRole
│   ├── appointment.ts          # Appointment, request/response DTOs, filters
│   ├── user.ts                 # User type
│   └── api.ts                  # PageResponse<T>, ErrorResponse
├── utils/
│   └── date.ts                 # dayjs helpers: format, convert, ISO utilities
├── App.tsx                     # Root component — delegates to AppRouter
├── main.tsx                    # Entry point — providers + router mount
└── test-setup.ts               # Vitest global setup
```

**Key structural decisions:**

- **API layer is centralized** — all HTTP calls go through `src/api/`. No hardcoded URLs outside this directory.
- **Types mirror the backend DTOs exactly** — `src/types/` defines TypeScript interfaces that match the Spring Boot response/request shapes.
- **Feature components vs UI primitives** — business-logic-heavy components live in `components/features/`; reusable presentational components in `components/ui/`.
- **Hooks encapsulate state + API calls** — each domain (`useAppointments`, `useUsers`) gets a custom hook that manages loading, error, and data states.

---

## 4. Local Setup

The backend must be running before starting the frontend. See the [backend README](https://github.com/Ancreem/Appointment-Management-back) for setup instructions.

### Prerequisites

- Node.js 18+
- npm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Ancreem/Appointment-Management-Front.git
cd Appointment-Management-Front

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL to point at the running backend (default works with Vite proxy)

# 4. Start dev server
npm run dev
```

The app is available at **http://localhost:5173**.

The Vite dev server proxies `/api` requests to `http://localhost:8080` (configured in `vite.config.ts`), so the default `.env` works with the backend running locally on port 8080.

### Production build

```bash
npm run build
npm run preview
```

### Connecting to a non-proxied backend

If the backend is deployed at a different URL, update `VITE_API_BASE_URL` in `.env`:

```
VITE_API_BASE_URL=https://your-backend.com/api/v1
```

Then build without the Vite proxy for production.

---

## 5. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |

Copy `.env.example` to `.env` and adjust the URL if needed. In development, the Vite proxy handles API routing automatically.

---

## 6. Session & Token Management

This is the most security-sensitive part of the frontend — implemented deliberately with no compromises.

### Access token

- Stored **in memory only** (module-level variable in `src/api/client.ts:16`)
- Never written to `localStorage`, `sessionStorage`, or cookies
- Lost on page reload — recovered transparently via the refresh token
- Attached to every outgoing request as `Authorization: Bearer <token>`
- Lifetime: **15 minutes** (configurable in the backend)

### Refresh token

- Stored in **`localStorage`** (key: `refreshToken`)
- Survives page reloads and browser restarts
- Lifetime: **7 days** (configurable in the backend)
- **Rotated on every use** — the server invalidates the old token and issues a new pair

### Session restore on page reload

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

### Logout

`POST /api/v1/auth/logout` is called with the current refresh token. On success (or failure), the local token state is cleared. This is a single-session logout — other devices remain active.

### Token flow diagram

```
POST /auth/login
  → { access_token, refresh_token }

Every protected request:
  → Authorization: Bearer <access_token>

On 401 (access token expired):
  POST /auth/refresh  (body: { refreshToken })
  → { access_token, refresh_token }   ← old refresh token REVOKED

POST /auth/logout  (body: { refreshToken })
  → revokes current refresh token; other sessions remain active
```

---

## 7. Routes

All routes are lazy-loaded via `React.lazy()` + `Suspense` for automatic code splitting by Vite.

| Path | Layout | Page | Access |
|---|---|---|---|
| `/login` | `AuthLayout` | `LoginPage` | Public |
| `/dashboard` | `AppLayout` | `DashboardPage` | Authenticated |
| `/appointments` | `AppLayout` | `AppointmentsPage` | Authenticated |
| `/appointments/new` | `AppLayout` | `AppointmentFormPage` | Authenticated |
| `/appointments/:id/edit` | `AppLayout` | `AppointmentFormPage` | Authenticated |
| `/users` | `AppLayout` | `UsersPage` | ADMIN only |

- `PrivateRoute`: redirects unauthenticated users to `/login`
- `AdminRoute`: redirects authenticated non-ADMIN users to `/dashboard`
- `/` and any unmatched path redirect to `/dashboard`

---

## 8. Role-Based UI

| Feature | ADMIN | USER |
|---|---|---|
| See all appointments (all users) | Yes | No (own appointments only) |
| Create appointment for any user | Yes | No (self only) |
| "Users" link in side Drawer | Yes | No (hidden) |
| Users listing page (`/users`) | Yes | No (redirected to `/dashboard`) |
| User selector in appointment form | Yes | No (hidden; auto-assigned to self) |
| Delete any appointment | Yes | Own appointments only |
| Edit any appointment | Yes | Own appointments only |

**These checks are UI-only conveniences.** The backend validates permissions on every request regardless of what the frontend renders or hides.

---

## 9. Frontend Validations

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

On mount, the form captures the original appointment values. Before submitting, it compares current values against originals (ISO string comparison for dates, value equality for strings). If nothing changed, the API is never called — the user sees a "No changes detected" toast.

### API error display

All data hooks extract `error.response.data.message` from Axios errors and surface it as an MUI `Alert` inside the relevant page. For example, a `409 Conflict` from the backend renders:

> "The user already has an appointment scheduled from ... Please choose a different time slot."

### HTTP status codes handled

| Code | Scenario |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Validation error (displayed as Alert) |
| `401` | Unauthorized (interceptor handles refresh or redirects to /login) |
| `403` | Forbidden (redirected to /dashboard) |
| `404` | Not found (displayed as Alert) |
| `409` | Scheduling conflict (backend message displayed) |

---

## 10. Key Architecture Decisions

### No global state library

Context API + custom hooks is sufficient for this scope. Adding Redux or Zustand would introduce accidental complexity with no measurable benefit. If the app grew to 10+ feature domains with cross-cutting shared state, the decision should be revisited.

### Soft delete with undo

Deleting an appointment sets its status to `DELETED` — no row is removed from the database. The UI removes the row immediately (optimistic update) and shows a Sonner toast with an **Undo** button. If undo is clicked within 5 seconds, the API call is cancelled via `clearTimeout`. The user gets instant feedback; the data is always recoverable.

### Timezone handling

The backend stores and returns all datetimes as UTC ISO 8601 strings.

| Context | Conversion |
|---|---|
| Table display | ISO string → browser local time via `new Date().toLocaleString()` |
| Edit form pre-fill | UTC ISO → `datetime-local` format via local conversion in `AppointmentForm.tsx:49` |
| Form submission | `datetime-local` value → UTC ISO via `new Date(value).toISOString()` |

The user always sees and enters times in their local timezone. The backend always receives UTC.

### Dark mode

`ColorModeProvider` wraps the entire app and manages the active MUI theme. Toggling persists to `localStorage` (key: `ams-color-mode`) so the preference survives reloads. The Sonner `Toaster` adapts to the current mode so toast styling remains consistent.

### Lazy-loaded routes

Every page is imported via `React.lazy()`. Vite automatically creates separate chunks for each route page. The `Suspense` wrapper shows a centered `CircularProgress` while a chunk is loading.

### Shared appointment form for create and edit

`AppointmentFormPage` detects whether it's in create mode (no `id` param) or edit mode (`:id` param present) and passes the appropriate `initialValues` to `AppointmentForm`. The same component handles both flows, reducing duplication.

---

## 11. Good Practices Applied

| Practice | Where |
|---|---|
| TypeScript strict mode — no `any`, all types explicit | All source files |
| Axios interceptor dedup queue — prevents concurrent refresh race conditions | `src/api/client.ts:29-45` |
| Optimistic UI + undo — instant feedback, API called after 5s timeout | `AppointmentsPage.tsx:108-147` |
| Skeleton loading — contextual MUI Skeleton instead of a generic spinner | `SkeletonTable`, `StatCardSkeleton` |
| API error extraction — `error.response.data.message` propagated to UI | All data hooks |
| Timezone-aware date handling — display in local time, submit in UTC | `AppointmentForm.tsx`, `src/utils/date.ts` |
| Dark mode — persisted to `localStorage` | `ColorModeContext.tsx` |
| Context API over Redux — right-sized state management | `AuthContext`, `ColorModeContext` |
| Lazy-loaded routes — Vite code splitting per route | `src/routes/AppRouter.tsx` |
| Centralised API paths — no hardcoded URLs outside `src/api/` | `src/api/*.ts` |
| Controlled form components — all form state managed via React state | `AppointmentForm.tsx` |
| Immutable state updates — never mutate state directly | All hooks |
| No `@ManyToOne` in backend — frontend types mirror flat DTOs | `src/types/appointment.ts` |

---

## 12. Backend Integration

This frontend is designed to work with the [Appointment-Management-back](https://github.com/Ancreem/Appointment-Management-back) Spring Boot API.

### API base path

All requests go to `VITE_API_BASE_URL` (default: `http://localhost:8080/api/v1`).

### CORS

The backend is configured to accept requests from `http://localhost:5173` (the Vite dev server). For production, update `allowedOrigins` in the backend's security configuration.

### Vite proxy (development)

`vite.config.ts` proxies `/api` to `http://localhost:8080`, so the frontend and backend appear on the same origin during development. This eliminates CORS issues entirely in dev mode.

### Endpoints consumed

| Frontend function | Backend endpoint | Hook |
|---|---|---|
| `authApi.login()` | `POST /auth/login` | `useAuth` |
| `authApi.refresh()` | `POST /auth/refresh` | interceptor |
| `authApi.logout()` | `POST /auth/logout` | `useAuth` |
| `appointmentsApi.getAll()` | `GET /appointments` or `/appointments/my` | `useAppointments` |
| `appointmentsApi.getById()` | `GET /appointments/{id}` | `useAppointments` |
| `appointmentsApi.create()` | `POST /appointments` | `useAppointments` |
| `appointmentsApi.update()` | `PUT /appointments/{id}` | `useAppointments` |
| `appointmentsApi.updateStatus()` | `PUT /appointments/{id}` | `useAppointments` |
| `appointmentsApi.deleteById()` | `DELETE /appointments/{id}` | `useAppointments` |
| `usersApi.getAll()` | `GET /users` | `useUsers` (ADMIN only) |

### Seed data (from backend)

| Name | Email | Role | Password |
|---|---|---|---|
| Admin | `admin@test.com` | `ADMIN` | `password123` |
| User One | `user1@test.com` | `USER` | `password123` |
| User Two | `user2@test.com` | `USER` | `password123` |

---

## 13. SDD — Spec-Driven Development

This project was built using **SDD (Spec-Driven Development)**, a structured methodology for AI-assisted software development.

### What is SDD?

Before writing any code, SDD requires producing a chain of formal artifacts:

```
Exploration → Proposal → Specification → Domain Model → DB Design
    → API Spec → Architecture → Test Matrix → Implementation Plan → Code
```

Each artifact feeds the next. No phase begins without the previous one being reviewed and accepted.

### Why SDD?

- **Prevents scope creep** — requirements are locked before implementation starts
- **Living documentation** — every design decision is captured and traceable
- **Better AI collaboration** — smaller, verifiable, reviewable units instead of monolithic generation
- **Reduces rework** — catching a design issue in the spec phase costs a fraction of what it costs in code
- **Traceability** — every line of code maps back to a spec requirement

### AI tools used

The entire SDD process was guided by **gentleman-IA** skills and agents, which structured the exploration, specification, design, task breakdown, implementation, and verification phases.

The project was developed with the assistance of **Claude** (Anthropic) and **opencode** as the primary AI pair-programming tools, working iteratively on code generation, refactoring, testing, and documentation.

### Process documentation

The `SDD/` directory at the project root contains the complete process trail:

| File | Content |
|---|---|
| `01_Especificacion.md` | Functional spec derived from the original requirements document |
| `02_Domain_Model.md` | Domain entities, value objects, enums, and invariants |
| `03_Database_Spec.md` | PostgreSQL schema decisions and rationale |
| `04_API_Spec.md` | OpenAPI endpoint definitions |
| `05_Backend_Architecture.md` | Clean Architecture layer breakdown |
| `06_Frontend_Architecture.md` | React component and routing architecture |
| `07_Test_Matrix.md` | 76 test cases across all layers |
| `08_Implementation_Plan.md` | 8-stage implementation plan (~70 tasks) |
| `09_Backend_Code.md` | Backend generation prompt and result |
| `10_Frontend_Code.md` | Frontend generation prompt and result |
| `11_READMEs.md` | Gap analysis and fixes vs. the original specification |

---

## 14. Running Tests

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

# TypeScript type checking
npm run lint
```

### Test coverage

| Type | Tool | Scope |
|---|---|---|
| Unit | Vitest + React Testing Library | 50 tests across 13 suites covering components, hooks, routes, and utils |
| E2E | Playwright | Full user flows (login → create appointment → logout) |

### Unit test inventory

| File | Tests | What it covers |
|---|---|---|
| `src/utils/date.test.ts` | 5 | `formatDateTime`, `formatDate`, `toISOString` edge cases |
| `src/components/ui/StatusChip.test.tsx` | 5 | Status → label mapping for all 5 status values |
| `src/components/ui/EmptyState.test.tsx` | 3 | Title/subtitle rendering with and without subtitle |
| `src/components/ui/SkeletonTable.test.tsx` | 2 | Row and column counting (default and custom rows) |
| `src/components/ui/ConfirmDialog.test.tsx` | 4 | Open/close, confirm callback, cancel callback |
| `src/components/ui/LoadingSpinner.test.tsx` | 1 | Renders CircularProgress |
| `src/components/features/AppointmentTable.test.tsx` | 7 | Rendering, role-based delete visibility, terminal status disable |
| `src/components/features/AppointmentFiltersBar.test.tsx` | 2 | Renders all filters, clear button fires callback |
| `src/components/features/UserTable.test.tsx` | 4 | User rows, role chips, skeleton loading, empty state |
| `src/components/features/AppointmentForm.test.tsx` | 8 | Field rendering, validation rules, admin vs user, loading state |
| `src/routes/PrivateRoute.test.tsx` | 3 | Authenticated outlet, unauthenticated redirect, loading spinner |
| `src/routes/AdminRoute.test.tsx` | 3 | ADMIN outlet, USER redirect, null user redirect |
| `src/pages/LoginPage.test.tsx` | 3 | Form rendering, login call, error message display |
| **Total** | **50** | **13 test suites** |
