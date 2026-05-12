# Development Setup Guide

## Prerequisites

- **Node.js 18+** with npm/yarn/pnpm
- **Git** for version control
- **A text editor** (VS Code recommended)
- **Free API accounts** (see below)

## Getting Free API Keys

### 1. Groq API (for AI)
1. Visit https://console.groq.com
2. Sign up with Google or GitHub
3. Go to **API Keys** section
4. Create a new API key
5. Copy the key to `.env.local`

### 2. NewsAPI (for news data)
1. Visit https://newsapi.org
2. Sign up for free tier
3. Go to **Account** → **API Keys**
4. Copy your API key
5. Add to `.env.local`

### 3. Finnhub (for market data)
1. Visit https://finnhub.io
2. Sign up for free tier
3. Go to **Dashboard** → **API Key**
4. Copy your API key
5. Add to `.env.local`

### 4. Neon (PostgreSQL) - Optional
For saving watchlists and comparisons:
1. Visit https://neon.tech
2. Sign up (free tier includes PostgreSQL)
3. Create a new project
4. Get the connection string
5. Add `DATABASE_URL` to `.env.local`

## Local Setup Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd vestial

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Add your API keys to .env.local
# Edit .env.local and paste your API keys

# 5. Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Environment Variables

Create `.env.local`:
```env
# Required
GROQ_API_KEY=your_key_here
NEWSAPI_KEY=your_key_here
FINNHUB_API_KEY=your_key_here

# Optional (add for database features)
DATABASE_URL=postgresql://...

# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Useful Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# TypeScript validation
npm run type-check

# Lint code
npm run lint

# Database operations (if using Neon)
npm run db:push      # Sync schema
npm run db:studio    # Open Prisma UI
npm run db:generate  # Generate Prisma client
```

## Project Structure Quick Reference

```
vestial/
├── app/              # Pages and API routes
│   ├── page.tsx      # Home page
│   ├── company/      # Company detail pages
│   ├── search/       # Search page
│   ├── compare/      # Compare page
│   ├── watchlist/    # Watchlist page
│   ├── about/        # About page
│   └── api/          # API endpoints
├── components/ui/    # Reusable UI components
├── lib/
│   ├── api/          # External API wrappers
│   ├── types.ts      # TypeScript types
│   └── utils.ts      # Utility functions
├── prisma/           # Database schema
└── README.md         # Full documentation
```

## Possible Issues & Solutions

### "API key missing" error
- Make sure `.env.local` exists in root directory
- Check keys are pasted correctly (no trailing spaces)
- Restart dev server after adding keys

### "Cannot find module" errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run dev`

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### CSS not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check that `globals.css` is imported in `layout.tsx`

## Testing the App

1. Go to http://localhost:3000
2. Click "Start Exploring"
3. Search for "AAPL" or "Apple"
4. Browse company details
5. Compare companies
6. Add to watchlist

## Next Steps

After setup:
- [ ] Read the [README.md](./README.md) for full feature list
- [ ] Explore the codebase structure
- [ ] Test with different company symbols
- [ ] Try all pages (search, compare, watchlist, about)
- [ ] Check out API responses in browser DevTools
- [ ] Customize styling or add new features

## Getting Help

- Check [README.md](./README.md) for detailed documentation
- Review [lib/api/](./lib/api/) for API integration examples
- Look at [components/ui/](./components/ui/) for component usage
- Read code comments for additional context

## Production Deployment

See `README.md` section "Deployment to Vercel" for production setup.

Happy coding! 🚀
