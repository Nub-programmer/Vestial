import { NextResponse } from 'next/server'

type ServiceHealth = {
  status: 'ok' | 'missing' | 'error'
  message?: string
  latencyMs?: number
}

type HealthResponse = {
  timestamp: string
  services: Record<string, ServiceHealth>
}

const TIMEOUT_MS = 2500

async function probe(url: string, init: RequestInit = {}): Promise<ServiceHealth> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const startedAt = Date.now()

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
    })

    const latencyMs = Date.now() - startedAt

    if (!response.ok) {
      return {
        status: 'error',
        message: `HTTP ${response.status}`,
        latencyMs,
      }
    }

    return { status: 'ok', latencyMs }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed'
    return { status: 'error', message }
  } finally {
    clearTimeout(timer)
  }
}

export async function GET() {
  const services: Record<string, ServiceHealth> = {}

  const finnhubKey = process.env.FINNHUB_API_KEY
  const newsKey = process.env.NEWSAPI_KEY
  const groqKey = process.env.GROQ_API_KEY
  const databaseUrl = process.env.DATABASE_URL

  if (!finnhubKey) {
    services.finnhub = { status: 'missing', message: 'FINNHUB_API_KEY is not set' }
  } else {
    services.finnhub = await probe(
      `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${finnhubKey}`
    )
  }

  if (!newsKey) {
    services.newsapi = { status: 'missing', message: 'NEWSAPI_KEY is not set' }
  } else {
    services.newsapi = await probe(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${newsKey}`
    )
  }

  services.groq = groqKey
    ? { status: 'ok', message: 'Key present (probe skipped)' }
    : { status: 'missing', message: 'GROQ_API_KEY is not set' }

  services.database = databaseUrl
    ? { status: 'ok', message: 'DATABASE_URL is set' }
    : { status: 'missing', message: 'DATABASE_URL is not set' }

  const payload: HealthResponse = {
    timestamp: new Date().toISOString(),
    services,
  }

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
