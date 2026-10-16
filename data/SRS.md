# AttendMyEvent — Software Requirements Specification (SRS)

**Document version:** 1.0  
**Status:** Initial product specification  
**Project:** AttendMyEvent  
**Client:** Web application  
**Frontend:** ReactJS + Vite + Tailwind CSS  
**Backend:** FastAPI  
**Authentication:** Firebase Authentication  
**Database:** Cloud Firestore  
**Local application data:** `data/` directory (development assets, exports, or explicitly approved local files)

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for **AttendMyEvent**, a location-aware event discovery and invitation platform. It is intended to align product design, frontend and backend implementation, data modelling, testing, and future development.

AttendMyEvent allows people or organisations to publish events, share invitations, discover public events nearby, inspect event timing and location, navigate to event venues, and register or respond according to the host's instructions. Event hosts retain responsibility for collecting fees and managing any external payment process unless a future, separately specified payment integration is introduced.

### 1.2 Product vision

Make it easy for anyone to publish an event and for relevant people nearby to discover it, understand its status, and decide whether to attend.

Examples include:
- Home parties and private gatherings.
- Traditional, cultural, religious, and community events.
- Ganpati mandal visits and local celebrations.
- Garba nights, concerts, pub events, and social meetups.
- Cricket matches, tournaments, workshops, talks, and other public activities.

The product should support varied event types without forcing hosts into a narrow event template. A small set of core fields remains mandatory for safety, discovery, and useful event listings.

### 1.3 Scope

**In scope for the web application**
- Firebase-based sign-up, sign-in, sign-out, and authenticated session handling.
- User profile and basic account information.
- Event creation, editing, draft saving, publishing, cancellation, and deletion/archiving rules.
- Flexible event descriptions and host-provided instructions.
- Required venue/location and event date/time information.
- Public/private visibility.
- Event discovery through a map and a companion event list on the main dashboard.
- Event status labels such as upcoming, starting soon, in progress, ended, cancelled, or time not confirmed.
- Event details, host details, registration instructions, optional capacity and fee information, and host-provided payment QR image or payment instructions.
- Registration/attendance intent where enabled by the host.
- In-app notifications and notification centre.
- Responsive layouts and accessible UI states.
- Backend validation and protected API operations.
- Firestore data storage and security rules.
- Basic operational logging and error handling.

**Not included unless explicitly approved as a later phase**
- AttendMyEvent holding, transferring, refunding, or guaranteeing payments.
- Built-in payment gateway, escrow, ticket settlement, or financial reconciliation.
- Guaranteed identity verification of every host or attendee.
- Native iOS/Android applications.
- Real-time chat, video calls, or social feeds.
- Automated ticket resale.
- Guaranteed turn-by-turn navigation from a proprietary mapping engine. The application may focus the map on an event and provide an external directions link.
- Guaranteed delivery of push notifications while the application is closed. This depends on a separately configured push-notification implementation.

### 1.4 Definitions

| Term | Meaning |
|---|---|
| Host | Authenticated user who creates or manages an event. |
| Attendee | User who views an event and may register or indicate attendance. |
| Event | A scheduled activity represented by a listing. |
| Draft | An event saved privately by its host and not discoverable by others. |
| Public event | Event eligible to appear in public discovery, subject to moderation and visibility rules. |
| Private event | Event not shown in public discovery; access is controlled by the host's chosen sharing/invitation mechanism. |
| Registration | An attendee's recorded intent to attend, when registration is enabled. |
| Event status | Time- and host-dependent state such as upcoming, live, ended, or cancelled. |
| Geolocation | A user's optional location used to centre nearby discovery. |
| Payment QR | A QR image or payment instruction supplied by the host. It is not proof that AttendMyEvent processed or verified a payment. |

### UI implementation and styling requirements

- The React frontend shall use **Tailwind CSS** for layout, spacing, responsive breakpoints, typography, colours, borders, and interaction states.
- Shared colours and design tokens shall be centralized in the global stylesheet and/or Tailwind theme configuration, depending on the installed Tailwind major version.
- Reusable components (buttons, inputs, badges, cards, dialogs, and notification items) shall use consistent variants instead of repeating inconsistent styling across pages.
- Global CSS shall be reserved for font setup, base document styles, design-token variables, map-provider overrides, and genuinely global rules.
- Responsive layouts shall use Tailwind responsive utilities and be tested at mobile, tablet, and desktop widths.
- Tailwind classes do not replace semantic HTML, accessible labels, keyboard support, or sufficient colour contrast.

### 1.5 Assumptions and dependencies

- The project already has a ReactJS frontend created with Vite, a FastAPI backend, and a `data/` directory.
- Firebase Authentication is the identity provider.
- Cloud Firestore is the primary application database.
- A map provider and geocoding service must be selected and configured before map discovery can be production-ready.
- Users may deny browser location permission; manual location search must remain available.
- Dates and times are stored in a consistent machine-readable format and displayed in the event's local time zone where possible.
- Firebase configuration and privileged credentials are managed through environment configuration, not committed to source control.
- Payment QR codes and payment details are supplied by the host and are outside AttendMyEvent's payment-processing responsibility.

---

## 2. Overall Description

### 2.1 Product perspective

AttendMyEvent is a web client backed by a FastAPI service and Firebase services. The frontend presents the user experience, map, event list, forms, profile, and notifications. FastAPI provides server-side operations where needed, including validation, business rules, secure integrations, and operations that should not be trusted to a browser client. Firebase Authentication establishes user identity, while Firestore stores application records. Tailwind CSS is the standard utility-first styling system for the React frontend. Shared design tokens, global styles, and reusable component patterns must be centralized rather than duplicated across pages.

A recommended high-level flow is:

1. A user signs in through Firebase Authentication.
2. The frontend obtains the user's authenticated identity token.
3. The frontend calls protected FastAPI endpoints with the token when using the API.
4. FastAPI verifies the token with the Firebase Admin SDK for protected operations.
5. The backend validates input and reads or writes Firestore records using server-side credentials.
6. The frontend displays the result and provides clear loading, empty, success, and error states.

**Architecture decision to preserve:** choose one authoritative write path for each data type. For records managed by FastAPI, prefer frontend → FastAPI → Firestore. Do not casually mix direct client writes and backend writes, because duplicated business rules and inconsistent permissions can create security gaps. Direct Firestore client access may be used for specifically designed features, but must be protected by Firestore Security Rules.

### 2.2 User classes

| User class | Description | Main capabilities |
|---|---|---|
| Visitor | Not signed in | View public discovery content and public event details allowed by policy; prompted to sign in for protected actions. |
| Registered user | Signed-in attendee | Manage profile, save/respond/register for events where available, receive in-app notifications, discover events. |
| Event host | Registered user who creates events | Create and manage own drafts and published events, configure visibility and registration, provide venue and fee instructions, review registrations if enabled. |
| Moderator/admin | Privileged operator, if implemented | Review reports, hide unsafe listings, manage abuse and platform integrity. This role must be assigned securely and is not self-selectable. |

A host is not a separate account type by default; a registered user may also host events.

### 2.3 Operating environment

- Modern desktop and mobile browsers.
- ReactJS application built and served using Vite during development.
- FastAPI application served by an ASGI server such as Uvicorn.
- Firebase Authentication and Cloud Firestore.
- Map tiles, geocoding, and directions from a selected map provider.
- Development machines may store non-secret local assets in `data/`; production persistence should rely on the configured cloud services or explicitly provisioned durable storage.

### 2.4 Constraints

- The application must not expose Firebase Admin credentials, private API keys, or server secrets in frontend code.
- Client-provided user IDs, host IDs, event ownership, registration counts, and roles must not be trusted without server-side or database-rule validation.
- Private events must not leak through public list, map, search, or API endpoints.
- Event time calculations must handle time zones, daylight-saving transitions where relevant, and invalid date ranges.
- Uploaded images and QR codes must have size/type limits and safe storage/access rules.
- Map-provider terms, usage limits, and attribution requirements must be followed.
- The product must make the payment boundary clear: hosts manage payments outside the platform unless an approved payment feature is added.

### 2.5 Design principles

1. **Flexible but structured:** free-form event descriptions plus a small set of required discovery fields.
2. **Map-first discovery:** the map and event list work together on the main dashboard.
3. **Trust and clarity:** show host, timing, venue, visibility, and registration/payment instructions clearly.
4. **Low-friction creation:** save drafts and progressively disclose optional fields.
5. **Privacy by default:** do not publish drafts, private events, or unnecessary profile details.
6. **Responsive and accessible:** usable with touch, keyboard, screen readers, and small screens.
7. **Secure boundaries:** authenticate, authorize, validate, rate-limit sensitive actions, and log relevant failures.

---

## 3. Functional Requirements

Priority convention: **P0 = essential for initial usable release**, **P1 = important**, **P2 = later enhancement**.

### 3.1 Authentication and session management

- **FR-AUTH-01 (P0):** The system shall allow users to sign up and sign in using Firebase Authentication.
- **FR-AUTH-02 (P0):** The system shall support sign-out and reflect session state in the UI.
- **FR-AUTH-03 (P0):** Protected actions shall require a valid authenticated session.
- **FR-AUTH-04 (P0):** FastAPI shall verify Firebase ID tokens on protected endpoints using trusted server-side verification.
- **FR-AUTH-05 (P0):** The UI shall display understandable authentication errors without exposing sensitive implementation details.
- **FR-AUTH-06 (P1):** The system should support password reset and email verification if the selected Firebase sign-in methods require them.
- **FR-AUTH-07 (P0):** The application shall not allow a client to self-assign administrative privileges.

### 3.2 User profile

- **FR-PROF-01 (P0):** Each registered user shall have a profile associated with their Firebase UID.
- **FR-PROF-02 (P0):** Users shall be able to view and edit permitted profile fields, such as display name, profile image, and optional short bio.
- **FR-PROF-03 (P0):** Email or provider identity shall be sourced from the authenticated account and updated according to Firebase's supported flow.
- **FR-PROF-04 (P0):** The system shall display the user's own events, including drafts and published events, in a manageable profile area.
- **FR-PROF-05 (P1):** Users should be able to review their registrations or attendance responses.
- **FR-PROF-06 (P0):** Private profile data shall not be exposed in public event APIs unless explicitly intended and consented to.
- **FR-PROF-07 (P1):** Users should be able to request account deletion; deletion handling must define what happens to hosted events and historical registrations.

### 3.3 Event creation and management

- **FR-EVT-01 (P0):** An authenticated user shall be able to create an event as a draft.
- **FR-EVT-02 (P0):** The event editor shall support a title, description, event category/type, venue/location, start date/time, end date/time or duration, and public/private visibility.
- **FR-EVT-03 (P0):** The event editor shall support optional fields including cover image, host notes, attendee instructions, capacity, registration deadline, registration link or method, contact instructions, fee amount/currency, payment QR image, and payment notes.
- **FR-EVT-04 (P0):** Hosts shall be able to save an incomplete draft without making it public.
- **FR-EVT-05 (P0):** The system shall validate mandatory fields before publication.
- **FR-EVT-06 (P0):** The system shall prevent publication when required location or time information is invalid or absent.
- **FR-EVT-07 (P0):** Hosts shall be able to edit their own events and shall not be able to edit events owned by another user.
- **FR-EVT-08 (P0):** Hosts shall be able to publish, cancel, and archive their own events.
- **FR-EVT-09 (P0):** The system shall preserve event status history or cancellation state sufficiently to avoid showing cancelled events as active.
- **FR-EVT-10 (P0):** The event editor shall clearly indicate which fields are mandatory and which are optional.
- **FR-EVT-11 (P1):** The system should autosave or warn about unsaved changes.
- **FR-EVT-12 (P1):** Hosts should be able to duplicate an existing event as a starting point for a new draft.
- **FR-EVT-13 (P0):** Event image and QR uploads shall be validated for allowed file types and size.
- **FR-EVT-14 (P0):** A public event shall not become visible until its required fields and visibility checks pass.
- **FR-EVT-15 (P0):** The system shall prevent an end time earlier than the start time, except where a clearly defined overnight-event model is supported.

### 3.4 Event visibility and access

- **FR-VIS-01 (P0):** Public events may appear in public search, map markers, and event lists.
- **FR-VIS-02 (P0):** Draft events shall be visible only to the owner and authorized operators.
- **FR-VIS-03 (P0):** Private events shall be excluded from public map markers, public search, and public event lists.
- **FR-VIS-04 (P0):** A private event shall be accessible only through an approved invitation/access mechanism and its defined permissions.
- **FR-VIS-05 (P0):** The backend or Firestore Security Rules shall enforce visibility; hiding a UI element alone is insufficient.
- **FR-VIS-06 (P1):** Hosts should be able to share a private invitation using a non-guessable invitation link or explicit invite list. Link expiry/revocation should be supported if private links are implemented.
- **FR-VIS-07 (P0):** Public event responses shall omit internal moderation notes, private host data, and attendee personal details.

### 3.5 Event discovery dashboard and map

- **FR-DISC-01 (P0):** The main dashboard shall provide a map and a corresponding event list in a coordinated layout on desktop.
- **FR-DISC-02 (P0):** The event list shall show a useful summary including title, category, location/area, time, and current status.
- **FR-DISC-03 (P0):** Public upcoming and active events shall be discoverable by location and date/time.
- **FR-DISC-04 (P0):** Users shall be able to search by event title, category, area, and date range, subject to supported query capabilities.
- **FR-DISC-05 (P0):** Selecting an event card shall highlight its map marker and open or navigate to the event detail view.
- **FR-DISC-06 (P0):** Selecting a map marker shall identify the corresponding event in the list or open a concise preview.
- **FR-DISC-07 (P0):** A **Navigate** action shall centre/focus the map on the selected event and, where configured, offer an external directions link.
- **FR-DISC-08 (P0):** The dashboard shall support manual location/area selection when browser geolocation is denied or unavailable.
- **FR-DISC-09 (P1):** The system should support distance-based sorting or radius filters once geocoding and coordinates are available.
- **FR-DISC-10 (P0):** The map shall include loading, failure, no-results, and permission-denied states.
- **FR-DISC-11 (P0):** The dashboard shall not expose precise private-event coordinates to unauthorized users.
- **FR-DISC-12 (P1):** Map bounds or selected filters should be reflected in the visible event list to keep the two views consistent.
- **FR-DISC-13 (P0):** The UI shall show a useful fallback list if the map provider fails to load.

### 3.6 Event status and time

- **FR-STAT-01 (P0):** The system shall derive event status from event timestamps and host cancellation state.
- **FR-STAT-02 (P0):** Supported display states shall include at least: Draft (owner only), Scheduled/Upcoming, Starting soon, Live/In progress, Ended, and Cancelled.
- **FR-STAT-03 (P0):** The UI may show relative time such as “In 3 hours,” “Starts in 20 minutes,” or “Started 15 minutes ago,” alongside a clear date/time.
- **FR-STAT-04 (P0):** Relative-time labels shall not replace the full date, time, or time zone where ambiguity is possible.
- **FR-STAT-05 (P0):** Events without confirmed times shall be labelled clearly and excluded from time-dependent status calculations until valid times are provided.
- **FR-STAT-06 (P0):** Ended events shall not be presented as upcoming.
- **FR-STAT-07 (P1):** The UI should refresh status labels periodically while a dashboard or detail page remains open.

### 3.7 Registration and attendance

- **FR-REG-01 (P0):** Hosts shall be able to specify whether registration is required, optional, external, or not supported.
- **FR-REG-02 (P0):** If in-app registration is enabled, an authenticated user shall be able to register or withdraw subject to event rules.
- **FR-REG-03 (P0):** The system shall prevent duplicate active registrations by the same user for the same event.
- **FR-REG-04 (P1):** Hosts should be able to view registration counts and attendee lists only for their own events.
- **FR-REG-05 (P1):** If capacity is configured, the system should prevent registrations beyond capacity or use a defined waitlist policy.
- **FR-REG-06 (P0):** The UI shall state whether registration is handled on AttendMyEvent or on an external website/contact method.
- **FR-REG-07 (P0):** The system shall not claim a user is registered unless the registration action succeeded.
- **FR-REG-08 (P1):** The system should provide a registration confirmation in the UI and optionally create an in-app notification.

### 3.8 Fees, QR codes, and payment information

- **FR-PAY-01 (P0):** Hosts may provide fee information, currency, a payment QR image, a payment link, and/or payment instructions.
- **FR-PAY-02 (P0):** The UI shall identify these as host-provided payment details.
- **FR-PAY-03 (P0):** AttendMyEvent shall not represent a QR scan, external payment, or payment claim as platform-verified unless a verified payment integration is implemented.
- **FR-PAY-04 (P0):** Hosts shall be responsible for their payment arrangements, fee accuracy, refunds, and payment disputes under the applicable event terms.
- **FR-PAY-05 (P0):** Payment QR images and links shall be validated and displayed safely; the application shall not execute arbitrary embedded content.
- **FR-PAY-06 (P1):** A future payment integration requires its own security, compliance, reconciliation, refund, and dispute requirements before implementation.

### 3.9 Notifications

- **FR-NOT-01 (P0):** The application shall provide a notification bell with an unread count when unread notifications exist.
- **FR-NOT-02 (P0):** The notification centre shall list notifications with message, time, read/unread state, and relevant destination where applicable.
- **FR-NOT-03 (P0):** Users shall be able to mark a notification as read.
- **FR-NOT-04 (P1):** Users should be able to mark all notifications as read.
- **FR-NOT-05 (P1):** Notifications may be generated for registration confirmation, event cancellation, material event changes, invitation receipt, and relevant host updates.
- **FR-NOT-06 (P0):** Users shall not receive notifications that disclose private event details to unauthorized recipients.
- **FR-NOT-07 (P0):** The UI shall distinguish in-app notifications from browser or push notifications; push delivery is not assumed by this specification.
- **FR-NOT-08 (P1):** Users should be able to configure optional notification categories if notification preferences are implemented.

### 3.10 Reporting and moderation

- **FR-MOD-01 (P1):** Users should be able to report an event for spam, misleading details, unsafe content, or other policy violations.
- **FR-MOD-02 (P1):** Authorized moderators should be able to hide or remove reported content and record an internal reason.
- **FR-MOD-03 (P0):** Administrative permissions shall be granted only through trusted server-side configuration or custom claims.
- **FR-MOD-04 (P0):** The application shall not imply that all event hosts, event locations, or payment instructions are verified unless a verification process exists.
- **FR-MOD-05 (P1):** A basic acceptable-use policy and event reporting process should be published before broad public launch.

### 3.11 Error handling and system feedback

- **FR-ERR-01 (P0):** Every data-dependent page shall have loading, empty, success, and error states as applicable.
- **FR-ERR-02 (P0):** Validation errors shall be associated with the relevant form fields and written in user-understandable language.
- **FR-ERR-03 (P0):** The application shall show a retry action for recoverable network/service errors.
- **FR-ERR-04 (P0):** Backend errors shall not expose stack traces, credentials, internal paths, or sensitive database details to end users.
- **FR-ERR-05 (P1):** The application should use a consistent toast/banner pattern for transient status feedback.

---

## 4. External Interface Requirements

### 4.1 User interface

The UI shall follow the companion `UI.md` specification. The primary experience is a map-plus-list dashboard, supported by event details, event creation/editing, profile, notifications, and authentication screens.

### 4.2 Software interfaces

| Interface | Purpose | Requirements |
|---|---|---|
| Firebase Authentication | User identity and sessions | Use supported Firebase client SDK flows; never expose Admin credentials. |
| Cloud Firestore | Persistent app records | Enforce access rules and ownership constraints. |
| Firebase Admin SDK | Trusted backend identity verification and privileged access | Run only on the server with securely supplied credentials. |
| FastAPI | Application API | Validate request bodies, authenticate protected routes, return consistent errors. |
| Map provider | Map tiles, markers, map focus, possibly directions | Configure provider key, attribution, allowed origins, and usage limits. |
| Geocoding provider | Convert venue/address into coordinates | Validate results and handle ambiguous or failed geocoding. |
| File/image storage | Event covers, profile pictures, QR images | Define a storage provider and secure access policy; do not assume Firestore is a binary-file store. |

### 4.3 API conventions

Recommended API conventions:
- Prefix application routes with `/api/v1`.
- Use JSON request and response bodies except for explicitly documented uploads.
- Use HTTP status codes consistently: `200/201` for success, `204` for successful no-content operations, `400` for invalid request, `401` for unauthenticated, `403` for unauthorized, `404` for not found, `409` for conflicts, `422` for validation errors, and `500` for unexpected server failures.
- Return a stable error structure, for example:
  ```json
  {
    "detail": {
      "code": "EVENT_VALIDATION_FAILED",
      "message": "Please correct the highlighted fields."
    }
  }
  ```
- Apply pagination to event lists, registrations, and notifications.
- Validate and normalize input on the server even if frontend validation exists.
- Verify Firebase ID tokens for protected routes and derive the current UID from the verified token rather than trusting a UID sent in the request body.
- Use idempotency or transaction-safe logic for actions that could be submitted twice, especially registration creation.

Suggested endpoint groups (adapt to the existing implementation):

| Method | Route | Purpose | Access |
|---|---|---|---|
| GET | `/api/v1/health` | Health check | Public, minimal information |
| GET | `/api/v1/events` | Search/list public events | Public; public fields only |
| GET | `/api/v1/events/{event_id}` | Get permitted event details | Public for public events; access-checked for private events |
| POST | `/api/v1/events` | Create draft/event | Authenticated |
| PATCH | `/api/v1/events/{event_id}` | Update owned event | Owner or moderator |
| POST | `/api/v1/events/{event_id}/publish` | Validate and publish | Owner |
| POST | `/api/v1/events/{event_id}/cancel` | Cancel event | Owner or moderator |
| POST | `/api/v1/events/{event_id}/registrations` | Register for event | Authenticated; event rules apply |
| DELETE | `/api/v1/events/{event_id}/registrations/me` | Withdraw own registration | Authenticated |
| GET | `/api/v1/me` | Get current profile | Authenticated |
| PATCH | `/api/v1/me` | Update permitted profile fields | Authenticated |
| GET | `/api/v1/me/notifications` | List own notifications | Authenticated |
| PATCH | `/api/v1/me/notifications/{notification_id}` | Mark own notification read | Authenticated |

These routes are a proposed contract, not a claim that they already exist.

---

## 5. Data Requirements and Conceptual Model

### 5.1 Data entities

#### User profile
- `uid` — Firebase UID; authoritative identity key.
- `displayName` — public display name.
- `photoURL` — optional profile image URL.
- `bio` — optional short biography.
- `createdAt`, `updatedAt`.
- `preferences` — optional notification and discovery preferences.
- `role` — derived from trusted authorization configuration; never accepted from ordinary user input.

#### Event
- `id` — unique event identifier.
- `hostUid` — UID of owner.
- `title` — required, bounded length.
- `description` — optional or required according to publication policy; supports plain text or safely rendered rich text.
- `category` — selected category plus optional host-defined label.
- `visibility` — `public` or `private`.
- `status` — lifecycle value such as `draft`, `published`, `cancelled`, `archived`; temporal status may be derived.
- `startAt`, `endAt` — timestamps.
- `timeZone` — IANA time-zone identifier where known.
- `venueName`, `addressText` — human-readable location.
- `location` — latitude/longitude or geospatial representation, subject to provider/data model.
- `coverImageURL` — optional.
- `registrationMode` — e.g. `none`, `in_app`, `external`, `contact_host`.
- `registrationURL` — optional, validated URL.
- `capacity`, `registrationDeadline` — optional.
- `feeAmount`, `currency` — optional.
- `paymentQRURL`, `paymentURL`, `paymentInstructions` — optional host-provided payment details.
- `hostNotes`, `attendeeInstructions` — optional.
- `createdAt`, `updatedAt`, `publishedAt`, `cancelledAt`.
- `moderationState` — optional trusted field.
- `searchTokens` or equivalent — only if required by the selected search implementation.

#### Registration
- `id`.
- `eventId`.
- `attendeeUid`.
- `status` — e.g. `registered`, `withdrawn`, `waitlisted`, if implemented.
- `createdAt`, `updatedAt`.
- A uniqueness/transaction strategy to prevent duplicate active registrations.

#### Notification
- `id`.
- `recipientUid`.
- `type`.
- `title`, `body`.
- `targetType`, `targetId` or safe destination route.
- `createdAt`, `readAt` or `isRead`.
- Do not place sensitive private-event details in notifications delivered to unauthorized recipients.

#### Report (optional P1)
- `id`, `reporterUid`, `eventId`, `reason`, `description`, `status`, `createdAt`, `reviewedAt`, `reviewedBy`.

### 5.2 Firestore collection proposal

A reasonable starting point is:

```text
users/{uid}
events/{eventId}
events/{eventId}/registrations/{registrationId}   # or a top-level registrations collection
users/{uid}/notifications/{notificationId}
eventReports/{reportId}
```

Choose either a subcollection or top-level registration model based on query and access needs; document and enforce the selected approach consistently. Do not store large image binaries in Firestore documents. Store files in a suitable object/file storage service and keep validated URLs/metadata in Firestore.

### 5.3 Data integrity

- Every event must have a valid owner UID.
- Only the owner or authorized moderator may update host-managed fields.
- Published events must have required title, location, visibility, and valid time information.
- A public query must filter out drafts, private events, cancelled events when appropriate, and moderated/hidden events.
- Registration creation must be transaction-safe and duplicate-resistant.
- Server-generated timestamps should be used for audit fields where feasible.
- Store timestamps in a consistent format; preserve the intended event time zone.
- Define retention and deletion rules for account deletion, events, registrations, notifications, and reports.
- Do not expose full attendee lists to the public by default.

---

## 6. Non-Functional Requirements

### 6.1 Security and privacy
- **NFR-SEC-01:** All production traffic shall use HTTPS.
- **NFR-SEC-02:** Protected API routes shall validate Firebase ID tokens.
- **NFR-SEC-03:** Authorization shall be checked on every protected operation.
- **NFR-SEC-04:** Secrets shall be stored in environment variables or a secret manager and excluded from version control.
- **NFR-SEC-05:** Firestore Security Rules shall deny access by default where appropriate and explicitly permit allowed operations.
- **NFR-SEC-06:** The application shall validate file type, size, URL scheme, and user-supplied content.
- **NFR-SEC-07:** The application shall mitigate XSS by escaping user content and avoiding unsafe HTML rendering.
- **NFR-SEC-08:** Sensitive operations shall be rate-limited or otherwise protected against abuse.
- **NFR-SEC-09:** Logs shall not contain access tokens, passwords, payment credentials, or unnecessary personal data.
- **NFR-SEC-10:** The application shall collect only location/profile information needed for the chosen feature and explain location permission use.

### 6.2 Performance
- **NFR-PERF-01:** Typical page interactions should feel responsive on a standard modern connection.
- **NFR-PERF-02:** Event discovery shall use pagination, bounded queries, and indexes rather than loading the entire event database.
- **NFR-PERF-03:** The map shall avoid rendering excessive markers at once; clustering or viewport-based loading may be used.
- **NFR-PERF-04:** Images shall be size-limited and optimized for web delivery.
- **NFR-PERF-05:** The API shall use timeouts and clear failure handling for external services.

### 6.3 Availability and reliability
- **NFR-REL-01:** The UI shall degrade gracefully if map, geocoding, or notification services are unavailable.
- **NFR-REL-02:** The API shall provide a health endpoint that does not disclose secrets or sensitive infrastructure information.
- **NFR-REL-03:** Writes that can be duplicated by retries shall be idempotent or safely deduplicated.
- **NFR-REL-04:** Errors shall be logged server-side with a correlation/request identifier where practical.

### 6.4 Usability and accessibility
- **NFR-UX-01:** Core tasks—discover an event, view details, create a draft, publish an event, and open notifications—shall have clear navigation.
- **NFR-UX-02:** The interface shall be responsive for desktop, tablet, and mobile.
- **NFR-UX-03:** Interactive controls shall have visible focus states and accessible names.
- **NFR-UX-04:** Status shall not be communicated by colour alone; include text and/or icons.
- **NFR-UX-05:** Forms shall identify required fields and explain validation failures.
- **NFR-UX-06:** Map-based actions shall have a list-based alternative.
- **NFR-UX-07:** The interface should target WCAG 2.2 AA practices where practical.

### 6.5 Maintainability and testability
- **NFR-MNT-01:** Frontend components, API routers, service logic, schemas, and database access should be separated by responsibility.
- **NFR-MNT-02:** Environment-specific configuration shall be external to source code.
- **NFR-MNT-03:** API request/response schemas shall be typed and documented.
- **NFR-MNT-04:** Core business rules shall have automated tests.
- **NFR-MNT-05:** Dependency versions and setup instructions shall be documented.

### 6.6 Compatibility
- Support current stable versions of major browsers (Chrome, Edge, Firefox, Safari) subject to test coverage.
- The UI shall adapt to common viewport widths without horizontal overflow.
- Map and geolocation functionality shall degrade gracefully on unsupported or permission-restricted browsers.

---

## 7. Business Rules

1. Only authenticated users may create or manage events.
2. A user may edit only events they own, unless a trusted moderator role grants access.
3. A draft is private to its owner until published.
4. Private events must not be discoverable through public event search or map markers.
5. Publication requires a title, valid location, valid schedule, and visibility selection; other mandatory fields may be added deliberately, but must be documented and shown in the form.
6. The event lifecycle state (draft/published/cancelled/archived) is distinct from the time-derived state (upcoming/live/ended).
7. An event is “live” when the current time falls within its configured start/end interval and it is not cancelled.
8. If only a start time is provided, a defined duration or explicit “end time unknown” policy is required before status can be calculated reliably.
9. Event hosts supply their own payment QR and payment instructions. AttendMyEvent does not guarantee payment completion.
10. Registration mode must be explicit: no registration, in-app registration, external registration, or contact host.
11. Public profile details and attendee information are limited to fields intended for public display.
12. User-generated content must follow platform acceptable-use rules.
13. A private event invitation must use a controlled access mechanism if private details are shown.
14. Cancelling an event should update its status and trigger relevant attendee notifications where the feature is implemented.

---

## 8. Key User Workflows

### 8.1 Discover and navigate to an event
1. User opens the dashboard.
2. The app loads public events matching the current/default location and filters.
3. User searches, filters, selects a map marker, or selects an event card.
4. The selected event is highlighted and its details are displayed.
5. User selects **Navigate**.
6. The map focuses the venue and optionally offers directions through the configured map provider.
7. User can review status, date/time, host instructions, and registration details.

### 8.2 Create and publish an event
1. User signs in and selects **Create event**.
2. User enters the title and core details.
3. User sets location using address search/map selection and confirms the result.
4. User sets start/end time and visibility.
5. User adds optional description, category, cover, registration method, fee/QR, and instructions.
6. User saves as draft at any point.
7. User previews the event and resolves validation errors.
8. User publishes; the backend validates ownership and required fields.
9. The published event appears in eligible discovery results.

### 8.3 Register for an event
1. User opens a permitted event detail page.
2. The page clearly states whether registration is in-app, external, contact-based, or not required.
3. If in-app registration is enabled, user signs in and confirms.
4. The system creates a single active registration.
5. The UI confirms success and may create an in-app notification.
6. The host can review registrations if that feature is enabled.

### 8.4 Review notifications
1. User selects the notification bell.
2. The notification panel/page shows unread and read items.
3. User selects an item to open the relevant event or action.
4. The notification is marked read according to the interaction policy.

---

## 9. Acceptance Criteria

The initial release is acceptable when the following can be demonstrated:

1. A user can create an account/sign in through Firebase Authentication and sign out.
2. An unauthenticated user cannot perform protected event-management actions.
3. An authenticated user can save an incomplete event draft.
4. The event form clearly identifies required and optional fields.
5. An event cannot be published without required title, valid venue/location, valid time, and visibility.
6. A host can publish, edit, and cancel their own event but cannot modify another user's event.
7. Public events appear in the dashboard list and map when they match the active filters.
8. Draft and private events do not appear in public discovery results.
9. Selecting a map marker or event card keeps the map and list selection in sync.
10. The Navigate action focuses the map and/or opens supported directions.
11. Status labels correctly distinguish upcoming, starting soon, live, ended, and cancelled events for representative time cases.
12. A user can view host-provided fee and payment QR instructions with a clear disclaimer that payment is handled by the host.
13. If in-app registration is enabled, duplicate registrations are prevented.
14. The notification centre shows the current user's notifications and supports marking them read.
15. The dashboard and forms remain usable on a narrow mobile viewport.
16. Errors, empty results, denied geolocation, and map-service failure produce understandable fallback UI.
17. Firebase Admin credentials and other secrets are not present in the client bundle or repository.
18. Protected API endpoints verify identity and ownership, and automated tests cover key authorization rules.

---

## 10. Test Strategy

### 10.1 Unit tests
- Event status calculation at boundary times.
- Event form validation and time-range rules.
- Visibility and registration-mode validation.
- API schema validation.
- Permission/ownership helpers.
- Notification read-state transitions.

### 10.2 Integration tests
- Firebase token verification for protected API routes.
- Firestore read/write operations using a test project or emulator where appropriate.
- Event publication and cancellation.
- Registration duplicate prevention and capacity checks.
- Private event access checks.
- Notification creation and retrieval.

### 10.3 UI tests
- Authentication screens and session transitions.
- Create draft → edit → preview → publish flow.
- Dashboard list/map selection behaviour.
- Responsive event detail page.
- Notification bell and notification centre.
- Loading, error, empty, and permission-denied states.

### 10.4 Security tests
- Attempt to edit another user's event.
- Attempt to read private/draft events through public routes.
- Attempt to assign a privileged role through profile updates.
- Invalid/oversized image uploads and unsafe URLs.
- Missing, expired, or invalid Firebase token.
- Duplicate registration and concurrent capacity-limit attempts.

### 10.5 Manual acceptance scenarios
Use at least:
- A public event scheduled several hours in the future.
- A currently running event.
- An ended event.
- A cancelled event.
- A private event.
- An event with no fee.
- An event with host-provided payment QR.
- An event using external registration.
- A user with geolocation denied.
- An event whose address cannot be geocoded.

---

## 11. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Private event data leaks into public discovery | Privacy and trust failure | Enforce access on API/database layer; test public queries. |
| Inconsistent direct Firestore and FastAPI writes | Data integrity and security gaps | Define one write path per entity and document it. |
| Incorrect time-zone handling | Incorrect event status and missed events | Store timestamps consistently and preserve event time zone. |
| Poor geocoding quality | Users navigate to wrong location | Let host confirm map pin and address before publishing. |
| Misleading payment information | Financial disputes or fraud | Label host-provided payment details; report flow and clear responsibility boundaries. |
| Spam or unsafe event listings | User harm and reputational damage | Rate limits, reporting, moderation, and published community rules. |
| Map provider limits or outages | Broken discovery experience | Provide event-list fallback and monitor provider usage. |
| Excessive database reads/cost | Increased operating cost | Paginate, index, cache where appropriate, and avoid full-collection reads. |
| File storage not configured | Missing images/QR codes | Select and document an upload/storage service before enabling uploads. |

---

## 12. Open Decisions

Resolve these before or during implementation and record the chosen option in the repository:

1. Which map provider will be used (e.g. Google Maps, Mapbox, or OpenStreetMap-based stack)?
2. Which geocoding and directions service will be used, and what are its cost/usage constraints?
3. Will event image and QR files use Firebase Storage or another object-storage provider?
4. Will registration be in-app in the first release, or will the product initially support external/contact registration only?
5. Which fields are mandatory for publication beyond title, venue/location, start time, and visibility?
6. What is the private-event access model: invitation list, tokenized link, or both?
7. Will notifications initially be in-app only, or will browser push/email be included?
8. Will public visitors see event details without signing in?
9. Will users be allowed to add custom categories, or choose from a curated list plus “Other”?
10. What retention and deletion policy applies to events and registrations when a user deletes their account?
11. Is moderation included in the first release or only a report-and-review placeholder?
12. What exact meaning should “In 3 hours” use for events near a time boundary, and how often should statuses refresh?

---

## 13. Suggested Delivery Phases

### Phase 1 — Foundation
- Confirm environment configuration and repository layout.
- Set up Firebase Authentication and token verification in FastAPI.
- Define Firestore collections, rules, and typed API schemas.
- Implement a consistent error response and health endpoint.

### Phase 2 — Core events
- Implement event draft creation, validation, publishing, editing, cancellation, and ownership checks.
- Add event details and host profile summaries.
- Implement safe file upload/storage for covers and payment QR images if required.

### Phase 3 — Discovery
- Integrate map and geocoding provider.
- Implement event list, search/filtering, marker selection, event focus, and directions.
- Add derived status labels and responsive fallbacks.

### Phase 4 — Registration and notifications
- Implement the chosen registration modes.
- Add notification records, unread count, read-state operations, and relevant triggers.

### Phase 5 — Quality and launch readiness
- Complete authorization, privacy, accessibility, responsive, and error-state testing.
- Add reporting/moderation minimums and acceptable-use/payment disclaimers.
- Configure production hosting, environment variables, monitoring, backups/retention, and deployment checks.

---

## 14. Traceability

The main requirements are grouped by feature:
- Authentication and profile: FR-AUTH, FR-PROF.
- Event lifecycle and privacy: FR-EVT, FR-VIS.
- Discovery and maps: FR-DISC.
- Timing: FR-STAT.
- Registration and payment information: FR-REG, FR-PAY.
- Notifications and moderation: FR-NOT, FR-MOD.
- System feedback: FR-ERR.
- Cross-cutting quality: NFR-SEC, NFR-PERF, NFR-REL, NFR-UX, NFR-MNT.

The companion `README.md` covers setup and operations. The companion `UI.md` covers visual design, components, page layouts, and wireframes.
