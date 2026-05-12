# Quick Start (5 minutes)

Get Vestial running locally in 5 minutes.

## Step 1: Clone & Install (1 minute)

```bash
git clone <repo-url>
cd vestial
npm install
```

## Step 2: Get Free API Keys (2 minutes)

### Groq (AI)
- Visit https://console.groq.com
- Sign up → API Keys → Copy key

### NewsAPI
- Visit https://newsapi.org  
- Sign up → Account → Copy API key

### Finnhub (Market Data)
- Visit https://finnhub.io
- Sign up → Dashboard → Copy API key

## Step 3: Setup Environment (1 minute)

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your 3 API keys:
```
GROQ_API_KEY=paste_here
NEWSAPI_KEY=paste_here
FINNHUB_API_KEY=paste_here
```

## Step 4: Run (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 — Done! ✨

## Try It Out

1. Click "Start Exploring"
2. Search for "AAPL" or "Apple"
3. Browse company details
4. Try compare and watchlist

## Troubleshooting

**"Module not found"** → Run `npm install` again

**Port 3000 in use** → Run `npm run dev -- -p 3001`

**API errors** → Check `.env.local` has correct keys, restart dev server

## Next Steps

- Full setup guide: See [SETUP.md](./SETUP.md)
- Full docs: See [README.md](./README.md)
- Contributing: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Need help?** Check [SETUP.md](./SETUP.md) for detailed troubleshooting.
