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
  const basePrice = 100 + Math.random() * 200
  const change = (Math.random() - 0.5) * 10
  const changePercent = (change / basePrice) * 100

  return {
    price: basePrice,
    change: change,
    changePercent: changePercent,
    high52Week: basePrice + 50,
    low52Week: basePrice - 30,
    marketCap: `$${(Math.random() * 1000).toFixed(1)}B`,
    peRatio: 15 + Math.random() * 20,
    dividendYield: Math.random() * 5,
    volume: Math.floor(Math.random() * 50000000),
    avgVolume: Math.floor(Math.random() * 30000000),
  }
}
