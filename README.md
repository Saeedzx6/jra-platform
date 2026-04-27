# JRA Platform — Jordan Restaurants Association

A full-stack web platform for JRA built with Next.js 14, Express, PostgreSQL, and Prisma.

---

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL 15+ running locally

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

**Backend** — copy and fill in:
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/jra_db
JWT_ACCESS_SECRET=replace_with_long_random_string
JWT_REFRESH_SECRET=replace_with_another_long_random_string
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** — copy and fill in:
```bash
cp apps/web/.env.local.example apps/web/.env.local
```

`apps/web/.env.local` (default is fine for local dev):
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Set up the database

First create the database in PostgreSQL:
```sql
CREATE DATABASE jra_db;
```

Then run migrations:
```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Seed the database

```bash
pnpm db:seed
```

This creates:
- Admin: `admin@jra.jo` / `Admin@1234`
- 5 member restaurants (password: `Member@1234` each)
- 2 events, 2 training programs, 3 blog posts
- 3 board members

### 5. Start the development servers

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- API Health: http://localhost:4000/api/health

---

## Project Structure

```
jra-platform/
├── apps/
│   ├── web/               # Next.js 14 frontend
│   │   └── src/
│   │       ├── app/[locale]/   # All pages (en/ar)
│   │       ├── components/     # UI components
│   │       ├── context/        # Auth context
│   │       ├── lib/            # API client, utils
│   │       └── types/          # TypeScript types
│   └── api/               # Express backend
│       └── src/
│           ├── routes/         # Auth, members, events, etc.
│           ├── middleware/      # JWT auth, validation
│           └── lib/            # Prisma client, logger
└── packages/
    └── db/
        └── prisma/
            ├── schema.prisma   # Database schema
            └── seed.ts         # Seed data
```

---

## Key URLs

| Route | Description |
|-------|-------------|
| `/en` | Homepage |
| `/en/members` | Member directory |
| `/en/events` | Events listing |
| `/en/trainings` | Training programs |
| `/en/news` | Blog/News |
| `/en/about` | About JRA |
| `/en/contact` | Contact page |
| `/en/login` | Sign in |
| `/en/register` | Join JRA |
| `/en/dashboard` | Member dashboard |
| `/en/admin` | Admin panel |
| `/ar/*` | Arabic versions of all pages |

---

## API Endpoints

All API responses follow: `{ success: boolean, data: T, error?: string }`

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Cookie |
| POST | `/api/auth/logout` | JWT |
| GET | `/api/members` | Public |
| GET | `/api/events` | Public |
| GET | `/api/trainings` | Public |
| GET | `/api/posts` | Public |
| GET | `/api/board` | Public |
| POST | `/api/events/:id/register` | Member |
| POST | `/api/trainings/:id/register` | Member |
| GET | `/api/notifications` | Member |
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/members` | Admin |
| PATCH | `/api/admin/members/:id/status` | Admin |

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jra.jo | Admin@1234 |
| Member | ahmad@levantgrill.jo | Member@1234 |
