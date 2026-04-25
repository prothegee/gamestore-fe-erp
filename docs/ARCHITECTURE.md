# Architecture

High-level design, data flow, and patterns used in the GameStore ERP frontend.

## Overview

```
Browser
  └── Vue 3 SPA (Vite)
        ├── Vue Router 4        — navigation + auth/RBAC guards
        ├── Pinia stores        — domain state + localStorage persistence
        ├── Service layer       — typed fetch wrapper per microservice
        └── Component library  — 11 reusable UI primitives
```

The app runs fully in the browser. When a backend is not available, every module seeds its data from `src/mocks/` into `localStorage` under `_dummy-*` keys and operates against that data. Swapping to real APIs requires only updating the `.env` and removing the `_dummy-*` initialization in each store.

---

## Service Layer (`src/services/http.ts`)

All HTTP calls go through `createServiceClient(baseURL)`, which returns a typed client with `get`, `post`, `put`, `patch`, and `delete` methods.

```ts
const client = createServiceClient(import.meta.env.VITE_API_PRODUCT)
const products = await client.get<Product[]>('/products')
```

### Built-in behaviors

| Condition | Behavior |
| :-        | :-       |
| `erp_token` in localStorage | Attaches `Authorization: Bearer <token>` header |
| `POST`/`PUT`/`PATCH` with body | Sets `Content-Type: application/json` automatically |
| `401 Unauthorized` | Calls `auth.logout()` and throws |
| `403 Forbidden` | Shows permission-error toast and throws |
| `5xx` | Shows service-error toast and throws |
| Empty response body | Returns `{}` instead of throwing a JSON parse error |

The service client is a plain function — it has no module-level side effects and is safe to call from any store or composable.

---

## State Management (`src/stores/`)

Eight Pinia stores, each with a single domain responsibility.

| Store | File | localStorage key |
| :-    | :-   | :-               |
| `auth` | `auth.ts` | `erp_token`, `erp_user` |
| `ui` | `ui.ts` | — |
| `toast` | `toast.ts` | — |
| `settings` | `settings.ts` | `_dummy-settings` |
| `notifications` | `notifications.ts` | `_dummy-notification` |
| `products` | `products.ts` | `_dummy-products` |
| `suppliers` | `suppliers.ts` | `_dummy-suppliers` |
| `media` | `media.ts` | `_dummy-media` |

All data stores follow the same lifecycle:
1. On first instantiation: read `localStorage`, if empty seed from `src/mocks/` and write back.
2. On every mutation (`add`, `update`, `remove`): write the entire collection back to `localStorage`.
3. On re-instantiation (simulated page reload): read persisted data, no re-seeding.

Every dummy data block is annotated:
```ts
// NOTE:
// - Fetch this later to: <VITE_API_PRODUCT>
```

---

## Routing (`src/router/index.ts`)

All 14 routes are lazy-loaded via dynamic `import()`.

### Navigation guard (`beforeEach`)

```
Request arrives
  → Not authenticated + not /login → redirect /login
  → Authenticated + /login         → redirect /
  → Route has meta.roles           → check user.role ∈ roles → 403 if not
  → Otherwise                      → proceed
```

### RBAC roles (least → most privileged)

```
viewer → staff → manager → superadmin
```

The `/admin` route requires `['superadmin']`. All other authenticated routes are accessible to `staff` and above unless restricted via `meta.roles`.

---

## Data Flow (typical list view)

```
View mounted
  └── useProductStore()             reads _dummy-products from localStorage
        └── computed filtered()     applies search + filter + sort
              └── DataTable         renders rows with slot-based cell overrides
                    └── User action (edit button)
                          └── store.update(product) → persist to localStorage
                                └── useNotificationStore().add(...)
```

---

## Styling

- **Global variables** (`src/styles/global.css`): color palette, border-radius, shadows, transitions, layout dimensions.
- **Scoped styles**: every `.vue` file carries its own `<style scoped>` block.
- **No external CSS framework** — all styles are hand-written against the CSS variable system.

### Layout dimensions

| Variable | Value |
| :-       | :-    |
| `--sidebar-width` | `240px` |
| `--sidebar-collapsed-width` | `60px` |
| `--header-height` | `56px` |

### Color palette

| Variable | Hex | Role |
| :-       | :-  | :-   |
| `--color-primary` | `#026C96` | Dark teal — sidebar, primary buttons |
| `--color-secondary` | `#288DA9` | Mid teal — links, hover, active |
| `--color-accent` | `#7BC3AF` | Light teal — accent fills |
| `--color-warm` | `#FFE3AD` | Cream — logo, highlights |
| `--color-warning` | `#FDA46F` | Orange — warnings, low-stock |
| `--color-danger` | `#DB8068` | Salmon — errors, destructive |

---

## Session Persistence

On login, `auth.ts` writes to `localStorage`:
- `erp_token` — used by `http.ts` for `Authorization` headers
- `erp_user` — JSON-serialised user object

On every page load, the router guard calls `auth.restore()` to rehydrate the session before evaluating any guard logic.
