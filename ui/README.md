# CABS Frontend

React frontend for the CABS (Cab Dispatch System) Spring Boot backend.

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **TanStack Query v5** - server state management
- **TanStack Store** - client-side UI state
- **Zod 4** - runtime type validation for API responses
- **Tailwind CSS v4** - styling
- **Vitest** - unit/integration tests
- **Playwright** - e2e tests

## Setup

### Prerequisites

- Node.js >= 20
- Java 9+ (for the backend)
- Maven

### Running the Backend

```bash
# from project root (cabs-java/)
mvn spring-boot:run
```

Backend starts at `http://localhost:8080`.

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI spec: `http://localhost:8080/v3/api-docs`
- H2 Console: `http://localhost:8080/h2-console`

### Running the Frontend

```bash
cd ui
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to the backend, so no CORS issues during development.

### Running Tests

```bash
# Unit tests (Vitest)
npm test

# E2E tests (Playwright - requires both backend and frontend running)
npm run test:e2e
```

## Project Structure

```
ui/src/
  schemas/       # Zod schemas mirroring backend DTOs (runtime type validation)
  api/           # Fetch-based API client layer (one file per domain)
  hooks/         # TanStack Query hooks (one file per domain)
  stores/        # TanStack Store for UI state
  components/
    layout/      # AppLayout, Sidebar
    shared/      # Reusable: StatusBadge, DetailCard, ActionButton, FormField
  pages/
    clients/     # Client CRUD + awards management
    drivers/     # Driver management + sessions + reports
    transits/    # Transit lifecycle state machine (the core flow)
    claims/      # Claim creation and processing
    contracts/   # Contract management with attachments
    carTypes/    # Car type configuration
  tests/
    unit/        # Vitest tests
    e2e/         # Playwright tests
```

## Architecture

### Data Flow

```
Backend (Spring Boot) ← REST API → Vite Proxy → API Client (fetch + Zod) → TanStack Query → React Components
```

1. **Zod schemas** (`schemas/`) validate every API response at the boundary
2. **API clients** (`api/`) are thin fetch wrappers organized by domain
3. **Query hooks** (`hooks/`) wrap TanStack Query's `useQuery`/`useMutation`
4. **Pages** consume hooks and render domain-specific UI

### Key Design Decisions

- **No list endpoints**: The backend has no `GET /clients` list endpoint. Pages use ID-based lookup instead.
- **TanStack Query for server state, TanStack Store for UI state**: Server data is never duplicated in a client store.
- **Zod at the boundary**: Type safety is guaranteed by validating API responses, not by trusting the backend contract.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with getting-started guide |
| `/clients` | Create client + ID lookup |
| `/clients/:id` | Client detail + VIP upgrade + awards |
| `/drivers` | Create driver + ID lookup |
| `/drivers/:id` | Driver detail + sessions + reports |
| `/transits` | Create transit + ID lookup |
| `/transits/:id` | **Transit lifecycle state machine** |
| `/claims` | Create/send claims |
| `/claims/:id` | Claim detail + processing |
| `/contracts` | Create contracts |
| `/contracts/:id` | Contract detail + attachments |
| `/car-types` | Car type management + register/unregister |
| `/car-types/:id` | Car type detail + activate/deactivate |
