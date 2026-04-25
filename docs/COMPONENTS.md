# UI Components

Reusable UI primitives in `src/components/ui/`. All are business-logic-agnostic — they receive data via props and emit events for interactions. Styles are fully scoped and reference the global CSS variable system.

---

## Component Reference

### `AppIcon`
**File:** `AppIcon.vue`

Renders inline SVG icons by name. No external icon library.

```vue
<AppIcon name="products" :size="18" />
```

**Props**
| Prop | Type | Default | Description |
| :-   | :-   | :-      | :-          |
| `name` | `string` | required | Icon identifier |
| `size` | `number` | `20` | Width and height in px |

**Available icons:** `dashboard`, `products`, `orders`, `customers`, `suppliers`, `promotions`, `reports`, `media`, `notifications`, `settings`, `admin`, `logout`, `chevron-left`, `chevron-right`, `plus`, `edit`, `trash`, `upload`, `check`, `x`, `search`, `alert`, `eye`, `download`, `refresh`, `user`, `menu`

---

### `DataTable`
**File:** `DataTable.vue`

Sortable data table with slot-based cell and action column overrides.

```vue
<DataTable :columns="cols" :rows="items" :total="100" :page="1" :pageSize="20" @sort="onSort">
  <template #cell-status="{ row }">
    <StatusBadge :status="row.status" />
  </template>
  <template #actions="{ row }">
    <button @click="edit(row)">Edit</button>
  </template>
</DataTable>
```

**Props**
| Prop | Type | Description |
| :-   | :-   | :-          |
| `columns` | `Column[]` | `{ key, label, sortable?, width? }` |
| `rows` | `Record<string, unknown>[]` | Data rows |
| `total` | `number` | Total record count (for display) |
| `page` | `number` | Current page number |
| `pageSize` | `number` | Rows per page |
| `sortState` | `SortState` | `{ field, dir }` |

**Events:** `@sort(field: string)`

---

### `StatusBadge`
**File:** `StatusBadge.vue`

Colour-coded pill for status values.

```vue
<StatusBadge status="active" />
```

**Prop:** `status: string` — maps to a CSS class for colouring. Common values: `active`, `archived`, `out_of_stock`, `pending`, `confirmed`, `draft`, `suspended`.

---

### `KpiCard`
**File:** `KpiCard.vue`

Metric card with icon, label, value string, and trend indicator.

```vue
<KpiCard icon="reports" label="Gross Revenue" value="$87,410" :trend="8" />
```

**Props**
| Prop | Type | Description |
| :-   | :-   | :-          |
| `icon` | `string` | AppIcon name |
| `label` | `string` | Metric label |
| `value` | `string` | Formatted value string |
| `trend` | `number` | Percentage change; positive = green arrow, negative = red arrow |

---

### `FormInput`
**File:** `FormInput.vue`

Unified form field for text, number, date, select, and textarea inputs.

```vue
<FormInput label="Price" v-model="form.price" type="number" step="0.01" />
<FormInput label="Status" v-model="form.status" type="select" :options="statusOptions" />
<FormInput label="Notes" v-model="form.notes" type="textarea" :rows="4" />
```

**Props**
| Prop | Type | Default | Description |
| :-   | :-   | :-      | :-          |
| `modelValue` | `string \| number` | required | v-model target |
| `label` | `string` | — | Field label |
| `type` | `string` | `'text'` | Input type or `'select'` / `'textarea'` |
| `options` | `{ value, label }[]` | — | Options for select |
| `placeholder` | `string` | — | |
| `error` | `string` | — | Validation error message |
| `hint` | `string` | — | Helper text below field |
| `required` | `boolean` | — | Shows `*` on label |
| `disabled` | `boolean` | — | |
| `min/max/step` | `string \| number` | — | For number inputs |
| `rows` | `number` | `4` | For textarea |

---

### `PageHeader`
**File:** `PageHeader.vue`

Consistent page title bar with breadcrumb trail and optional action slot.

```vue
<PageHeader title="Products" :breadcrumbs="[{ label: 'Products' }]">
  <template #actions>
    <button>Add Product</button>
  </template>
</PageHeader>
```

**Props:** `title: string`, `breadcrumbs: { label: string; to?: string }[]`

---

### `SearchBar`
**File:** `SearchBar.vue`

Debounced search input with magnifier icon.

```vue
<SearchBar v-model="search" placeholder="Search by name…" />
```

**Props:** `modelValue: string`, `placeholder?: string`

---

### `ConfirmModal`
**File:** `ConfirmModal.vue`

Overlay modal for destructive-action confirmation.

```vue
<ConfirmModal
  :open="showConfirm"
  title="Archive Product"
  message="This action cannot be undone."
  icon="trash"
  confirm-label="Archive"
  @confirm="doArchive"
  @cancel="showConfirm = false"
/>
```

**Props:** `open: boolean`, `title: string`, `message: string`, `icon?: string`, `confirmLabel?: string`
**Events:** `@confirm`, `@cancel`

---

### `ToastNotification`
**File:** `ToastNotification.vue`

Renders the active toast queue from `useToastStore`. Mounted once in `App.vue`. Not used directly by views.

---

### `SkeletonLoader`
**File:** `SkeletonLoader.vue`

Animated placeholder block for loading states.

```vue
<SkeletonLoader :lines="3" />
```

**Props:** `lines?: number` (default `1`), `height?: string`

---

### `FileDropzone`
**File:** `FileDropzone.vue`

Drag-and-drop file upload area.

```vue
<FileDropzone accept="image/*,video/mp4" @file="onFile" />
```

**Props:** `accept?: string` — MIME type filter passed to the file input
**Events:** `@file(file: File)` — emitted when a file is selected or dropped
