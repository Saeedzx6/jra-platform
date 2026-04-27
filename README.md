# JRA Platform — Jordan Restaurants Association

A full-stack web platform for the Jordan Restaurants Association, built with Next.js 14, Express, PostgreSQL, and Prisma.

**Live site:** https://jra-platform-web-psi.vercel.app/en

---

## Security Notice

This is a **public repository**. Never commit real passwords, API keys, or secrets to this repo.

All secrets are managed via environment variables:
- **Render** — stores `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- **Vercel** — stores `NEXT_PUBLIC_API_URL`

After deploying, **change the default admin password** immediately by logging into the admin panel.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Radix UI |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Auth | JWT (access + refresh tokens) |
| i18n | next-intl (English + Arabic) |

---

## Live Deployment

| Service | URL |
|---------|-----|
| Website | https://jra-platform-web-psi.vercel.app/en |
| API | https://jra-platform.onrender.com/api/health |

> **Note:** The API is hosted on Render's free tier and sleeps after 15 minutes of inactivity. The first request after a period of no traffic may take 30–60 seconds to respond.

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL 15+ running locally

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

**Backend** (`apps/api/.env`):
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/jra_db
JWT_ACCESS_SECRET=replace_with_long_random_string
JWT_REFRESH_SECRET=replace_with_another_long_random_string
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** (`apps/web/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Set up the database

```bash
# Create the database in PostgreSQL
createdb jra_db

# Run migrations
pnpm db:generate
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 4. Start development servers

```bash
pnpm dev
```

- Frontend: http://localhost:3000/en
- Backend API: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

---

## Project Structure

```
jra-platform/
├── apps/
│   ├── web/               # Next.js 14 frontend
│   │   └── src/
│   │       ├── app/[locale]/   # Pages (en/ar)
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

## Key Routes

| Route | Description |
|-------|-------------|
| `/en` | Homepage |
| `/en/members` | Member directory |
| `/en/events` | Events listing |
| `/en/trainings` | Training programs |
| `/en/news` | Blog / News |
| `/en/about` | About JRA |
| `/en/login` | Sign in |
| `/en/dashboard` | Member dashboard |
| `/en/admin` | Admin panel |
| `/ar/*` | Arabic versions of all pages |

---

## API Endpoints

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

## Default Seed Credentials

> ⚠️ **Change these immediately after deploying to production.**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jra.jo | Admin@1234 |
| Member | ahmad@levantgrill.jo | Member@1234 |
