# Views & Modules

All views are in `src/views/` and are lazy-loaded by the router. Each view is a "container" component: it owns page-level state, reads from a Pinia store, and composes UI primitives from `src/components/ui/`.

---

## Route Table

| Route | View file | Min role | Description |
| :-    | :-        | :-       | :-          |
| `/login` | `auth/LoginView.vue` | — | Authentication gateway |
| `/` | `DashboardView.vue` | `viewer` | KPI summary, low-stock alerts, recent orders |
| `/products` | `products/ProductsView.vue` | `staff` | Product catalog with add/edit inline form |
| `/products/:id` | `products/ProductDetailView.vue` | `staff` | Product detail, inventory, pricing, archive |
| `/orders` | `orders/OrdersView.vue` | `staff` | Order list with status filter |
| `/orders/:id` | `orders/OrderDetailView.vue` | `staff` | Full order detail and status management |
| `/customers` | `customers/CustomersView.vue` | `staff` | Customer directory |
| `/suppliers` | `suppliers/SuppliersView.vue` | `manager` | Supplier cards + PO management |
| `/promotions` | `promotions/PromotionsView.vue` | `manager` | Discount codes and sale events |
| `/reports` | `reports/ReportsView.vue` | `manager` | Analytics with 5 time-range presets + CSV export |
| `/media` | `media/MediaView.vue` | `staff` | Media asset library with upload and delete |
| `/notifications` | `notifications/NotificationsView.vue` | `viewer` | In-app notification feed |
| `/settings` | `settings/SettingsView.vue` | `manager` | System config, API endpoints, RBAC matrix, audit log |
| `/admin` | `admin/AdminView.vue` | `superadmin` | Staff account list |

---

## Module Descriptions

### Dashboard (`/`)
KPI cards (revenue, orders, customers, low-stock count) populated from mock data. Shows recent orders and a low-stock alert list. Entry point after login.

### Products (`/products`, `/products/:id`)
Full CRUD against `useProductStore` (`_dummy-products`).
- **List view**: search by name/SKU, filter by platform and status, sortable columns.
- **Inline form panel**: opens above the table for add and edit. Fields: name, SKU, platform, genre, price, cost, stock, threshold, status, publisher, release date, cover URL, description. Auto-generates a placeholder cover URL if none supplied.
- **Detail view**: read-only info card + inventory widget + pricing card. Inline edit form, archive via `ConfirmModal`.
- Emits notifications to `useNotificationStore` on add, update, archive.

### Orders (`/orders`, `/orders/:id`)
Read-only in the current implementation. List view with status filter. Detail view shows order line items and customer info. Status can be changed inline.

### Customers (`/customers`)
Customer directory from `src/mocks/customers.ts`. Shows tier badge, lifetime value, and recent order count.

### Suppliers (`/suppliers`)
Backed by `useSupplierStore` (`_dummy-suppliers`).
- **Supplier grid**: card per supplier with contact info and performance metrics (fill rate, defect rate, lead time). Inline edit via card-level edit button.
- **Add Supplier panel**: inline form above the grid.
- **Purchase Orders table**: full PO list with sortable columns. Status can be changed inline via a select dropdown.
- **New PO panel**: supplier select → product select (from `useProductStore`) → quantity + unit cost (auto-filled from product cost) → expected date.
- Emits notifications on supplier add, PO create.

### Promotions (`/promotions`)
Discount code list and sale event cards from `src/mocks/promotions.ts`. Static in current phase.

### Reports (`/reports`)
Fully interactive preset switching.
- **Presets**: Today / This Week / This Month / This Quarter / This Year — each switches all four KPI cards, both bar charts (platform, genre), financial summary, and top-SKU table.
- **CSV Export**: downloads the active preset's full dataset as a `.csv` file (KPIs, top SKUs, platform revenue, genre revenue).

### Media (`/media`)
Backed by `useMediaStore` (`_dummy-media`).
- **Upload panel**: FileDropzone → type select (cover/banner/trailer/screenshot) → tags field → Upload. Stores a `blob:` object URL in the asset record.
- **Grid**: all assets rendered as cards. Search by name or tag, filter by type.
- **Delete**: removes from store + localStorage, emits a warning notification.
- **Copy URL**: writes asset URL to clipboard.

### Notifications (`/notifications`)
Backed by `useNotificationStore` (`_dummy-notification`).
- Shows all notifications newest-first with relative timestamps (`relativeTime()`).
- Click a row to mark it read; "Mark all read" button clears the unread badge.
- The sidebar badge reflects `unreadCount` in real time.

### Settings (`/settings`)
Backed by `useSettingsStore` (`_dummy-settings`).
- **System tab**: currency, timezone, date format, page size. Live preview shows formatted price + date before saving. `save()` persists to localStorage.
- **API Endpoints tab** (debug): override backend URLs per service. Saved to `_dummy-settings`.
- **Roles & Permissions tab**: read-only matrix showing which roles can access which modules.
- **Audit Log tab**: static log of recent system events.

### Admin (`/admin`)
Superadmin only. Lists staff accounts with role badges and status. Deactivate action calls `useNotificationStore().add(...)`.
> `+ Add User` button is temporarily hidden (`<!-- NOTE: tmp hidden -->`).

---

## Inline Form Pattern

Views that support CRUD (Products, Suppliers) use a consistent pattern:

```vue
<!-- Trigger -->
<button @click="openAdd">+ Add</button>

<!-- Panel -->
<div v-if="showForm" class="form-panel card mb">
  <FormInput v-model="form.name" label="Name" required />
  ...
  <button @click="submitForm">Save</button>
  <button @click="closeForm">Cancel</button>
</div>
```

The panel sits above the main table and is toggled by `showForm`. `editingItem` is `null` for add and holds the original record for edit, allowing the same form to serve both operations.
