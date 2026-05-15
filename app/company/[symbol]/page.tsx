'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SentimentChip from '@/components/ui/sentiment-chip'
import { TrendingUp, TrendingDown, BookOpen, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react'
import type { CompanyBrief } from '@/lib/types'

export default function CompanyBriefPage() {
  const params = useParams()
  const symbol = ((params?.symbol as string) || '').toUpperCase()
  const [brief, setBrief] = useState<CompanyBrief | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  const fetchCompanyBrief = async (forceRefresh: boolean = false) => {
    if (!symbol) return

    if (forceRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const suffix = forceRefresh ? `?refresh=${Date.now()}` : ''
      const response = await fetch(`/api/company/${symbol}${suffix}`, {
        cache: forceRefresh ? 'no-store' : 'default',
      })
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Company was not found. Try a ticker like NVDA, AAPL, or MSFT.')
        }
        throw new Error(`Failed to fetch company data: ${response.statusText}`)
      }
      const data = await response.json()
      setBrief(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company data')
    } finally {
      if (forceRefresh) {
        setIsRefreshing(false)
      } else {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchCompanyBrief()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-32 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error || !brief) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center">
        <Card className="max-w-md card-glass">
          <CardHeader>
            <CardTitle>Unable To Load Company</CardTitle>
            <CardDescription>{error || 'Company not found'}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={() => window.history.back()} variant="outline">Go Back</Button>
            <Button onClick={() => fetchCompanyBrief(true)}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const priceChangeColor = brief.marketData.change > 0 ? 'text-emerald-400' : 'text-rose-400'
  const changeArrow = brief.marketData.change > 0 ? <TrendingUp /> : <TrendingDown />
  const lastUpdated = new Date(brief.lastUpdated)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Sticky top summary */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{brief.name}</h1>
              <p className="text-muted-foreground">{brief.symbol} • Updated {lastUpdated.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Live market and news feeds are used when available. Fallback data is applied only on provider errors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => fetchCompanyBrief(true)}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant={isWatchlisted ? 'default' : 'outline'}
                onClick={() => setIsWatchlisted(!isWatchlisted)}
              >
                {isWatchlisted ? '★ Watchlist' : '☆ Add to Watchlist'}
              </Button>
            </div>
          </div>

          {/* Quick market snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card className="bg-card/50 card-glass ambient-neon">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Current Price</p>
                <p className="text-3xl font-bold">${brief.marketData.price.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 card-glass">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">24h Change</p>
                <p className={`text-2xl font-bold flex items-center gap-1 ${priceChangeColor}`}>
                  {changeArrow}
                  {brief.marketData.change.toFixed(2)} ({brief.marketData.changePercent.toFixed(2)}%)
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 card-glass">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Market Cap</p>
                <p className="text-2xl font-bold">{brief.marketData.marketCap}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 card-glass">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Sentiment</p>
                <SentimentChip sentiment={brief.sentiment}>
                  {brief.sentiment.charAt(0).toUpperCase() + brief.sentiment.slice(1)}
                </SentimentChip>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main tabs */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="explained">Explained</TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* AI summary */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Company Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>{brief.aiSummary}</p>
              </CardContent>
            </Card>

            {/* Core metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>Market Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">52-Week High</span>
                    <span className="font-semibold">${brief.marketData.high52Week.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">52-Week Low</span>
                    <span className="font-semibold">${brief.marketData.low52Week.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="font-semibold">{(brief.marketData.volume / 1e6).toFixed(2)}M</span>
                  </div>
                  {brief.marketData.peRatio && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">P/E Ratio</span>
                      <span className="font-semibold">{brief.marketData.peRatio.toFixed(2)}</span>
                    </div>
                  )}
                  {brief.marketData.dividendYield && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Dividend Yield</span>
                      <span className="font-semibold">{(brief.marketData.dividendYield * 100).toFixed(2)}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>Company Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sector</p>
                    <p className="font-semibold">{brief.overview.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-semibold">{brief.overview.industry}</p>
                  </div>
                  {brief.overview.founded && (
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-semibold">{brief.overview.founded}</p>
                    </div>
                  )}
                  {brief.overview.website && (
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a href={brief.overview.website} className="font-semibold text-primary hover:underline">
                        Visit
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Bullish vs bearish factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-emerald-500/30 bg-emerald-500/5 card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-300">
                    <TrendingUp className="w-5 h-5" />
                    Bullish Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {brief.bullishFactors.map((factor, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-emerald-300 mt-0.5">✓</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-rose-500/30 bg-rose-500/5 card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-300">
                    <TrendingDown className="w-5 h-5" />
                    Bearish Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {brief.bearishFactors.map((factor, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-rose-300 mt-0.5">✗</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risks */}
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brief.risks.map((risk, i) => (
                    <div key={i} className="p-3 rounded-lg bg-rose-600/10 border border-rose-600/30">
                      <p className="font-semibold text-sm">{risk.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                      <Badge variant="danger" className="mt-2 text-xs">
                        {risk.severity}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Opportunities */}
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brief.opportunities.map((opp, i) => (
                    <div key={i} className="p-3 rounded-lg bg-emerald-600/10 border border-emerald-600/30">
                      <p className="font-semibold text-sm">{opp.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{opp.description}</p>
                      <Badge variant="success" className="mt-2 text-xs">
                        {opp.potential}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News tab */}
          <TabsContent value="news" className="space-y-4">
            {brief.news.map((article) => (
              <Card key={article.id} className="hover:bg-card/80 transition card-glass">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {article.image && (
                      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={article.image}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                        <h3 className="font-semibold">{article.title}</h3>
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                        {article.sentiment && (
                          <Badge variant={article.sentiment === 'positive' ? 'success' : article.sentiment === 'negative' ? 'danger' : 'warning'}>
                            {article.sentiment}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Explain-like-15 tab */}
          <TabsContent value="explained">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Explain Like I&apos;m 15</CardTitle>
                <CardDescription>A beginner-friendly explanation of this company</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>{brief.easyExplanation}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
