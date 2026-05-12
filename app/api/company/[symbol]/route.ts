import { NextRequest, NextResponse } from 'next/server'
import { getMarketData, getMockMarketData } from '@/lib/api/market'
import { getNews, getMockNews } from '@/lib/api/news'
import {
  generateCompanyBrief,
  generateEasyExplanation,
  generateRisksAndOpportunities,
} from '@/lib/api/ai'
import type { CompanyBrief, CompanyOverview } from '@/lib/types'

// Mock company data
const MOCK_COMPANIES: Record<string, CompanyOverview> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Apple designs, manufactures, and markets smartphones, computers, wearables, and software.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    website: 'https://www.apple.com',
    ceo: 'Tim Cook',
    founded: 1976,
    employees: 161000,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    description: 'Microsoft develops and sells software, computing devices, and cloud services.',
    sector: 'Technology',
    industry: 'Software',
    website: 'https://www.microsoft.com',
    ceo: 'Satya Nadella',
    founded: 1975,
    employees: 224116,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    description: 'Tesla designs and manufactures electric vehicles and energy storage solutions.',
    sector: 'Automotive',
    industry: 'Electric Vehicles',
    website: 'https://www.tesla.com',
    ceo: 'Elon Musk',
    founded: 2003,
    employees: 128000,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    description: 'Alphabet operates Google search engine, YouTube, and other internet services.',
    sector: 'Technology',
    industry: 'Internet Services',
    website: 'https://www.google.com',
    ceo: 'Sundar Pichai',
    founded: 1998,
    employees: 190234,
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = (params.symbol as string).toUpperCase()

    // Get company overview
    const overview = MOCK_COMPANIES[symbol]
    if (!overview) {
      // Try to fetch from API if not in mock data
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Fetch market data
    let marketData
    try {
      marketData = await getMarketData(symbol)
    } catch (error) {
      console.warn(`Using mock market data for ${symbol}`)
      marketData = getMockMarketData(symbol, overview.name)
    }

    // Fetch news
    const news = await getNews(overview.name, 15)

    // Generate AI content
    let aiSummary = ''
    let easyExplanation = ''
    let risks = []
    let opportunities = []
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

      // Generate factors based on market data
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

    // Determine sentiment
    const positiveFactor = [
      marketData.changePercent > 0,
      marketData.price > marketData.high52Week * 0.9,
      bullishFactors.length > bearishFactors.length,
    ].filter(Boolean).length

    const sentiment = positiveFactor >= 2 ? 'bullish' : positiveFactor === 1 ? 'neutral' : 'bearish'

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
