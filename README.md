# GameStore ERP — Frontend

Internal ERP system for GameStore. Built with Vue 3, TypeScript, and Vite. Manages products, orders, customers, suppliers, promotions, media assets, reports, and staff accounts.

## Tech Stack

| Layer | Technology |
| :-    | :-         |
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript (strict) |
| Build | Vite 5 |
| State | Pinia |
| Routing | Vue Router 4 |
| HTTP | Native `fetch` via `createServiceClient` |
| Testing | Vitest + Playwright |
| Styles | Vanilla CSS with CSS custom properties |
| Linting | ESLint 10 (flat config) + typescript-eslint + eslint-plugin-vue |
| Formatting | Prettier 3 |

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:9006)
bun run dev

# Build for production
bun run build

# Serve production build
bun run start

# Run unit tests
bun run test

# Run E2E tests
bun run test:e2e

# Preview production build
bun run preview

# Lint with auto-fix
bun run lint

# Format all files
bun run format
```

## Demo Login

| Field | Value |
| :-    | :-    |
| Username | `demouser` |
| Password | `demouser` |
| Role | `superadmin` |

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

`VITE_*` variables are baked into the bundle at build time. `PORT` is the runtime port used by the static file server (`bun run start`).

## Documentation

| Doc | Description |
| :-  | :-          |
| [Architecture](./docs/ARCHITECTURE.md) | System design, service layer, data flow |
| [Stores](./docs/STORES.md) | Pinia store API reference |
| [Views](./docs/VIEWS.md) | Module descriptions and route table |
| [Components](./docs/COMPONENTS.md) | UI component library reference |
| [Types](./docs/TYPES.md) | TypeScript type definitions |
| [Development](./docs/DEVELOPMENT.md) | Setup, scripts, conventions, testing |

## Project Structure

```
src/
├── components/ui/     # Reusable UI primitives (11 components)
├── layouts/           # AppLayout (sidebar + topbar shell)
├── mocks/             # Seed data (seeded into localStorage on first load)
├── router/            # Vue Router config + auth/RBAC guards
├── services/          # HTTP client (createServiceClient)
├── stores/            # Pinia stores (8 stores)
├── styles/            # Global CSS variables and resets
├── tests/             # Vitest integration tests (65 tests)
├── types/             # TypeScript interfaces
└── views/             # Page-level Vue components (14 views)
```

---

###### end of gamestore-fe-erp
