# OpenContributers

A habit building tool for developers who want to contribute to open source but don't know where to start.

**Live:** [opencontributers.vercel.app](https://opencontributers.vercel.app)

---

## What it does

OpenContributers delivers one open GitHub issue per day to your inbox from repositories you follow. Instead of staring at a repo with 800 open issues and closing the tab, you get one small actionable task triage it, comment on it, fix it. Small actions compound into real open source impact.

The idea: contributing to open source is hard to start but easy to maintain once you have a habit. This app builds that habit.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & API | Next.js 16 (App Router) |
| Database | PostgreSQL on Neon |
| ORM | Prisma |
| Job Queue | Redis on Upstash + BullMQ |
| Worker Host | Any always-on Node service (Northflank Sandbox, Oracle Always Free VM, small VPS, etc.) |
| Frontend Host | Vercel |
| Auth | NextAuth.js (GitHub OAuth) |
| Email | Resend |
| Styling | Tailwind CSS |

---

## How it works

1. Sign in with GitHub
2. Search for repos you care about and subscribe
3. Background workers sync open issues from GitHub every 6 hours
4. A BullMQ dispatcher checks every minute for users whose chosen local delivery time is due
5. Each user receives their digest at the local time and timezone they choose
6. You triage, comment, or fix — and build the habit

---

## Architecture

```
Vercel (Next.js)          Upstash (Redis)
  API routes       →      Job Queue
  Frontend UI      ←      ↓
                        Always-on Node Worker
                          Sync Worker
                          Digest dispatcher
                          Digest + confirmation sender
                          ↓
                        Neon (PostgreSQL)
                          Users, Repos, Issues
                          Subscriptions, EmailLogs
```

---

## Running locally

### Prerequisites

- Node.js 18+
- Docker Desktop

### 1. Clone the repo

```bash
git clone https://github.com/devansh-jagtap/openContributers
cd openContributers
npm install
```

### 2. Start local database and Redis

```bash
docker run --name opencontributers-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=opencontributers \
  -p 5432:5432 -d postgres

docker run --name opencontributers-redis \
  -p 6379:6379 -d redis
```

### 3. Create a GitHub OAuth App

Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/callback/github`

Copy the Client ID and Client Secret.

### 4. Set up environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/opencontributers"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="OpenContributers <digest@updates.yourdomain.com>"
```

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Start the app

Open two terminals:

```bash
# Terminal 1 — Next.js app
npm run dev

# Terminal 2 — Background worker
npm run worker
```

Visit `http://localhost:3000`

## Production email and worker setup

The Vercel deployment serves the website and API routes. It must not be used as
the BullMQ worker host, because Vercel functions are request-based and cannot
poll Redis continuously. Run `npm run worker:prod` on a separate always-on Node
service.

Set the same `DATABASE_URL`, `REDIS_URL`, and `RESEND_*` variables in both
Vercel and the worker host. Set the OAuth and `NEXTAUTH_*` variables on Vercel,
and set `NEXTAUTH_URL` on the worker host so confirmation links point at the
public site.

Good low-cost worker hosts:

- Northflank Sandbox: easiest free always-on option if your account has access.
- Oracle Cloud Always Free VM: most durable free option, but it needs server
  setup.
- A small VPS: usually the simplest serious production option once the app grows.

Cloudflare Workers/Pages can host request-based code and scheduled triggers, but
they are not a drop-in replacement for a long-running BullMQ worker. Keep BullMQ
on an always-on Node runtime if you want durable retries and reliable queue
processing.

Before enabling user delivery in Resend:

1. Add a domain you control in Resend and add the DNS records it gives you.
2. Wait until Resend marks the domain verified.
3. Set `RESEND_FROM_EMAIL` to an address on that verified domain.

`onboarding@resend.dev` is Resend's test sender and is not a production sender
for your users. The app now sends a confirmation email after a first GitHub
sign-in and only sends issue digests after that link is confirmed.

---

## Contributing

Contributions are welcome. Here's how:

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Open a pull request with a clear description

### Good first issues

- Add email open tracking with a pixel tracker
- Build a user settings page to change issues per day (1–5)
- Add label filtering so users receive only `good first issue` or `help wanted` issues
- Show a public repo browser on the homepage with subscriber counts
- Add GitHub webhook support for real-time issue updates instead of polling
- Write tests for API routes

---

## Database schema

```
User           — GitHub profile, email, session
Repo           — owner, name, stars, language, lastSyncedAt
Subscription   — links User to Repo, stores issuesPerDay
Issue          — GitHub issue data, labels, state
EmailLog       — tracks which issues were sent to which users
```

---

## License

MIT — do whatever you want with it.

---

Built by [Devansh Jagtap](https://github.com/devansh-jagtap)
