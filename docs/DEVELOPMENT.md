# Development Guide

Setup, scripts, conventions, and testing information.

---

## Prerequisites

- **Node.js** v20 or higher
- **Bun** v1.0 or higher

---

## Getting Started

```bash
# Clone and install
bun install

# Start dev server → http://localhost:9006
bun run dev
```

Login with `demouser` / `demouser` (role: `superadmin`).

---

## Available Scripts

| Script | Command | Description |
| :-     | :-      | :-          |
| `dev` | `bun run dev` | Vite dev server on port 9006 with HMR |
| `build` | `bun run build` | Type-check then bundle for production |
| `start` | `bun run start` | Serve the production build (`dist/`) on `PORT` |
| `preview` | `bun run preview` | Vite preview server for the production build |
| `test` | `bun run test` | Run all unit tests once (Vitest) |
| `test:e2e` | `bun run test:e2e` | Run all E2E tests (Playwright) |
| `lint` | `bun run lint` | ESLint with auto-fix |
| `format` | `bun run format` | Prettier format all source files |

---

## Environment Variables

Copy `.env.template` to `.env` and set the service endpoints:

```env
VITE_API_ACCOUNT=http://localhost:9001
VITE_API_MEDIA=http://localhost:9002
VITE_API_PRODUCT=http://localhost:9003
VITE_API_PURCHASE=http://localhost:9004
VITE_API_SESSION=http://localhost:9005
PORT=9006
```

`VITE_*` variables are baked into the bundle at **build time** via `import.meta.env`. `PORT` is the only runtime variable — it controls which port `bun run start` listens on.

> Variables must be prefixed with `VITE_` to be exposed to the browser bundle.

---

## Linting and Formatting

```bash
bun run lint      # ESLint auto-fix (.vue, .ts, .js)
bun run format    # Prettier format (.vue, .ts, .js, .css, .json)
```

Config files:
- `eslint.config.js` — flat config with `@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-config-prettier`
- `.prettierrc` — 4-space indent, double quotes, no trailing comma, 100-char print width

---

## Mocking Strategy

Each data store seeds from its corresponding mock file on first run and persists to `localStorage`:

| Store | Mock source | localStorage key |
| :-    | :-          | :-               |
| products | `src/mocks/products.ts` | `_dummy-products` |
| suppliers | `src/mocks/suppliers.ts` | `_dummy-suppliers` |
| media | `src/mocks/media.ts` | `_dummy-media` |
| notifications | seeds array in store | `_dummy-notification` |
| settings | hardcoded defaults | `_dummy-settings` |

Every mock data block includes:
```ts
// NOTE:
// - Fetch this later to: <VITE_API_PRODUCT>
```

To reset all dummy data: open DevTools → Application → Storage → Clear Site Data.

When implementation changes, update the docs.

---

## Testing

Tests live in `src/tests/` and run with **Vitest** in a **happy-dom** environment.

```bash
bun run test                          # run once
bun run test -- --watch               # watch mode
bun run test -- --reporter=verbose
```

### Current coverage

| File | Tests | Coverage area |
| :-   | :-    | :-            |
| `stores/products.test.ts` | 9 | CRUD, persistence, reload |
| `stores/notifications.test.ts` | 10 | add, markRead, markAllRead, unreadCount, relativeTime |
| `stores/settings.test.ts` | 13 | defaults, save/reload, formatPrice, formatDate (3 formats) |
| `stores/suppliers.test.ts` | 9 | addSupplier, updateSupplier, addPO, updatePOStatus |
| `stores/media.test.ts` | 10 | add, remove, persistence, reload |
| `services/http.test.ts` | 14 | GET/POST/PUT/PATCH/DELETE, auth header, query params, 401/403/5xx |
| **Total** | **65** | |

### Test setup

`src/tests/setup.ts` runs before each test file:
```ts
beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})
```

This gives each test a clean localStorage and a fresh Pinia instance, making tests fully isolated.

### E2E Testing

E2E tests live in `tests/e2e/` and run with **Playwright**.

```bash
bun run test:e2e                                      # Run all E2E tests
CI=1 bun run test:e2e                                 # CI mode (headless, no report open)
bun run test:e2e -- --project=chromium                # Only Chromium
```

#### Current E2E coverage

| File | Scenarios |
| :-   | :-        |
| `auth.spec.ts` | Login with demo creds, Error handling for invalid creds |
| `products.spec.ts` | List products, Search products, Add new product |

> **Note:** Due to environment restrictions, Playwright is configured to use **Chromium** only. Other browser dependencies (Firefox, WebKit) may be missing in some environments.

### Writing a new store test

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/products'

describe('useProductStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('does something', () => {
    const store = useProductStore()
    // ...
  })
})
```

---

## Coding Conventions

### File naming

| Type | Convention | Example |
| :-   | :-         | :-      |
| Components | PascalCase | `DataTable.vue` |
| Views | PascalCase + `View` suffix | `ProductsView.vue` |
| Stores | camelCase | `products.ts` |
| Types | camelCase | `product.ts` |
| Styles | kebab-case | `global.css` |

### Component structure

```vue
<template>
  <!-- template -->
</template>

<script setup lang="ts">
// imports
// store/composable usage
// refs and reactives
// computed
// functions
</script>

<style scoped>
/* styles */
</style>
```

### State management rules

- **Pinia stores** for data that is shared across more than one view or that needs to persist.
- **`ref` / `reactive`** for local UI state (form open/close, selected tab, pending file).
- Never mutate store state directly from a component — always call a store action.

### Form values

`FormInput` always emits `string` from its `@input` handler (even for `type="number"`). Parse in the store action:
```ts
price: parseFloat(String(form.price)) || 0
stock: parseInt(String(form.stock)) || 0
```

### Adding a new module

1. Add the TypeScript interface to `src/types/`.
2. Add mock seed data to `src/mocks/`.
3. Create a Pinia store in `src/stores/` following the load-seed-persist pattern.
4. Create the view in `src/views/`.
5. Add the route to `src/router/index.ts` with appropriate `meta.roles`.
6. Add the nav item in `src/layouts/AppLayout.vue`.
7. Write store tests in `src/tests/stores/`.

---

## Project port

The Vite dev server runs on **port 9006** (`vite.config.ts → server.port`). The backend microservices are expected on ports 9001–9005.
