import { NextRequest, NextResponse } from 'next/server'
import { getMarketData, getMockMarketData } from '@/lib/api/market'
import { getNews } from '@/lib/api/news'
import {
  generateCompanyBrief,
  generateEasyExplanation,
  generateRisksAndOpportunities,
} from '@/lib/api/ai'
import type {
  CompanyBrief,
  CompanyOverview,
  RiskFactor,
  Opportunity,
} from '@/lib/types'
import { COMPANY_CATALOG, resolveAlias } from '@/lib/company-catalog'

type FinnhubSearchItem = {
  symbol?: string
  description?: string
}

async function fetchFinnhubSearch(query: string, apiKey: string): Promise<FinnhubSearchItem | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const results = Array.isArray(data?.result) ? (data.result as FinnhubSearchItem[]) : []

    const exact = results.find((item) => item.symbol?.toUpperCase() === query.toUpperCase())
    return exact ?? results[0] ?? null
  } catch {
    return null
  }
}

async function getCompanyOverview(symbol: string, fallbackQuery: string): Promise<CompanyOverview | null> {
  const cached = COMPANY_CATALOG[symbol]
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return cached ?? null
  }

  try {
    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 3600 } }
    )

    const profile = profileResponse.ok ? await profileResponse.json() : null

    let resolvedSymbol = symbol
    let resolvedName = profile?.name as string | undefined

    if (!resolvedName) {
      const fallbackSearch = await fetchFinnhubSearch(fallbackQuery, apiKey)
      if (fallbackSearch?.symbol) {
        resolvedSymbol = fallbackSearch.symbol.toUpperCase()

        if (resolvedSymbol !== symbol) {
          const altProfileResponse = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${resolvedSymbol}&token=${apiKey}`,
            { next: { revalidate: 3600 } }
          )
          const altProfile = altProfileResponse.ok ? await altProfileResponse.json() : null
          resolvedName = altProfile?.name || fallbackSearch.description || cached?.name

          return {
            symbol: resolvedSymbol,
            name: resolvedName ?? resolvedSymbol,
            description:
              cached?.description ??
              `${resolvedName ?? resolvedSymbol} operates in ${altProfile?.finnhubIndustry || 'its sector'} and is listed under ${resolvedSymbol}.`,
            sector: altProfile?.finnhubIndustry || cached?.sector || 'Unknown',
            industry: altProfile?.finnhubIndustry || cached?.industry || 'Unknown',
            website: altProfile?.weburl || cached?.website || '#',
            ceo: cached?.ceo,
            founded: cached?.founded,
            employees: cached?.employees,
          }
        }

        resolvedName = resolvedName || fallbackSearch.description || cached?.name
      }
    }

    if (!resolvedName) {
      return cached ?? null
    }

    return {
      symbol: resolvedSymbol,
      name: resolvedName,
      description:
        cached?.description ??
        `${resolvedName} operates in ${profile?.finnhubIndustry || 'its sector'} and is listed under ${resolvedSymbol}.`,
      sector: profile?.finnhubIndustry || cached?.sector || 'Unknown',
      industry: profile?.finnhubIndustry || cached?.industry || 'Unknown',
      website: profile?.weburl || cached?.website || '#',
      ceo: cached?.ceo,
      founded: cached?.founded,
      employees: cached?.employees,
    }
  } catch {
    return cached ?? null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const rawInput = (params.symbol as string) || ''
    const alias = resolveAlias(rawInput)
    const symbol = (alias ?? rawInput).toUpperCase()
    const validateOnly = request.nextUrl.searchParams.get('validate') === '1'

    const overview = await getCompanyOverview(symbol, rawInput)
    if (!overview) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    if (validateOnly) {
      return NextResponse.json({ symbol: overview.symbol, name: overview.name })
    }

    // Pull live market data, then fallback only if provider fails.
    const resolvedSymbol = overview.symbol.toUpperCase()
    let marketData
    try {
      import { COMPANY_CATALOG, resolveAlias } from '@/lib/company-catalog'
    } catch (error) {
      console.warn(`Using mock market data for ${resolvedSymbol}`)
      marketData = getMockMarketData(resolvedSymbol, overview.name)
    }

    // Recent news gives context for sentiment and summary generation.
      async function fetchProfile(symbol: string, apiKey: string) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
            { next: { revalidate: 3600 } }
          )

          if (!response.ok) {
            return null
          }

          return await response.json()
        } catch {
          return null
        }
      }

    const news = await getNews(overview.name, 15)

    // Build AI summary blocks used by the brief UI.
    let aiSummary = ''
    let easyExplanation = ''
    let risks: RiskFactor[] = []
    let opportunities: Opportunity[] = []
    let bullishFactors = []
    let bearishFactors = []

    try {
      aiSummary = await generateCompanyBrief(overview, marketData, news)
      easyExplanation = await generateEasyExplanation(overview, aiSummary)

      const analysisResult = await generateRisksAndOpportunities(
        overview,
        marketData,
        news
      )
      risks = analysisResult.risks
      opportunities = analysisResult.opportunities
      async function getCompanyOverview(input: string): Promise<{ symbol: string; overview: CompanyOverview } | null> {
        const normalized = input.trim().toUpperCase()
        const alias = resolveAlias(input)
        const symbolFromAlias = alias ? alias.toUpperCase() : null
        const cachedSymbol = symbolFromAlias ?? normalized
        const cached = COMPANY_CATALOG[cachedSymbol]
      bullishFactors = [
        marketData.price > marketData.low52Week * 1.2
          ? 'Trading well above 52-week low'
          return cached ? { symbol: cachedSymbol, overview: cached } : null
        marketData.peRatio && marketData.peRatio < 25
          ? 'Reasonable valuation metrics'
          : 'Competitive market positioning',
          let symbol = cachedSymbol
          let profile = await fetchProfile(symbol, apiKey)

          if (!profile?.name) {
            const searchMatch = await fetchFinnhubSearch(input, apiKey)
            if (searchMatch?.symbol) {
              symbol = searchMatch.symbol.toUpperCase()
              profile = await fetchProfile(symbol, apiKey)
            }
          }

          const resolvedName = profile?.name || cached?.name
          if (!resolvedName) {
            return cached ? { symbol: cachedSymbol, overview: cached } : null
          }

          const overview: CompanyOverview = {
            symbol,
            name: resolvedName,
            description:
              cached?.description ??
              `${resolvedName} operates in ${profile?.finnhubIndustry || 'its sector'} and is listed under ${symbol}.`,
            sector: profile?.finnhubIndustry || cached?.sector || 'Unknown',
            industry: profile?.finnhubIndustry || cached?.industry || 'Unknown',
            website: profile?.weburl || cached?.website || '#',
            ceo: cached?.ceo,
            founded: cached?.founded,
            employees: cached?.employees,
          }

          return { symbol, overview }
          description: 'Potential for expansion in emerging markets',
          return cached ? { symbol: cachedSymbol, overview: cached } : null
        },
      ]
    }

    // Simple sentiment score from price action plus factor balance.
    const positiveSignals = [
      marketData.changePercent > 0,
      marketData.price > marketData.high52Week * 0.9,
          const requested = params.symbol as string
    ].filter(Boolean).length

          const resolved = await getCompanyOverview(requested)
          if (!resolved) {

    const brief: CompanyBrief = {
      symbol: resolvedSymbol,
      name: overview.name,
      overview,

          const { symbol, overview } = resolved
      marketData,
      sentiment,
      bullishFactors,
      bearishFactors,
      risks,
      opportunities,
      aiSummary,
      easyExplanation,
      news: news.slice(0, 10),
      lastUpdated: new Date(),
    }

    return NextResponse.json(brief, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching company brief:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    )
  }
}
