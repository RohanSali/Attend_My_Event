# AttendMyEvent — UI/UX Specification

**Document version:** 1.0  
**Product character:** Professional, modern, welcoming, location-first, community-oriented  
**Primary experience:** Map + event list dashboard  
**Reference companion:** `SRS.md`

---

## 1. UI goals

AttendMyEvent should feel like a reliable local discovery product rather than a cluttered social feed. The user should understand quickly:
- What is happening nearby?
- When does it start, and is it live or ended?
- Where is it?
- What do I need to do to attend?
- How do I publish my own event?

### UX principles
1. **Map-first, not map-only:** always keep a usable list alternative.
2. **Make the next action obvious:** View details, Navigate, Register, or Create event.
3. **Keep event creation flexible:** a clear core form plus expandable optional sections.
4. **Show time and status clearly:** use both a status label and a readable date/time.
5. **Be honest about trust and payments:** host-supplied details are visibly identified.
6. **Privacy is visible:** public/private choice is understandable and reinforced.
7. **Accessible by default:** keyboard support, clear focus, sufficient contrast, and text labels.
8. **Responsive by design:** desktop uses map and list side-by-side; mobile uses a map/list switch or stacked layout.

---

## 2. Visual direction

### 2.1 Brand personality

- **Professional:** clean spacing, disciplined typography, consistent controls.
- **Welcoming:** warm accent colour and friendly empty-state messages.
- **Local and active:** map markers, location chips, category icons, and time-aware status.
- **Trustworthy:** restrained shadows, clear hierarchy, readable event details, visible host/payment disclaimers.

Avoid excessive gradients, glassmorphism everywhere, tiny text, noisy backgrounds, and too many accent colours. Reserve stronger colour for calls to action and event status.

### 2.2 Proposed colour theme

Use CSS custom properties so the palette can be changed without editing each component.

| Token | Hex | Intended use |
|---|---|---|
| `--color-primary-900` | `#17324D` | Deep brand/nav colour |
| `--color-primary-700` | `#24577A` | Primary hover/strong accents |
| `--color-primary-600` | `#2F6F96` | Primary buttons and links |
| `--color-primary-100` | `#E8F2F8` | Light brand surfaces |
| `--color-accent-500` | `#F4A340` | Highlight, selected markers, limited emphasis |
| `--color-accent-100` | `#FFF3DF` | Warm highlight surface |
| `--color-bg` | `#F6F8FB` | App background |
| `--color-surface` | `#FFFFFF` | Cards, menus, panels |
| `--color-surface-muted` | `#EEF2F6` | Input backgrounds and secondary sections |
| `--color-text` | `#17212B` | Main text |
| `--color-text-muted` | `#657384` | Secondary text |
| `--color-border` | `#DCE3EA` | Dividers and control borders |
| `--color-success` | `#16835D` | Success state |
| `--color-warning` | `#B66A0B` | Warning/starting soon |
| `--color-danger` | `#C43D4B` | Error/cancelled/destructive actions |
| `--color-info` | `#286DB3` | Informational state |

These values are a proposed starting palette. Verify contrast in actual components before release. Do not use colour alone to convey meaning; pair colour with text, iconography, or shape.

### 2.3 Status colours and labels

| State | Suggested style | Example label |
|---|---|---|
| Upcoming | Blue/neutral | `Upcoming · In 3 hours` |
| Starting soon | Amber | `Starting soon · 20 min` |
| Live | Green | `LIVE · Started 15 min ago` |
| Ended | Grey | `Ended` |
| Cancelled | Red | `Cancelled by host` |
| Draft | Neutral outline | `Draft` |
| Time not confirmed | Neutral/info | `Time to be confirmed` |

Status should be based on event timestamps and cancellation state, not manually chosen by the host unless the model explicitly supports a separate host status field.

### 2.4 Typography

Recommended stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
             BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Type scale:
- Page title: 28–34 px desktop, 24–28 px mobile, semibold.
- Section title: 20–24 px, semibold.
- Card title: 16–18 px, semibold.
- Body: 14–16 px.
- Secondary/meta text: 12–14 px, but keep critical time/location details comfortably readable.
- Button/input text: 14–16 px.

Use sentence case for labels and buttons. Avoid long uppercase labels except short status badges such as `LIVE`.

### 2.5 Spacing, radius, elevation

Suggested base spacing unit: 4 px.

| Token | Value | Usage |
|---|---:|---|
| `--space-1` | 4px | Icon/text micro-gap |
| `--space-2` | 8px | Compact control gaps |
| `--space-3` | 12px | Card internal spacing |
| `--space-4` | 16px | Standard spacing |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Major layout spacing |
| `--radius-sm` | 6px | Small controls |
| `--radius-md` | 10px | Inputs and cards |
| `--radius-lg` | 16px | Large panels/modals |
| `--radius-pill` | 999px | Chips and badges |

Use subtle shadows for floating map controls, popovers, and modals. Most cards should be separated by whitespace and a light border rather than heavy shadows.

### 2.6 Iconography and imagery
- Use one consistent icon library (for example, Lucide React) if approved for the project.
- Pair icons with labels for important actions.
- Event cover images should use a consistent aspect ratio and sensible fallback.
- Use category icons only as a supporting cue, not as a replacement for category text.
- Show a clear placeholder when no cover image exists.
- Payment QR codes should be large enough to scan, with a host-provided label and a safe image preview.

---

## 3. Global application shell

### 3.1 Desktop navigation

Suggested top navigation:
- **Brand:** AttendMyEvent logo/wordmark.
- **Explore:** dashboard/map.
- **My Events:** hosted events and drafts.
- **Create Event:** prominent primary action.
- **Notifications:** bell icon with unread badge.
- **Profile menu:** avatar, display name, profile/settings, sign out.

Use a fixed or sticky top bar only if it does not consume too much vertical space. Keep navigation stable across primary authenticated pages.

### 3.2 Mobile navigation

On narrow screens:
- Use a compact top bar with logo, notification bell, and avatar/menu.
- Provide a bottom navigation bar or accessible menu for Explore, My Events, Create, and Profile if it improves reachability.
- Avoid showing both a full desktop nav and bottom nav at the same time.
- Keep the Create action easy to reach without covering content.

### 3.3 Layout grid

- Desktop page content max width: approximately 1440 px, with fluid gutters.
- Standard page gutter: 24–32 px desktop, 16 px tablet, 12–16 px mobile.
- Use a consistent 8/12-column grid where helpful.
- Dashboard is an intentional exception: it should use most of the viewport height.

---

## 4. Page inventory

| ID | Page/view | Access | Main purpose | Priority |
|---|---|---|---|---|
| UI-01 | Explore Dashboard | Public or signed-in | Map and nearby event list | P0 |
| UI-02 | Event Details | Public for public events | Full event information and attendance actions | P0 |
| UI-03 | Create/Edit Event | Signed-in; owner for edit | Draft, validate, publish and manage event | P0 |
| UI-04 | My Events | Signed-in | Manage drafts, published, cancelled, past events | P0 |
| UI-05 | Notifications | Signed-in | View and manage in-app notifications | P0 |
| UI-06 | Profile | Signed-in | View/edit profile and account basics | P0 |
| UI-07 | Sign In / Sign Up | Public | Authenticate user | P0 |
| UI-08 | Public/Private access state | Contextual | Explain sign-in, invite/access, or unavailable event | P0 |
| UI-09 | Optional report event dialog | Signed-in | Report abuse or misleading listing | P1 |
| UI-10 | Optional moderator review | Moderator only | Review reports and manage unsafe listings | P1 |

A page can be a route or a modal/drawer depending on the implementation. Keep the route model consistent.

---

## 5. Wireframes and page layouts

Wireframes below are structural, not pixel-perfect. Exact dimensions should be refined in the implemented responsive layout.

### 5.1 UI-01 — Explore Dashboard (primary page)

**Desktop layout**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ AttendMyEvent     Explore   My Events   [+ Create Event]   ♧   (Avatar)  │
├──────────────────────────────────────────────────────────────────────────┤
│ [ Search events, places, categories...                 ] [Date] [Filters]│
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ┌────────────────────────────────────────────┐ ┌───────────────────────┐│
│ │                                            │ │ Nearby events    [↻]  ││
│ │                                            │ │ [Sort: Soonest   v]    ││
│ │                MAP                         │ │                       ││
│ │        • markers / clusters                │ │ ┌───────────────────┐ ││
│ │        • current area                      │ │ │ Cover / category  │ ││
│ │        • zoom / locate controls            │ │ │ Event title       │ ││
│ │                                            │ │ │ In 3 hours · Area │ ││
│ │                                            │ │ │ [View] [Navigate] │ ││
│ │                                            │ │ └───────────────────┘ ││
│ │                                            │ │ ┌───────────────────┐ ││
│ │                                            │ │ │ Event card        │ ││
│ │                                            │ │ └───────────────────┘ ││
│ └────────────────────────────────────────────┘ └───────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**Recommended desktop proportions**
- Header: 64–72 px.
- Search/filter row: 64–80 px.
- Main content: remaining viewport height, with a minimum usable height.
- Map: roughly 58–65% of content width.
- Event list: roughly 35–42%, with independent vertical scrolling.
- Event cards: consistent height where possible, but allow content to wrap naturally.

**Dashboard components**
- `AppHeader`
- `GlobalSearch`
- `DateFilter`
- `CategoryFilter`
- `LocationPicker`
- `MapView`
- `MapControls`
- `EventMarker` / `MarkerCluster`
- `EventListPanel`
- `EventCard`
- `EventStatusBadge`
- `EmptyState`
- `Toast` / `InlineError`

**Map interactions**
- Hover/focus on a card may highlight its marker.
- Selecting a card highlights the marker and keeps the card visibly selected.
- Selecting a marker shows a concise preview or selects the matching card.
- **Navigate** focuses the map on the venue and may open external directions.
- On mobile, use a `Map` / `List` toggle or a map view with a draggable event-list sheet.
- If the map fails, keep the event list usable.

**Dashboard event card content**
1. Optional thumbnail.
2. Category and visibility-appropriate status.
3. Event title.
4. Date/time or relative-time label.
5. Neighbourhood/venue summary.
6. Optional fee indicator (e.g. `Free` or `Paid entry`, only when host has supplied reliable details).
7. Actions: `View details` and `Navigate`.

Do not show private-event markers or details to users without permission.

### 5.2 UI-02 — Event Details

**Desktop layout**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Header                                                                   │
├──────────────────────────────────────────────────────────────────────────┤
│ ← Back to Explore                                                        │
│ ┌──────────────────────────────────────┐ ┌─────────────────────────────┐│
│ │                                      │ │ [Upcoming · In 3 hours]     ││
│ │          COVER IMAGE                 │ │ Event title                 ││
│ │                                      │ │ Date and time               ││
│ └──────────────────────────────────────┘ │ Venue / address             ││
│                                          │ [Navigate] [Register]       ││
│ About this event                         │ Host card                   ││
│ Description / notes                      │ Registration / fee summary  ││
│ What to know before you go               │ Payment QR (if supplied)    ││
│ Host instructions                        │ Payment disclaimer          ││
│                                          │                             ││
│ Location                                 │                             ││
│ [Small map preview]                      │                             ││
└──────────────────────────────────────────────────────────────────────────┘
```

**Layout**
- Main content column: 60–68%.
- Summary/action column: 32–40%, sticky on desktop only if it does not obstruct content.
- On mobile, stack all content and keep the main action visible without obscuring the page.

**Content hierarchy**
1. Status badge.
2. Event title.
3. Full date/time and time zone where relevant.
4. Venue and address.
5. Primary action: `Register`, `Open registration link`, `Contact host`, or `Navigate` depending on configuration.
6. Description and attendee notes.
7. Host summary.
8. Registration and capacity details.
9. Fee/payment details if supplied.
10. Location preview.
11. Report event action where implemented.

**Payment copy**
Use concise language such as: “Payment details are provided by the event host. AttendMyEvent does not process or verify this payment.” Show this close to the QR/link, not hidden in a footer.

### 5.3 UI-03 — Create/Edit Event

The creation flow should feel flexible, not like a long administrative form. Use a single page with sections or a short stepper. Prefer sections with progressive disclosure over a mandatory multi-step wizard if the host needs to review everything at once.

**Suggested form structure**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Header                                    Save draft · Preview · Publish │
├──────────────────────────────────────────────────────────────────────────┤
│ Create your event                                                        │
│ Add the essentials first. You can include more details whenever needed. │
│                                                                          │
│ 1. Event basics                                                          │
│ [Event title____________________________________________]                │
│ [Category v]   [Optional cover image / upload]                           │
│ [Description__________________________________________________________] │
│                                                                          │
│ 2. When and where                                                        │
│ [Start date] [Start time]  [End date] [End time]                         │
│ [Venue / place search____________________________________] [Choose map] │
│ [Address / area_________________________________________]                │
│ [Map pin preview]                                                        │
│                                                                          │
│ 3. Visibility                                                            │
│ (•) Public — discoverable by everyone                                    │
│ ( ) Private — shared only through your chosen invite/access method       │
│                                                                          │
│ 4. Registration and entry (optional)                                     │
│ [Registration mode v] [Capacity] [Deadline]                              │
│ [Registration URL]                                                       │
│ [Fee amount] [Currency] [Payment QR upload]                              │
│ [Payment instructions_______________________________________________]  │
│                                                                          │
│ 5. Additional information (optional, expandable)                         │
│ [Host notes] [Attendee instructions] [Contact method]                    │
│                                                                          │
│ [Save draft] [Preview event]                            [Publish event]  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Required fields**
- Title.
- Location/venue that can be represented on a map or has an explicit supported location policy.
- Start date/time.
- End date/time or an approved duration/end-time policy.
- Visibility.
- Any additional publication requirements established by the product.

**Optional fields**
- Cover image.
- Long description.
- Category/custom category.
- Venue details and attendee notes.
- Registration mode and external registration link.
- Capacity/deadline.
- Fee, currency, payment QR, payment link, and instructions.
- Host contact instructions.

**Interaction rules**
- Clearly mark required fields.
- Validate location and show the selected map pin before publishing.
- If the user chooses private, explain that the event will not appear in public discovery.
- Save draft must be available without satisfying every publication field.
- Warn before leaving with unsaved changes.
- Use inline errors and preserve entered data after a recoverable error.
- Preview must show the event as attendees will see it.
- Confirm cancellation if editing an already published event.
- Upload controls show file size/type limits and preview the chosen image.
- Never describe a payment as verified by AttendMyEvent unless a verified payment service exists.

### 5.4 UI-04 — My Events

**Purpose:** give hosts one place to manage events without confusing event lifecycle with time status.

Suggested top tabs:
- `Drafts`
- `Published`
- `Cancelled`
- `Past`

Each card/row should show:
- Event title.
- Date/time.
- Venue/area.
- Lifecycle state and time-derived state as distinct labels.
- Registration count if the host is authorised and that feature exists.
- Actions: `Edit`, `Preview`, `Share`, `Cancel`, or `Archive` according to state.

Include:
- Empty state with `Create your first event`.
- Confirmation dialog for destructive/cancellation actions.
- Pagination or incremental loading for large lists.
- Clear indication when a draft is not public.

### 5.5 UI-05 — Notifications

**Notification bell popover**
- Compact list of the most recent notifications.
- Unread dot/weight and an unread count.
- `View all notifications` link.
- Empty state when no notifications exist.

**Full notifications page**
- Page title and optional `Mark all as read`.
- Each row: type icon, title, short message, timestamp, unread/read state, and safe destination.
- Selecting a notification opens the relevant event or page and marks it read according to the interaction policy.
- Do not include private-event details in notifications sent to users without access.

Example notification types:
- Registration confirmed.
- Event time/location updated.
- Event cancelled.
- Invitation received.
- Host announcement.

### 5.6 UI-06 — Profile

Suggested layout:
- Avatar and display name.
- Optional short bio.
- Edit profile action.
- Sections/tabs: `My Events`, `My Registrations` (if supported), `Account`.
- Account section: email/provider information, sign-out, and account-deletion request if implemented.
- Keep private account information separate from the public host card shown on event pages.

Profile form should be short. Do not ask for phone number, exact home address, or other personal information unless a defined feature genuinely requires it.

### 5.7 UI-07 — Sign In / Sign Up

Use a calm, uncluttered form with:
- AttendMyEvent logo and one-line value proposition.
- Email/password or the Firebase-enabled sign-in methods.
- Clear toggle/link between sign-in and sign-up.
- Password visibility control where applicable.
- Password reset flow where supported.
- Inline validation and friendly authentication errors.
- Terms/privacy links when available.
- A route back to public event discovery.

Do not force sign-in merely to view public events unless the product decision explicitly requires it. Require authentication for protected actions such as creating an event or in-app registration.

### 5.8 UI-08 — Private/unavailable event state

If a user opens an event they cannot access, show a neutral message such as:
- “This event is private or unavailable.”
- “If you were invited, open the original invitation link or sign in with the invited account.”

Do not reveal whether a guessed private event ID exists if that would expose sensitive information.

### 5.9 UI-09 — Report event dialog (P1)

Fields:
- Reason: spam, misleading details, unsafe content, inappropriate content, other.
- Optional description.
- Submit and cancel buttons.
- Confirmation after submission.
- Prevent duplicate rapid submissions where possible.

### 5.10 UI-10 — Moderator review (P1)

If moderation is included:
- Restrict route access to trusted moderator roles.
- Show reported event, reason, report time, and current state.
- Provide actions to dismiss, hide, or escalate.
- Keep internal moderation notes private.
- Record moderator action and timestamp.

---

## 6. Reusable component inventory

| Component | Responsibility | Important states/props |
|---|---|---|
| `AppHeader` | Global navigation and account controls | authenticated, active route |
| `Button` | Consistent actions | primary, secondary, danger, loading, disabled |
| `IconButton` | Compact icon action | accessible label, tooltip |
| `TextInput` | Single-line input | label, hint, error, required |
| `TextArea` | Long-form notes | max length, counter, error |
| `Select` | Category/mode selection | placeholder, options, error |
| `DateTimeField` | Event schedule entry | time zone, validation, min/max |
| `SearchBox` | Event/place search | query, suggestions, loading |
| `FilterChip` | Applied filter | selected, removable |
| `EventCard` | Event summary | selected, status, loading |
| `EventStatusBadge` | Event state label | status, label, icon |
| `MapView` | Map canvas and viewport | markers, selected ID, bounds |
| `EventMarker` | One event on map | selected, category/status |
| `MarkerCluster` | Group nearby markers | count, zoom action |
| `MapControls` | Zoom, locate, reset | disabled/loading/error |
| `EventListPanel` | Scrollable event results | sort, loading, empty |
| `HostSummary` | Public host identity | display name, avatar |
| `VisibilitySelector` | Public/private setting | selected value, explanatory copy |
| `ImageUploader` | Cover/profile image upload | preview, progress, file error |
| `PaymentQrPanel` | Host-provided QR/instructions | image, link, disclaimer |
| `NotificationBell` | Unread count and popover | count, loading |
| `NotificationItem` | One notification row | unread, timestamp, target |
| `AvatarMenu` | Profile menu | signed-in state |
| `Modal/Dialog` | Confirmations and forms | focus trap, Escape, backdrop policy |
| `Toast` | Transient feedback | success, warning, error, info |
| `EmptyState` | Helpful no-content message | icon, title, description, CTA |
| `Skeleton` | Loading placeholder | shape and count |
| `InlineError` | Recoverable error message | message, retry callback |
| `Pagination` | Page navigation | page, page count, loading |

Component rules:
- Every interactive icon-only control must have an accessible name.
- Buttons must expose disabled/loading state and prevent accidental duplicate submits.
- Inputs must connect labels and error text programmatically.
- Dialogs must manage focus and return focus to the triggering control.
- Reusable components should not contain Firestore/API business logic directly.

---

## 7. Interaction and state specifications

### 7.1 Global states
Every data-backed page should consider:
- Initial loading.
- Loaded with content.
- Loaded with no results.
- Recoverable error with retry.
- Unauthenticated state.
- Permission denied.
- Offline/slow network where practical.

### 7.2 Event status calculation

Recommended display rules (exact thresholds are product decisions):
- `Upcoming`: event starts later than the “starting soon” threshold.
- `Starting soon`: event begins within the configured threshold.
- `Live`: current time is at or after start and before end.
- `Ended`: current time is at or after end.
- `Cancelled`: event lifecycle state is cancelled, regardless of time.
- `Time to be confirmed`: required schedule information is not available.

Keep lifecycle status (`draft`, `published`, `cancelled`, `archived`) distinct from time-derived status. A published event can be upcoming, live, or ended.

### 7.3 Search and filters
- Search should debounce text input to avoid excessive requests.
- Active filters should be visible as removable chips.
- Provide a clear-filters action.
- The event list and map must reflect the same effective filter set.
- Preserve filters when the user returns from an event detail page when practical.
- Provide a helpful no-results state that suggests changing date, area, or category.

### 7.4 Map behaviour
- Selected event has a distinct marker treatment and card outline.
- Marker clustering should be used if marker density affects performance.
- Provide a locate-me action only after requesting browser permission.
- Do not continuously track location without an explicit user-facing reason and consent.
- If geolocation is denied, allow manual place search.
- If the map provider is unavailable, show the list and a visible map error message.
- The Navigate action should distinguish “focus map on event” from “open turn-by-turn directions.”

### 7.5 Forms
- Validate on blur and/or submit without making the user fight aggressive error messages.
- Keep entered values after validation/server failures.
- Clearly distinguish save-draft success from publish success.
- Use a confirmation step for cancellation or irreversible actions.
- Provide progress indicators for uploads and disable repeated submission while a request is pending.
- Do not rely on placeholders as the only field labels.

### 7.6 Notifications
- Unread count should reflect the user's own unread notification records.
- Mark-as-read updates should be idempotent.
- Clicking an event-related notification must re-check access before showing private details.
- If a target no longer exists or access has been revoked, show a safe fallback state.

---

## 8. Responsive behaviour

### Desktop (approximately 1200 px and above)
- Full top navigation.
- Dashboard map and event list side-by-side.
- Event detail can use two columns.
- Create/edit form can use a wide central column and optional sticky preview.

### Tablet (approximately 768–1199 px)
- Compact navigation.
- Dashboard may use a 55/45 map/list split or a map/list toggle depending on available width.
- Event details may stack the action summary beneath the cover.
- Form fields use two columns only where each remains comfortably readable.

### Mobile (below approximately 768 px)
- Compact header and accessible navigation.
- Dashboard uses a map/list toggle or a map with a list sheet.
- Event cards are full width.
- Event detail is single-column.
- Forms use one column and full-width primary actions.
- Modals should fit the viewport and allow internal scrolling.
- Avoid sticky elements that cover form controls or event content.
- Use touch targets around 44 × 44 CSS pixels where practical.

Test at small widths and with browser zoom; do not rely only on device presets.

---

## 9. Accessibility requirements

- Use semantic landmarks: header, nav, main, section, form, and footer where applicable.
- Maintain visible keyboard focus.
- Ensure all functionality can be accessed without a mouse, including map-related event selection through the list.
- Provide labels and helpful error descriptions for inputs.
- Do not communicate status with colour alone.
- Ensure contrast for text, badges, button labels, and map controls.
- Respect reduced-motion preferences.
- Use alt text for meaningful event/profile images; decorative images should have empty alt text.
- Ensure dialogs trap focus appropriately and close predictably.
- Announce important asynchronous success/error feedback to assistive technology.
- Follow WCAG 2.2 AA practices where practical.

---

## 10. Content and microcopy guidelines

Use clear, action-oriented language.

| Situation | Suggested copy |
|---|---|
| No nearby events | “No events found in this area yet. Try another location or date.” |
| Geolocation denied | “Location access is off. Search for a place to explore events nearby.” |
| Draft saved | “Draft saved. Only you can see it.” |
| Publish success | “Your event is published and ready to discover.” |
| Invalid location | “Choose a valid venue or confirm the map pin before publishing.” |
| Private event | “This event is private and won’t appear in public discovery.” |
| Map unavailable | “The map couldn’t load. You can still browse the event list.” |
| Payment instructions | “Payment details are provided by the event host. AttendMyEvent does not process or verify this payment.” |
| Cancel event | “Cancel this event? Attendees may be notified, and the event will no longer appear as active.” |
| Registration unavailable | “The host has not enabled in-app registration. Follow the instructions provided by the host.” |

Avoid ambiguous labels such as “Go” when “Navigate to venue” is clearer. Use exact dates and times in event details even when a relative label is shown.

---

## 11. Motion and feedback

- Use short, subtle transitions for hover, selection, drawers, and toasts.
- Avoid animating map movement in a way that disorients users; provide a reduced-motion alternative.
- Loading skeletons should match the shape of the content they replace.
- Toasts should be brief and non-blocking; persistent failures belong inline.
- Confirm destructive actions with a dialog.
- Respect `prefers-reduced-motion`.

---

## 12. Frontend implementation guidance

Suggested design-token file:

```css
:root {
  --color-primary-900: #17324D;
  --color-primary-700: #24577A;
  --color-primary-600: #2F6F96;
  --color-primary-100: #E8F2F8;
  --color-accent-500: #F4A340;
  --color-accent-100: #FFF3DF;

  --color-bg: #F6F8FB;
  --color-surface: #FFFFFF;
  --color-surface-muted: #EEF2F6;
  --color-text: #17212B;
  --color-text-muted: #657384;
  --color-border: #DCE3EA;

  --color-success: #16835D;
  --color-warning: #B66A0B;
  --color-danger: #C43D4B;
  --color-info: #286DB3;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --shadow-panel: 0 8px 24px rgb(23 50 77 / 10%);
}
```

Example button hierarchy:
- Primary: publish, create event, register.
- Secondary: save draft, view details, filters.
- Tertiary/ghost: back, dismiss, low-emphasis actions.
- Danger: cancel event, delete where supported.

Do not hard-code tokens separately across components. Use a single theme file and component variants.

### Suggested frontend feature boundaries
- `features/dashboard/`: dashboard composition, filters, selected event state.
- `features/events/`: event detail, create/edit, host event management.
- `features/auth/`: sign-in forms and session state.
- `features/profile/`: user profile and account preferences.
- `features/notifications/`: bell, popover, notification centre.
- `components/common/`: shared controls and feedback components.
- `services/`: API client functions; keep fetch details out of presentation components.
- `utils/`: pure date/time formatting, status calculation, validation helpers.

---

## 13. UI acceptance checklist

- [ ] Dashboard displays map and event list together on desktop.
- [ ] Map and list selection stay synchronised.
- [ ] Navigate action focuses the event and/or opens configured directions.
- [ ] Search and filters are visible and removable.
- [ ] No-results and map-failure states are helpful.
- [ ] Public/private visibility is clear when creating an event.
- [ ] Drafts are clearly labelled and not publicly discoverable.
- [ ] Required fields and validation errors are explicit.
- [ ] Event details show full date/time and a status label.
- [ ] Payment QR has host-supplied wording and disclaimer.
- [ ] Notification bell displays unread count correctly.
- [ ] Profile and account information are separated from public host information.
- [ ] All important controls work with keyboard navigation.
- [ ] Status is not communicated by colour alone.
- [ ] Layout works on mobile without horizontal overflow.
- [ ] Loading, empty, error, success, and permission-denied states are designed.
- [ ] Reduced-motion preferences are respected.

---

## 14. Design decisions to confirm

1. Final brand logo and wordmark.
2. Whether the default theme is light-only or includes dark mode.
3. Map provider and marker visual system.
4. Final event category taxonomy and category icons.
5. Whether dashboard filters include radius, date range, price, and event type at launch.
6. Whether event detail opens as a route, side panel, or both.
7. Whether mobile uses a bottom navigation bar.
8. Whether event creation uses one page, grouped sections, or a stepper.
9. Which profile fields are publicly visible.
10. Whether registration is in-app in the first release.
11. Whether notification delivery is in-app only at launch.
12. Final accessibility and browser support target.

---

**Design rule:** keep the dashboard fast to scan, event creation forgiving, event details explicit, and privacy/payment boundaries impossible to misunderstand.
