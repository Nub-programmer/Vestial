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

type FinnhubProfile = {
  name?: string
  finnhubIndustry?: string
  weburl?: string
}

function normalizeInput(input: string): string {
  try {
    return decodeURIComponent(input).trim()
  } catch {
    return input.trim()
  }
}

async function fetchProfile(symbol: string, apiKey: string): Promise<FinnhubProfile | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      return null
    }

    return (await response.json()) as FinnhubProfile
  } catch {
    return null
  }
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
    const results = Array.isArray(data?.result)
      ? (data.result as FinnhubSearchItem[])
      : []

    const exact = results.find(
      (item) => item.symbol?.toUpperCase() === query.toUpperCase()
    )

    return exact ?? results[0] ?? null
  } catch {
    return null
  }
}

async function getCompanyOverview(
  input: string
): Promise<{ symbol: string; overview: CompanyOverview } | null> {
  const cleaned = normalizeInput(input)
  if (!cleaned) {
    return null
  }

  const alias = resolveAlias(cleaned)
  let symbol = (alias ?? cleaned).toUpperCase()
  let cached = COMPANY_CATALOG[symbol]
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return cached ? { symbol, overview: cached } : null
  }

  let profile = await fetchProfile(symbol, apiKey)

  if (!profile?.name) {
    const searchMatch = await fetchFinnhubSearch(cleaned, apiKey)
    if (searchMatch?.symbol) {
      symbol = searchMatch.symbol.toUpperCase()
      cached = COMPANY_CATALOG[symbol]
      profile = await fetchProfile(symbol, apiKey)
    }
  }

  const resolvedName = profile?.name || cached?.name || null
  if (!resolvedName) {
    return cached ? { symbol, overview: cached } : null
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
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const requested = params.symbol as string
    const validateOnly = request.nextUrl.searchParams.get('validate') === '1'

    const resolved = await getCompanyOverview(requested)
    if (!resolved) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    const { symbol, overview } = resolved

    if (validateOnly) {
      return NextResponse.json({ symbol: overview.symbol, name: overview.name })
    }

    let marketData
    try {
      marketData = await getMarketData(symbol)
    } catch (error) {
      console.warn(`Using mock market data for ${symbol}`)
      marketData = getMockMarketData(symbol, overview.name)
    }

    const news = await getNews(overview.name, 15)

    let aiSummary = ''
    let easyExplanation = ''
    let risks: RiskFactor[] = []
    let opportunities: Opportunity[] = []
    let bullishFactors: string[] = []
    let bearishFactors: string[] = []

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

      bullishFactors = [
        marketData.price > marketData.low52Week * 1.2
          ? 'Trading well above 52-week low'
          : 'Building from support levels',
        marketData.peRatio && marketData.peRatio < 25
          ? 'Reasonable valuation metrics'
          : 'Competitive market positioning',
        marketData.volume > marketData.avgVolume * 0.8
          ? 'Strong trading volume'
          : 'Consistent market participation',
      ]

      bearishFactors = [
        marketData.changePercent < -5
          ? 'Recent price decline'
          : 'Market volatility concerns',
        marketData.peRatio && marketData.peRatio > 30
          ? 'Premium valuation'
          : 'Competitive pressures',
        news.some((n) => n.sentiment === 'negative')
          ? 'Negative sentiment in recent news'
          : 'Market concentration risks',
      ]
    } catch (error) {
      console.warn('Error generating AI content, using fallbacks:', error)
      aiSummary = `${overview.name} operates in the ${overview.sector} sector as a ${overview.industry} company. The company continues to play a significant role in its industry while navigating current market conditions.`
      easyExplanation = `${overview.name} is a company in the ${overview.industry} field. Their main focus is on providing innovative solutions and services to customers worldwide.`
      bullishFactors = ['Market position maintained', 'Industry participation', 'Operational continuity']
      bearishFactors = ['Market competition', 'Economic sensitivity', 'Sector dynamics']
      risks = [
        {
          title: 'Market Competition',
          description: 'Intense competition in the sector',
          severity: 'medium',
        },
      ]
      opportunities = [
        {
          title: 'Market Growth',
          description: 'Potential for expansion in emerging markets',
          potential: 'medium',
        },
      ]
    }

    const positiveSignals = [
      marketData.changePercent > 0,
      marketData.price > marketData.high52Week * 0.9,
      bullishFactors.length > bearishFactors.length,
    ].filter(Boolean).length

    const sentiment =
      positiveSignals >= 2 ? 'bullish' : positiveSignals === 1 ? 'neutral' : 'bearish'

    const brief: CompanyBrief = {
      symbol,
      name: overview.name,
      overview,
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
