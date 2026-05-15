import { MarketData } from '@/lib/types'

// Pulls market stats for a symbol from Finnhub.
export async function getMarketData(symbol: string): Promise<MarketData> {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) {
    throw new Error('FINNHUB_API_KEY is not configured')
  }

  try {
    // Quick quote data (price, change, volume).
    const quoteRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 300 } } // Revalidate every 5 min.
    )

    if (!quoteRes.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}`)
    }

    const quote = await quoteRes.json()

    // Extra profile info for market cap and related fields.
    const companyRes = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 3600 } } // Revalidate every hour.
    )

    const company = companyRes.ok ? await companyRes.json() : {}

    return {
      price: quote.c || 0,
      change: quote.d || 0,
      changePercent: quote.dp || 0,
      high52Week: quote.h52 || 0,
      low52Week: quote.l52 || 0,
      marketCap: company.marketCapitalization
        ? `$${(company.marketCapitalization / 1e9).toFixed(2)}B`
        : 'N/A',
      peRatio: company.pe || null,
      dividendYield: company.dividend || null,
      volume: quote.v || 0,
      avgVolume: quote.avgV || 0,
    }
  } catch (error) {
    console.error('Error fetching market data:', error)
    throw error
  }
}

// Lightweight fallback so UI still works without API data.
export function getMockMarketData(_symbol: string, _name: string): MarketData {
  const seed = _symbol
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)

  const pseudo = (value: number) => {
    const x = Math.sin(value) * 10000
    return x - Math.floor(x)
  }

  const basePrice = 80 + pseudo(seed) * 320
  const change = (pseudo(seed * 1.7) - 0.5) * 8
  const changePercent = (change / basePrice) * 100
  const volatility = 12 + pseudo(seed * 2.3) * 25
  const dailyVolume = Math.floor(5_000_000 + pseudo(seed * 3.1) * 45_000_000)
  const avgVolume = Math.floor(dailyVolume * (0.7 + pseudo(seed * 4.9) * 0.6))

  return {
    price: basePrice,
    change: change,
    changePercent: changePercent,
    high52Week: basePrice + volatility,
    low52Week: Math.max(1, basePrice - volatility),
    marketCap: `$${(30 + pseudo(seed * 5.8) * 1200).toFixed(1)}B`,
    peRatio: 12 + pseudo(seed * 6.7) * 28,
    dividendYield: pseudo(seed * 7.3) * 3.5,
    volume: dailyVolume,
    avgVolume: avgVolume,
  }
}
