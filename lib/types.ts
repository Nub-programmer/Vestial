export interface MarketData {
  price: number
  change: number
  changePercent: number
  high52Week: number
  low52Week: number
  marketCap: string
  peRatio: number | null
  dividendYield: number | null
  volume: number
  avgVolume: number
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: Date
  image?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
}

export interface CompanyOverview {
  symbol: string
  name: string
  description: string
  sector: string
  industry: string
  website: string
  ceo?: string
  founded?: number
  employees?: number
}

export interface RiskFactor {
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
}

export interface Opportunity {
  title: string
  description: string
  potential: 'high' | 'medium' | 'low'
}

export interface CompanyBrief {
  id?: string
  symbol: string
  name: string
  overview: CompanyOverview
  marketData: MarketData
  sentiment: 'bullish' | 'neutral' | 'bearish'
  bullishFactors: string[]
  bearishFactors: string[]
  risks: RiskFactor[]
  opportunities: Opportunity[]
  aiSummary: string
  easyExplanation: string
  news: NewsArticle[]
  lastUpdated: Date
}

export interface ComparisonData {
  company1: CompanyBrief
  company2: CompanyBrief
  metrics: ComparisonMetric[]
}

export interface ComparisonMetric {
  name: string
  company1Value: string | number
  company2Value: string | number
  category: 'market' | 'performance' | 'valuation'
}

export interface WatchlistItem {
  id?: string
  symbol: string
  name: string
  currentPrice: number
  change: number
  changePercent: number
  addedAt: Date
  userId?: string
}
