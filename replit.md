# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **File uploads**: multer (stored in `artifacts/api-server/uploads/`)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── client-portal/      # React + Vite client portal frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Client Portal Features

A client portal for a freelance design business at `/`:

- **Dashboard**: Summary stats (active projects, requests by status), recent request feed, active projects list
- **Projects**: List of all client projects; click to view project details and its associated requests
- **Requests Tracker**: Full list of requests with status/priority badges; filter by status; click for detail
- **Request Detail**: Full description, status, priority, file attachments, comment thread, status update dropdown
- **New Request Form**: Submit with project (optional), title, description, priority, client name and email
- **File Uploads**: Attach files to requests (up to 50MB, stored on disk)
- **Comments**: Add client-visible or internal-only notes to any request

## Database Schema

- `projects` — client projects with name, description, client info
- `requests` — design requests with status (`pending` | `in_review` | `in_progress` | `needs_feedback` | `completed` | `cancelled`) and priority (`low` | `medium` | `high`)
- `files` — file attachments uploaded to requests (stored in `artifacts/api-server/uploads/`)
- `comments` — threaded comments on requests, optionally internal-only

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files emitted during typecheck; JS bundling handled by esbuild/vite
- **Project references** — when package A depends on B, A's `tsconfig.json` must list B in `references`

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build`
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## Packages

### `artifacts/client-portal` (`@workspace/client-portal`)

React + Vite frontend. Served at `/`. Uses `@workspace/api-client-react` for typed API calls.

- Pages: Dashboard, Projects, ProjectDetail, Requests, RequestDetail, RequestNew, NotFound
- Components: AppLayout (sidebar), StatusBadge, PriorityBadge, shadcn/ui components
- Hooks: `src/hooks/use-projects.ts`, `src/hooks/use-requests.ts`

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes in `src/routes/`:

- `health.ts` — GET /api/healthz
- `projects.ts` — CRUD for projects
- `requests.ts` — CRUD for requests (with filter by projectId/status)
- `files.ts` — list + upload files (multer multipart)
- `comments.ts` — list + create comments

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM. Schema in `src/schema/`:
- `projects.ts`, `requests.ts`, `files.ts`, `comments.ts`

Run migrations: `pnpm --filter @workspace/db run push`

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec (`openapi.yaml`) + Orval config. Run: `pnpm --filter @workspace/api-spec run codegen`
