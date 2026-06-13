# Portfolio

Personal portfolio site built with **Next.js** — admin-managed content, local JSON storage, no database required.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET
npm run dev
```

- **Site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

## Profile image

```
public/profile/profile.png
```

Current: **934×1685** (portrait) — works with `object-fit: cover` in hero/about.

## Project screenshots

Upload via admin panel or copy to `public/projects/`. Recommended: **1200×675** (16:9).

## Data files (admin-managed)

```
data/projects.json
data/experience.json
data/stack.json
data/site.json
```

## Pre-filled personal projects

1. Multi-Tenant CRM
2. Task Studio
3. Black Pearl E-Commerce

Add screenshots from admin when ready.
