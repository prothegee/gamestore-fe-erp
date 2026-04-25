# TypeScript Types

All shared type definitions are in `src/types/`. Strict mode is enabled in `tsconfig.app.json`.

---

## Common (`src/types/common.ts`)

```ts
type RbacRole = 'superadmin' | 'manager' | 'staff' | 'viewer'

interface SortState {
  field: string
  dir: 'asc' | 'desc'
}
```

---

## Auth (`src/types/auth.ts`)

```ts
interface AuthUser {
  id: string
  username: string
  email: string
  role: RbacRole
}
```

Session data is stored in `localStorage` as `erp_token` (string) and `erp_user` (JSON).

---

## Product (`src/types/product.ts`)

```ts
type Platform = 'PC' | 'PS5' | 'PS4' | 'Xbox Series X' | 'Xbox One' | 'Nintendo Switch' | 'Mobile'
type Genre    = 'Action' | 'RPG' | 'Strategy' | 'Sports' | 'FPS' | 'Adventure' | 'Simulation' | 'Horror' | 'Racing'
type ProductStatus = 'active' | 'archived' | 'out_of_stock'

interface Product {
  id: string
  name: string
  sku: string
  platform: Platform
  genre: Genre
  price: number
  cost: number
  stock: number
  lowStockThreshold: number
  status: ProductStatus
  coverUrl?: string
  mediaAssetId?: string
  description: string
  publisher: string
  releaseDate: string   // ISO date string 'YYYY-MM-DD'
  createdAt: string     // ISO 8601
  updatedAt: string     // ISO 8601
}

interface StockUpdate {
  productId: string
  delta: number
  reason: string
}
```

---

## Order (`src/types/order.ts`)

```ts
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'

interface OrderItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  total: number
}

interface Order {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  shippingAddress: string
  createdAt: string
  updatedAt: string
}
```

---

## Customer (`src/types/customer.ts`)

```ts
type CustomerTier = 'bronze' | 'silver' | 'gold' | 'platinum'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  tier: CustomerTier
  totalOrders: number
  lifetimeValue: number
  createdAt: string
}
```

---

## Supplier (`src/types/supplier.ts`)

```ts
type PoStatus = 'draft' | 'sent' | 'confirmed' | 'received' | 'closed'

interface Supplier {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  country: string
  leadTimeDays: number
  fillRate: number    // 0.0 – 1.0
  defectRate: number  // 0.0 – 1.0
  createdAt: string
}

interface PurchaseOrderItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitCost: number
  total: number
}

interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  items: PurchaseOrderItem[]
  subtotal: number
  status: PoStatus
  expectedAt?: string
  receivedAt?: string
  createdAt: string
  updatedAt: string
}
```

---

## Promotion (`src/types/promotion.ts`)

```ts
type DiscountType  = 'percentage' | 'fixed'
type PromotionType = 'discount_code' | 'sale_event' | 'bundle'
type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'draft'

interface Promotion {
  id: string
  name: string
  type: PromotionType
  discountType: DiscountType
  discountValue: number
  code?: string
  startsAt: string
  endsAt: string
  status: PromotionStatus
  usageCount: number
  usageLimit?: number
  applicablePlatforms: string[]
  createdAt: string
}
```

---

## Media (`src/types/media.ts`)

```ts
type AssetType = 'cover' | 'banner' | 'trailer' | 'screenshot'

interface MediaAsset {
  id: string
  name: string
  type: AssetType
  url: string                  // blob: URL in dev; CDN URL in production
  size: number                 // bytes
  mimeType: string
  linkedProductIds: string[]
  tags: string[]
  uploadedAt: string
}
```

---

## Notifications (store-level, `src/stores/notifications.ts`)

```ts
type NotifType = 'warning' | 'info' | 'success' | 'error'

interface AppNotification {
  id: number
  type: NotifType
  title: string
  message: string
  time: string   // ISO 8601
  read: boolean
}
```

---

## Best Practices

- Use the `Platform`, `Genre`, `ProductStatus`, etc. literal unions instead of plain `string` for domain fields to get exhaustiveness checking.
- `id` fields are always `string` — generated as `'p' + Date.now()` in dummy stores and will be replaced by server-issued UUIDs when real APIs are connected.
- Date fields (`createdAt`, `updatedAt`, `releaseDate`) are all ISO strings. Use `useSettingsStore().formatDate(iso)` for display.
- Price fields (`price`, `cost`, `total`) are `number` (float). Use `useSettingsStore().formatPrice(amount)` for display.
