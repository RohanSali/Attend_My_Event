# AttendMyEvent

**Discover local events. Share your own. Know when and where to go.**

AttendMyEvent is a location-aware event discovery and invitation web application. People can publish events with venue, schedule, visibility, registration instructions, and optional host-provided fee/payment information. Other users can discover eligible public events through a map and event list, inspect event status, open details, and navigate to a venue.

> **Project status:** A first working slice is implemented: visitors can browse, search, and filter events, and hosts can publish an event through the UI. FastAPI validates event details and saves them to a local SQLite database. Authentication, maps, registration, and the larger features described below are not implemented yet.

## Contents

- [Project overview](#project-overview)
- [Core capabilities](#core-capabilities)
- [Technology stack](#technology-stack)
- [Tailwind CSS: where styles belong](#tailwind-css-where-styles-belong)
- [Architecture](#architecture)
- [Suggested directory structure](#suggested-directory-structure)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Local setup](#local-setup)
- [Running the application](#running-the-application)
- [Firebase and Firestore setup](#firebase-and-firestore-setup)
- [Implemented API](#implemented-api)
- [Future API scope](#future-api-scope)
- [Data and file-storage notes](#data-and-file-storage-notes)
- [Testing and quality checks](#testing-and-quality-checks)
- [Security checklist](#security-checklist)
- [Troubleshooting](#troubleshooting)
- [Implementation roadmap](#implementation-roadmap)
- [Related documentation](#related-documentation)

---

## Project overview

AttendMyEvent helps people discover activities happening around them, from community gatherings and cultural celebrations to concerts, sports, workshops, parties, and other events.

The main dashboard combines:
- An interactive map with event markers.
- A companion list of events.
- Search and filters.
- Status labels such as “In 3 hours,” “Starting soon,” “Live,” and “Ended.”
- Event selection and a **Navigate** action that focuses the map and can provide external directions.

Hosts can create an event in a flexible editor. The product keeps core discovery fields structured while allowing hosts to add notes, instructions, links, registration details, fees, and a payment QR image.

**Payment boundary:** AttendMyEvent displays information supplied by the host. Unless a separately specified payment integration is implemented, it does not collect, verify, hold, transfer, or refund event payments.

## Core capabilities

### Attendees
- Discover public upcoming and active events.
- Browse map markers and event cards together.
- Search by event title, category, area, or date.
- View event details, host information, timing, venue, and instructions.
- Register or follow the host's stated registration process when available.
- Receive and manage in-app notifications.
- Maintain a basic user profile.

### Hosts
- Save event drafts and publish when ready.
- Add venue, date/time, public/private visibility, and optional descriptive details.
- Provide a registration method, fee information, payment QR, and attendee notes.
- Edit or cancel their own events.
- Review registrations if in-app registration is enabled.

### Platform
- Firebase Authentication for user identity.
- Cloud Firestore for application records.
- FastAPI for protected API routes and server-side validation.
- Map and geocoding provider for location-based discovery.
- Responsive, accessible UI with useful loading, empty, and error states.

## Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | ReactJS + Vite + Tailwind CSS | Pages, reusable components, responsive layouts and styling |
| Backend | FastAPI (Python) | API, validation, authorization, business logic |
| Authentication | Not implemented yet; Firebase Authentication is a future option | User sign-in and identity |
| Database | SQLite for the current event prototype; Cloud Firestore is a future option | Event records |
| Map | Not implemented yet | Map display, markers, focusing and directions |
| Geocoding | To be selected | Address-to-coordinate conversion |
| File storage | To be confirmed | Event images, profile photos, payment QR images |
| Local folder | `data/` | Development data or explicitly documented local files |

## Tailwind CSS: where styles belong

Tailwind CSS is the frontend styling system. Use it for page layout, spacing, responsive behaviour, typography, borders, colours, and component states. Because Tailwind v3 and v4 have different setup conventions, **check the installed version before changing configuration**:

```bash
cd frontend
npm ls tailwindcss
```

If Tailwind is already working, do not reinstall or replace its configuration just to match this guide. Preserve the project's existing setup and make only the changes needed.

### What goes in which file?

| File/location | Responsibility |
|---|---|
| `src/index.css` (or the CSS file imported by `main.jsx`) | Tailwind entry point; keep component styling in JSX utility classes |
| `tailwind.config.js` | Tailwind v3 content paths and theme extensions; do not assume this exact config is required for Tailwind v4 |
| `src/styles/` | Optional global styles only when needed; avoid moving utility-styled components back into standalone CSS |
| `src/components/common/` | Reusable Button, Input, Badge, Card, Modal, Toast, and loading components with consistent style variants |
| `src/components/layout/` | Navbar, page container, responsive shells and navigation layouts |
| `src/features/**/` | Feature-specific component markup and Tailwind utility classes, e.g. dashboard, events, profile and notifications |
| `UI.md` | Source of truth for the visual rules, palette, spacing, component variants and page layouts |

Keep component styling in Tailwind utility classes in the JSX. Use reusable components for repeated patterns. Avoid adding standalone CSS for component styling unless it is complex, depends on a third-party library, or is awkward to express with utilities.

### Tailwind CSS v4 entry stylesheet example

Use this pattern only if `npm ls tailwindcss` shows Tailwind v4 and the project is configured for v4. Install/configure the Vite integration according to the current project setup; do not combine this with the v3 directives.

```css
/* frontend/src/index.css */
@import "tailwindcss";

:root {
  --color-primary-900: #17324d;
  --color-primary-700: #24577a;
  --color-primary-600: #2f6f96;
  --color-primary-100: #e8f2f8;
  --color-accent-500: #f4a340;
  --color-bg: #f6f8fb;
  --color-surface: #ffffff;
  --color-text: #17212b;
  --color-text-muted: #657384;
  --color-border: #dce3ea;
}

@theme {
  --color-brand-900: #17324d;
  --color-brand-700: #24577a;
  --color-brand-600: #2f6f96;
  --color-brand-100: #e8f2f8;
  --color-accent-500: #f4a340;
}

html { scroll-behavior: smooth; }
body { margin: 0; background: var(--color-bg); color: var(--color-text); }
```

This makes utilities such as `bg-brand-600` and `text-brand-900` available through the v4 theme tokens, while the CSS variables remain useful for non-Tailwind styles and map overlays.

### Tailwind CSS v3 entry stylesheet example

Use this pattern only if the project uses Tailwind v3. Ensure `tailwind.config.js` has correct content paths for the actual frontend structure.

```css
/* frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary-900: #17324d;
  --color-primary-700: #24577a;
  --color-primary-600: #2f6f96;
  --color-primary-100: #e8f2f8;
  --color-accent-500: #f4a340;
  --color-bg: #f6f8fb;
  --color-surface: #ffffff;
  --color-text: #17212b;
  --color-text-muted: #657384;
  --color-border: #dce3ea;
}

html { scroll-behavior: smooth; }
body { margin: 0; background: var(--color-bg); color: var(--color-text); }
```

Example v3 `tailwind.config.js` theme extension:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 900: '#17324d', 700: '#24577a', 600: '#2f6f96', 100: '#e8f2f8' },
        accent: { 500: '#f4a340' },
      },
    },
  },
  plugins: [],
};
```

### Confirm the stylesheet is loaded

The main entry point (usually `src/main.jsx`) must import the stylesheet exactly once, for example:

```jsx
import './index.css';
```

Use the path that matches your real project. Avoid importing multiple competing global stylesheets. If the project uses a different filename, keep it and update the import accordingly.

### Styling conventions

- Use semantic HTML and Tailwind utilities for layout and appearance.
- Use `sm:`, `md:`, `lg:`, and other responsive prefixes to build mobile-first layouts.
- Centralize brand colours in theme tokens; do not invent slightly different blues/greys on each page.
- Build reusable components with clear variants such as `primary`, `secondary`, `ghost`, and `danger`.
- Keep dynamic class names statically discoverable by Tailwind. Avoid building class names by concatenating fragments such as ``bg-${color}-500``; map states to complete class strings instead.
- Do not use `@apply` for every component; reserve it for small, genuinely shared CSS patterns when appropriate.

---

## Architecture

Recommended request flow:

```text
┌──────────────────────────┐
│ React + Vite Frontend    │
│ Dashboard, Forms, Profile│
└────────────┬─────────────┘
             │ Firebase Auth sign-in
             ▼
┌──────────────────────────┐
│ Firebase Authentication  │
└────────────┬─────────────┘
             │ ID token
             ▼
┌──────────────────────────┐
│ FastAPI Backend          │
│ Verify token, validate   │
│ input, enforce ownership │
└────────────┬─────────────┘
             │ trusted server access
             ▼
┌──────────────────────────┐
│ Cloud Firestore          │
│ Users, Events, etc.      │
└──────────────────────────┘

Map/geocoding provider ─── Frontend or backend, according to provider design
Object/file storage ────── Event covers, profile images, QR images
```

### Important architecture rule

For each type of record, decide whether reads/writes go through FastAPI or directly through the Firebase client SDK. Avoid duplicating write paths without a clear reason.

A good default for sensitive operations is:

**Frontend → FastAPI → Firebase Admin SDK/Firestore**

FastAPI must verify the Firebase ID token and derive the user UID from the verified token. Never trust a user ID supplied in a request body as proof of identity. If selected low-risk operations use direct Firestore access, secure them with strict Firestore Security Rules.

---

## Suggested directory structure

Adapt this proposal to the files that already exist; do not delete or rename working files merely to match the example.

### Current frontend structure

The implemented event dashboard is split by responsibility:

```text
frontend/src/
├── api/events.js              # Event GET and POST requests
├── components/                # Header, footer, banner, event list, cards, and form
├── constants/events.js        # Event categories and form defaults
├── utils/events.js            # Event ordering and date formatting
├── App.jsx                    # Page state and component composition
├── index.css                  # Tailwind CSS entry point
└── main.jsx                   # React application entry point
```

Component styling uses Tailwind utility classes in JSX; `index.css` only imports Tailwind.

```text
AttendMyEvent/
├── frontend/                         # Existing React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── app/                      # App shell, routes, providers
│   │   ├── assets/                   # Static visual assets
│   │   ├── components/
│   │   │   ├── common/               # Button, Input, Modal, Toast, Loader
│   │   │   ├── layout/               # Navbar, Sidebar, PageContainer
│   │   │   ├── events/               # EventCard, EventStatus, EventForm
│   │   │   ├── map/                  # MapView, EventMarker, MapControls
│   │   │   └── notifications/        # NotificationBell, NotificationItem
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── event-details/
│   │   │   ├── event-management/
│   │   │   ├── profile/
│   │   │   └── notifications/
│   │   ├── hooks/
│   │   ├── lib/                      # Firebase client, map client, utilities
│   │   ├── services/                 # API client and feature services
│   │   ├── styles/                   # Global CSS, design tokens, Tailwind entry stylesheet
│   │   ├── types/                    # Shared frontend types
│   │   ├── utils/                    # Date/status/format helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── index.css or src/index.css    # Tailwind entry stylesheet (actual location may vary)
│   └── tailwind.config.js            # Tailwind v3; optional/not required in the same form for v4
│
├── backend/                          # Existing FastAPI application
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── routes/
│   │   │       │   ├── health.py
│   │   │       │   ├── events.py
│   │   │       │   ├── users.py
│   │   │       │   ├── registrations.py
│   │   │       │   └── notifications.py
│   │   │       └── router.py
│   │   ├── core/                     # Settings, security, logging
│   │   ├── schemas/                  # Pydantic request/response models
│   │   ├── services/                 # Business rules
│   │   ├── repositories/             # Firestore access layer
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── main.py
│   ├── tests/
│   ├── .env.example
│   └── requirements.txt              # Or pyproject.toml, if already used
│
├── data/                             # Existing folder; document its purpose
│   └── README.md                     # Explain what belongs here
│
├── docs/
│   ├── SRS.md
│   ├── README.md
│   └── UI.md
├── .gitignore
└── README.md                         # This guide
```

### Directory guidelines
- Keep frontend and backend responsibilities separate.
- Keep API route handlers thin; put business logic in services and Firestore access in repositories.
- Keep reusable UI primitives separate from feature-specific components.
- Never put service-account JSON files, private keys, production exports, or user-sensitive data in `data/` if that folder is committed to Git.
- If your repository already has a different layout, document the real layout rather than reorganising unnecessarily.

---

## Prerequisites

Install or configure:
- A supported Node.js LTS release and npm (or the package manager already used by the repository).
- Python version supported by the project's installed FastAPI dependencies.
- A Firebase project with Authentication and Cloud Firestore enabled.
- A map provider key/account if required by the chosen provider.
- A file-storage service if uploads are required.
- Git (recommended).

Check versions:

```bash
node --version
npm --version
python --version
```

Use the Python executable and package manager for the intended virtual environment. If the repository already has a lockfile or dependency manager, prefer it over introducing another one.

---

## Configuration

**Do not copy real secrets into this document or commit `.env` files.** Create local environment files from the examples and add real values only on your machine or deployment secret store.

### Frontend environment

Vite exposes variables prefixed with `VITE_` to browser code. Only place values here that are safe to expose publicly, such as Firebase web-app configuration and a public map key restricted by provider settings.

Example `frontend/.env.example`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

# Firebase web app configuration (public client configuration;
# secure access through Authentication and Firestore Rules).
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Set only after selecting a provider.
VITE_MAP_PROVIDER=
VITE_MAP_PUBLIC_KEY=
```

Copy to `.env` and fill in the values from the Firebase console and chosen map provider. Variable names must match the actual application code.

### Backend environment

Example `backend/.env.example`:

```dotenv
APP_NAME=AttendMyEvent API
APP_ENV=development
API_V1_PREFIX=/api/v1
HOST=127.0.0.1
PORT=8000
CORS_ORIGINS=http://localhost:5173

FIREBASE_PROJECT_ID=
# Configure Firebase Admin credentials using the method selected for your
# environment (application default credentials or a protected service account).
# Do not commit a service-account JSON file.

# Configure map/geocoding secrets here only if server-side calls require them.
MAPS_SERVER_API_KEY=
```

The backend settings implementation must load and validate these variables. Do not assume every variable exists in the current codebase until it has been implemented.

### `.gitignore` checklist

Ensure `.gitignore` excludes at least:
- `.env`, `.env.*` (while allowing `.env.example`).
- Python virtual environments, `__pycache__/`, `.pytest_cache/`.
- `node_modules/`, `dist/`.
- Service-account keys and credential JSON files.
- Local logs, database dumps, private uploads, and sensitive generated files.
- Editor/OS temporary files.

---

## Local setup

The following commands are a conventional setup path. If your repository already has dependencies installed, skip the installation steps you have completed.

### 1. Clone or open the project

```bash
git clone <your-repository-url>
cd AttendMyEvent
```

If the project already exists locally, open its root directory instead.

### 2. Install frontend dependencies

```bash
cd frontend
npm install
npm ls tailwindcss
```

Confirm that Tailwind CSS is installed and identify its major version before editing the stylesheet or configuration. Follow the matching v3 or v4 example in [Tailwind CSS: where styles belong](#tailwind-css-where-styles-belong). Do not mix v3 directives with the v4 setup.

If the existing frontend is at the repository root rather than `frontend/`, run the commands in that directory instead. Keep `package-lock.json` committed if npm is the chosen package manager.

### 3. Create and install the backend environment

From the repository root:

**Windows PowerShell**
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

**macOS/Linux**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

### 4. Start the backend

From `backend/`, with the virtual environment active:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API stores events in `backend/events.sqlite3`. Set `EVENT_DATABASE_PATH` to use another SQLite file. `CORS_ORIGINS` accepts a comma-separated list of allowed frontend origins; its default allows the local Vite server.

Available endpoints:
- Health: `http://127.0.0.1:8000/health`
- Event list: `http://127.0.0.1:8000/api/events`
- API documentation: `http://127.0.0.1:8000/docs`

### 5. Start the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Vite proxies API and health requests to `http://127.0.0.1:8000`. When serving the frontend separately from the backend, set `VITE_API_BASE_URL` to the API origin and set the backend's `CORS_ORIGINS` to include the frontend origin.

---

## Running the application

For day-to-day development, run the frontend and backend in separate terminals.

**Terminal A — Backend**
```bash
cd backend
# Activate .venv first
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal B — Frontend**
```bash
cd frontend
npm run dev
```

### Common frontend commands

Check `package.json` for the actual available scripts. Common Vite scripts include:

```bash
npm run dev
npm run build
npm run preview
```

Run linting or tests only if those scripts are configured in the project.

### Backend endpoints

- `GET /health` — backend health check.
- `GET /api/events` — all events, with upcoming events first.
- `POST /api/events` — create an event and return it with HTTP 201.

An event requires `title` (3–100 characters), `category`, `venue` (2–160 characters), and timezone-aware `starts_at` / `ends_at` timestamps. `ends_at` must be after `starts_at`. `description` is optional (up to 2,000 characters). Invalid inputs receive HTTP 422 responses.

Example event body:

```json
{
  "title": "Sunday morning run",
  "category": "Sports & outdoors",
  "venue": "Riverside Park",
  "description": "A relaxed 5 km loop. All paces welcome.",
  "starts_at": "2026-10-18T07:00:00+05:30",
  "ends_at": "2026-10-18T08:00:00+05:30"
}
```

---

## Firebase and Firestore setup

### Authentication
1. Create or select the Firebase project.
2. Enable the sign-in providers required by the product.
3. Register the web app and configure the Firebase client SDK.
4. Add the approved web configuration to the frontend environment.
5. Use Firebase Authentication state to control protected UI.
6. Send the Firebase ID token to FastAPI for protected API requests.

### Backend token verification
- Initialize Firebase Admin SDK on the server.
- Verify ID tokens for protected routes.
- Obtain the authenticated UID from the verified token.
- Check resource ownership and roles on every protected operation.
- Do not trust a UID or role sent by the browser.
- Use application-default credentials or a secret-managed service-account credential appropriate to the deployment environment.

### Firestore
A starting collection model is:

```text
users/{uid}
events/{eventId}
events/{eventId}/registrations/{registrationId}
users/{uid}/notifications/{notificationId}
eventReports/{reportId}
```

This is a proposal, not a claim that these collections already exist. Confirm query patterns before finalising the model. Add indexes for actual filtered/sorted queries based on Firestore's index guidance.

### Security Rules
- Start with deny-by-default rules.
- Allow users to read/update only the fields and records intended for them.
- Prevent ordinary users from changing role/admin fields.
- Enforce public/private/draft visibility.
- Protect registrations and notifications so users can access only their own data, with a defined exception for the relevant event host.
- Remember that privileged Firebase Admin SDK operations bypass Firestore Security Rules; backend authorization is therefore essential.

---

## Future API scope

The following routes are future scope, not part of the current implementation. The current API is documented above and uses `/api/events`.

| Method | Example route | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/events` | Public event discovery with filters and pagination |
| GET | `/api/v1/events/{event_id}` | Event details subject to visibility checks |
| POST | `/api/v1/events` | Create draft |
| PATCH | `/api/v1/events/{event_id}` | Edit an owned event |
| POST | `/api/v1/events/{event_id}/publish` | Validate and publish |
| POST | `/api/v1/events/{event_id}/cancel` | Cancel event |
| POST | `/api/v1/events/{event_id}/registrations` | Register, if in-app registration is enabled |
| GET | `/api/v1/me` | Current profile |
| PATCH | `/api/v1/me` | Update profile |
| GET | `/api/v1/me/notifications` | Current user's notifications |

Example authenticated frontend request pattern:

```javascript
const user = auth.currentUser;
if (!user) {
  throw new Error("Sign in is required.");
}

const token = await user.getIdToken();

const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

if (!response.ok) {
  throw new Error("Unable to load events.");
}

const events = await response.json();
```

Adapt imports and variable names to the project's Firebase setup. Public discovery endpoints may not require a token; protected endpoints should. Avoid attaching tokens unnecessarily to public requests.

---

## Data and file-storage notes

### What belongs in `data/`?
Keep the purpose explicit in `data/README.md`. Depending on the project, it may contain:
- Non-sensitive local development fixtures.
- Seed data for local testing.
- Exported test results.
- Temporary development files.

Do not use a committed local directory as the only production store for user-generated uploads or durable application records. Local files can disappear during deployment or be unavailable across instances.

### Images and payment QR codes
- Store the actual binary in a suitable storage service.
- Save only the required URL and metadata in Firestore.
- Restrict file types and size.
- Apply access control to private-event assets.
- Ensure URLs cannot be used to inject executable content.
- Clearly label QR/payment information as supplied by the event host.

### Event timestamps
Store event timestamps in a consistent format and preserve the intended time zone. Use server-side status calculation or a shared, tested helper so that the dashboard, detail page, and notifications do not disagree.

---

## Testing and quality checks

Before a release, verify:

- [ ] Sign-up/sign-in and sign-out.
- [ ] Protected routes reject missing/invalid tokens.
- [ ] A user cannot edit another user's event.
- [ ] Draft/private events are absent from public search and map results.
- [ ] Publishing rejects missing required fields.
- [ ] Event status is correct before, during, and after an event.
- [ ] Map selection and event list selection remain synchronised.
- [ ] Geolocation denial still allows manual area search.
- [ ] Map failure still leaves a usable event list.
- [ ] Registration prevents duplicate active entries if enabled.
- [ ] Notification reads are scoped to the signed-in user.
- [ ] Uploads enforce size/type/access restrictions.
- [ ] No secrets are bundled into the frontend or committed.
- [ ] Mobile layouts, keyboard navigation, form errors, and loading/empty states are usable.

Suggested tools, depending on the dependencies already installed:
- Frontend: the project's configured linter and test runner.
- Backend: `pytest` and FastAPI's test client.
- Firebase: a separate test project or Firebase Emulator Suite where practical.
- Browser: manual smoke tests across supported viewport sizes.

---

## Security checklist

- Never commit `.env`, private keys, Firebase service-account JSON, or real user exports.
- Never put Firebase Admin credentials in a `VITE_` variable.
- Verify Firebase ID tokens on protected FastAPI endpoints.
- Derive identity from verified token claims.
- Enforce ownership and role checks server-side.
- Do not rely on frontend hiding for privacy.
- Use Firestore Security Rules for direct client access.
- Limit public profile fields and attendee data.
- Validate URLs, user text, images, QR files, and event timestamps.
- Use HTTPS in production and configure CORS for explicit origins.
- Avoid logging tokens, payment details, or unnecessary personal information.
- Add abuse reporting/rate limits before opening event creation broadly to the public.

---

## Troubleshooting

### `npm run dev` fails
- Confirm you are in the directory containing the correct `package.json`.
- Run `npm install` using the repository's chosen package manager.
- Check the Node.js version and read the first meaningful error in the terminal.

### Python package import fails
- Confirm the virtual environment is active.
- Check the Python version required by the project's dependencies.
- Reinstall dependencies using the existing requirements/lock file.

### Frontend cannot call FastAPI
- Confirm the backend is running.
- Check `VITE_API_BASE_URL`.
- Check FastAPI CORS configuration and the exact frontend origin.
- Inspect browser network errors and backend logs.

### Firebase authentication works but protected API returns `401`
- Ensure the frontend sends a current Firebase ID token in `Authorization: Bearer <token>`.
- Ensure the backend verifies tokens against the intended Firebase project.
- Check server-side credential configuration and token expiry.

### Firestore returns permission errors
- Confirm the app points to the intended project.
- Review Security Rules and the authenticated UID.
- If using Firebase Admin in FastAPI, check backend authorization logic; Admin SDK calls bypass Firestore Security Rules.

### Map is blank
- Confirm provider selection, public key, allowed domains, billing/usage setup if required, and browser console errors.
- Check required attribution and map style configuration.
- Ensure the list fallback remains available.

### Event status is incorrect
- Inspect stored start/end timestamps and time zone.
- Confirm all components use the same status helper or API result.
- Test events around start/end boundaries and daylight-saving changes where relevant.

---

## Implementation roadmap

1. **Foundation:** environment configuration, Firebase Authentication, token verification, Firestore model/rules, health endpoint.
2. **Event lifecycle:** draft editor, required-field validation, publishing, editing, cancellation, ownership checks.
3. **Discovery:** map provider, geocoding, list/map synchronisation, search, filters, event status.
4. **Details and registration:** event details, host instructions, registration modes, fee/QR display.
5. **Notifications and profile:** notification centre, unread state, profile and user's event management.
6. **Hardening:** access-control tests, moderation/reporting, responsive/accessibility checks, logging, deployment configuration.

## Related documentation

- [`SRS.md`](SRS.md) — functional and non-functional requirements, data model, business rules, workflows, acceptance criteria.
- [`UI.md`](UI.md) — visual design system, pages, components, responsive behaviour, and wireframes.

---

**Development principle:** implement the smallest complete, secure workflow first. Keep event creation flexible, but keep visibility, time, location, ownership, and registration rules explicit and testable.
