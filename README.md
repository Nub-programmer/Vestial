# Vestial

**AI-powered company intelligence in minutes.**

Vestial helps you go from a company name or ticker to a clean, source-backed brief with market data, news, risks, opportunities, and beginner-friendly explanations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Neon](https://img.shields.io/badge/Neon-Postgres-00E599)
![Groq](https://img.shields.io/badge/Groq-API-F55036)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

## Status

- Active development
- Core product flow is live: search → company brief → compare/watchlist
- Deployment target: Vercel + Neon Postgres

## What it does

Vestial is a modern web app for quick company research. You search a company, and it returns:

- live market snapshot
- recent news feed
- AI summary
- bullish and bearish factors
- risks and opportunities
- "Explain Like I'm 15" section

The goal is to make company research fast, clear, and useful for both beginners and advanced users.

## Features

- Company/ticker search
- AI-generated company brief
- Live market data integration
- Recent news with simple sentiment labels
- Risks and opportunities breakdown
- Beginner-friendly explanation mode
- Company comparison view
- Watchlist support
- Responsive dark-first UI with loading/empty/error states

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Recharts

**Backend / Data**
- Next.js Route Handlers
- Zod
- Prisma
- Neon Postgres
- Groq API
- NewsAPI / Finnhub

**Deployment**
- Vercel

## Screenshots

Screenshots coming soon.

Suggested captures:
- Landing page
- Search page
- Company brief page
- Compare page
- Watchlist page

## Folder Structure

```txt
vestial/
├── app/
│   ├── api/
│   ├── company/
│   ├── compare/
│   ├── search/
│   ├── watchlist/
│   └── about/
├── components/
│   └── ui/
├── lib/
│   ├── api/
│   ├── hooks/
│   ├── cache.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── .env.example
└── README.md
```

## Environment Variables

Use `.env.local` for local development. Never commit real secrets.

```env
GROQ_API_KEY=your_groq_api_key_here
NEWSAPI_KEY=your_newsapi_key_here
FINNHUB_API_KEY=your_finnhub_api_key_here
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Vercel notes

- Add the same variables in Vercel Project Settings → Environment Variables.
- Keep API keys server-side only.
- `NEXT_PUBLIC_SITE_URL` should be your deployed app URL in production.

## Local Development

```bash
# 1) install deps
npm install

# 2) create env file
cp .env.example .env.local

# 3) run app
npm run dev
```

Open `http://localhost:3000`.

Optional database setup:

```bash
npm run db:generate
npm run db:push
```

## Deployment (Vercel)

1. Push your repo to GitHub.
2. Import the repo in Vercel.
3. Add env vars from `.env.example`.
4. Deploy.

If Prisma schema changes, run `prisma db push` against your Neon database.

## Future Improvements

- Auth + multi-user watchlists
- Better charting and timeframe controls
- Brief/history caching at DB layer
- Better source attribution per section
- Alerting and notifications
- Optional light mode

## About

Built by **Atharv Singh Negi**.

Vestial is designed as a portfolio-ready, open-source style project focused on clean architecture, practical UX, and real API integrations.
