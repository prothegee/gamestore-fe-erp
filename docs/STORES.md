# Pinia Stores

All stores are in `src/stores/` and use the Composition API style (`defineStore('id', () => { ... })`).

---

## `auth` — `src/stores/auth.ts`

Manages the user session. Persists to `localStorage` keys `erp_token` and `erp_user`.

**State**
- `user: AuthUser | null` — logged-in user (username, role, email)
- `token: string | null` — JWT / session token

**Actions**
- `login(username, password)` — simulates auth (600 ms delay), sets token + user in localStorage
- `logout()` — clears state and localStorage, redirects to `/login`
- `restore()` — rehydrates state from localStorage on page load (called by router guard)

**Demo credentials:** `demouser` / `demouser` → role `superadmin`

---

## `ui` — `src/stores/ui.ts`

Manages UI-only state. Not persisted.

**State**
- `sidebarCollapsed: boolean`

**Actions**
- `toggleSidebar()` — flips `sidebarCollapsed`

---

## `toast` — `src/stores/toast.ts`

Global in-app toast notification queue. Not persisted.

**State**
- `toasts: Toast[]` — active toast messages

**Actions**
- `add({ type, message })` — pushes a toast; auto-removes after 4 000 ms
- `remove(id)` — removes a toast immediately

**Types:** `type` is `'success' | 'error' | 'warning' | 'info'`

---

## `settings` — `src/stores/settings.ts`

Persists system configuration. localStorage key: `_dummy-settings`.

**State**
- `sys.currency: string` — `'USD'` | `'EUR'`
- `sys.timezone: string` — IANA timezone string
- `sys.dateFormat: string` — `'MM/DD/YYYY'` | `'DD/MM/YYYY'` | `'YYYY-MM-DD'`
- `sys.pageSize: number` — rows per DataTable page (default `20`)
- `api.account / media / product / purchase / session: string` — backend URLs (debug override)

**Actions**
- `save()` — writes `sys` and `api` to `_dummy-settings`

**Helpers**
- `formatPrice(amount: number): string` — applies currency symbol from `sys.currency`
- `formatDate(iso: string): string` — formats using `sys.dateFormat`

---

## `notifications` — `src/stores/notifications.ts`

In-app notification feed. localStorage key: `_dummy-notification`. Seeded with 7 initial entries on first load.

**State**
- `notifications: AppNotification[]`

**Computed**
- `unreadCount: number` — reactive count of `!read` notifications (used for sidebar badge)

**Actions**
- `add(type, title, message)` — prepends a new notification; called by other stores/views after mutations
- `markRead(id)` — marks one notification read
- `markAllRead()` — marks all notifications read

**Helpers**
- `relativeTime(iso: string): string` — converts ISO timestamp to human-readable string (`'2 hr ago'`)

**Event sources** — other modules call `notifStore.add(...)` after:
- Product added / updated / archived
- Supplier added, PO created
- Media uploaded / deleted
- User deactivated (Admin)

---

## `products` — `src/stores/products.ts`

Product catalog backed by localStorage. Key: `_dummy-products`. Seeded from `src/mocks/products.ts`.

**State**
- `products: Product[]`

**Actions**
- `add(draft)` — appends new product with generated `id`, `createdAt`, `updatedAt`
- `update(product)` — replaces entry by id; updates `updatedAt`
- `archive(id)` — sets `status = 'archived'` without deleting
- `getById(id): Product | undefined`

> **NOTE:** Fetch this later to `<VITE_API_PRODUCT>`

---

## `suppliers` — `src/stores/suppliers.ts`

Supplier directory and purchase orders. Key: `_dummy-suppliers` (stores `{ suppliers, pos }`). Seeded from `src/mocks/suppliers.ts`.

**State**
- `suppliers: Supplier[]`
- `purchaseOrders: PurchaseOrder[]`

**Actions**
- `addSupplier(draft)` — appends with generated `id`, `createdAt`
- `updateSupplier(supplier)` — replaces entry by id
- `addPO(draft)` — prepends PO with `status: 'draft'` and generated `id`
- `updatePOStatus(id, status)` — changes PO status; updates `updatedAt`

> **NOTE:** Fetch this later to `<VITE_API_PRODUCT>` (supplier/PO endpoints)

---

## `media` — `src/stores/media.ts`

Media asset library. Key: `_dummy-media`. Seeded from `src/mocks/media.ts`.

**State**
- `assets: MediaAsset[]`

**Actions**
- `add(file, type, tags): MediaAsset` — creates an asset entry from a browser `File` object; URL is a `blob:` object URL via `URL.createObjectURL`
- `remove(id)` — deletes asset entry from the list

> **NOTE:** Fetch this later to `<VITE_API_MEDIA>`

---

## Cross-store patterns

### Notification emission (standard pattern)
```ts
const notif = useNotificationStore()
productStore.add(draft)
notif.add('success', 'Product Added', `"${draft.name}" added to catalog.`)
```

### Settings helpers in views
```ts
const settings = useSettingsStore()
settings.formatPrice(product.price)   // → '$59.99'
settings.formatDate(order.createdAt)  // → '06/15/2024'
```
