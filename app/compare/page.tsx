'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeftRight, Search } from 'lucide-react'
import type { CompanyBrief } from '@/lib/types'

export default function ComparePage() {
  const [company1Symbol, setCompany1Symbol] = useState('')
  const [company2Symbol, setCompany2Symbol] = useState('')
  const [company1, setCompany1] = useState<CompanyBrief | null>(null)
  const [company2, setCompany2] = useState<CompanyBrief | null>(null)
  const [isLoadingCompany1, setIsLoadingCompany1] = useState(false)
  const [isLoadingCompany2, setIsLoadingCompany2] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCompany = async (
    symbol: string,
    isFirstCompany: boolean
  ) => {
    if (!symbol.trim()) return

    const setLoading = isFirstCompany ? setIsLoadingCompany1 : setIsLoadingCompany2
    const setCompany = isFirstCompany ? setCompany1 : setCompany2
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/company/${symbol.toUpperCase()}`)
      if (!response.ok) throw new Error('Company not found')
      const data = await response.json()
      setCompany(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company')
    } finally {
      setLoading(false)
    }
  }

  const CompanyCard = ({
    brief,
    isLoading,
    symbol,
    onSearch,
  }: {
    brief: CompanyBrief | null
    isLoading: boolean
    symbol: string
    onSearch: (s: string) => void
  }) => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      )
    }

    if (!brief) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Search Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                placeholder="Enter company name or ticker"
                value={symbol}
                onChange={(e) => onSearch(e.target.value)}
              />
              <Button onClick={() => onSearch(symbol)} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{brief.name}</CardTitle>
          <CardDescription>{brief.symbol}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-3xl font-bold">${brief.marketData.price.toFixed(2)}</p>
            <Badge variant={brief.marketData.change > 0 ? 'success' : 'danger'}>
              {brief.marketData.change > 0 ? '+' : ''}{brief.marketData.changePercent.toFixed(2)}%
            </Badge>
          </div>

          {/* Key metrics */}
          <div className="space-y-3 border-t border-border/50 pt-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-semibold">{brief.marketData.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">52-Week Range</span>
              <span className="font-semibold">
                ${brief.marketData.low52Week.toFixed(2)} - ${brief.marketData.high52Week.toFixed(2)}
              </span>
            </div>
            {brief.marketData.peRatio && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">P/E Ratio</span>
                <span className="font-semibold">{brief.marketData.peRatio.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume</span>
              <span className="font-semibold">{(brief.marketData.volume / 1e6).toFixed(2)}M</span>
            </div>
          </div>

          {/* Sentiment */}
          <div className="space-y-2 border-t border-border/50 pt-6">
            <p className="text-sm text-muted-foreground">Sentiment</p>
            <Badge variant={brief.sentiment === 'bullish' ? 'success' : brief.sentiment === 'bearish' ? 'danger' : 'warning'}>
              {brief.sentiment.charAt(0).toUpperCase() + brief.sentiment.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Page heading */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold mb-2">Compare Companies</h1>
          <p className="text-muted-foreground">
            Search for two companies and compare their metrics side by side
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-600/10 border border-red-600/30 text-red-600">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Left company */}
          <div>
            <CompanyCard
              brief={company1}
              isLoading={isLoadingCompany1}
              symbol={company1Symbol}
              onSearch={(s) => {
                setCompany1Symbol(s)
                fetchCompany(s, true)
              }}
            />
          </div>

          {/* VS marker */}
          <div className="flex items-center justify-center">
            <div className="text-center space-y-2">
              <ArrowLeftRight className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-sm">vs</p>
            </div>
          </div>

          {/* Right company */}
          <div>
            <CompanyCard
              brief={company2}
              isLoading={isLoadingCompany2}
              symbol={company2Symbol}
              onSearch={(s) => {
                setCompany2Symbol(s)
                fetchCompany(s, false)
              }}
            />
          </div>
        </div>

        {/* Detailed comparison table */}
        {company1 && company2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Detailed Comparison</h2>

            {/* Market metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Market Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MetricRow
                    label="Current Price"
                    company1={`$${company1.marketData.price.toFixed(2)}`}
                    company2={`$${company2.marketData.price.toFixed(2)}`}
                  />
                  <MetricRow
                    label="24h Change"
                    company1={`${company1.marketData.changePercent.toFixed(2)}%`}
                    company2={`${company2.marketData.changePercent.toFixed(2)}%`}
                  />
                  <MetricRow
                    label="Market Cap"
                    company1={company1.marketData.marketCap}
                    company2={company2.marketData.marketCap}
                  />
                  <MetricRow
                    label="52-Week High"
                    company1={`$${company1.marketData.high52Week.toFixed(2)}`}
                    company2={`$${company2.marketData.high52Week.toFixed(2)}`}
                  />
                  <MetricRow
                    label="52-Week Low"
                    company1={`$${company1.marketData.low52Week.toFixed(2)}`}
                    company2={`$${company2.marketData.low52Week.toFixed(2)}`}
                  />
                  <MetricRow
                    label="Volume"
                    company1={`${(company1.marketData.volume / 1e6).toFixed(2)}M`}
                    company2={`${(company2.marketData.volume / 1e6).toFixed(2)}M`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Company profile fields */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MetricRow
                    label="Sector"
                    company1={company1.overview.sector}
                    company2={company2.overview.sector}
                  />
                  <MetricRow
                    label="Industry"
                    company1={company1.overview.industry}
                    company2={company2.overview.industry}
                  />
                  {company1.overview.founded && company2.overview.founded && (
                    <MetricRow
                      label="Founded"
                      company1={company1.overview.founded.toString()}
                      company2={company2.overview.founded.toString()}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{company1.name}</p>
                    <Badge variant={company1.sentiment === 'bullish' ? 'success' : company1.sentiment === 'bearish' ? 'danger' : 'warning'}>
                      {company1.sentiment.charAt(0).toUpperCase() + company1.sentiment.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{company2.name}</p>
                    <Badge variant={company2.sentiment === 'bullish' ? 'success' : company2.sentiment === 'bearish' ? 'danger' : 'warning'}>
                      {company2.sentiment.charAt(0).toUpperCase() + company2.sentiment.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricRow({
  label,
  company1,
  company2,
}: {
  label: string
  company1: string
  company2: string
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex gap-8">
        <span className="font-semibold text-right flex-1">{company1}</span>
        <span className="font-semibold text-right flex-1">{company2}</span>
      </div>
    </div>
  )
}
