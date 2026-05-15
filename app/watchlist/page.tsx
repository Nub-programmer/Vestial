'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { TrendingUp, TrendingDown, Plus, Trash2, ArrowRight, RefreshCw } from 'lucide-react'
import type { WatchlistItem } from '@/lib/types'

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'TSLA']

export default function WatchlistPage() {
  const [savedSymbols, setSavedSymbols] = useLocalStorage<string[]>('vestial-watchlist-symbols', DEFAULT_SYMBOLS)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [totalGain, setTotalGain] = useState(0)

  const hydrateWatchlist = async (forceRefresh: boolean = false) => {
    if (savedSymbols.length === 0) {
      setWatchlist([])
      setIsLoading(false)
      setLastUpdated(new Date())
      return
    }

    if (forceRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    try {
      const responses = await Promise.all(
        savedSymbols.map(async (symbol) => {
          const suffix = forceRefresh ? `?refresh=${Date.now()}` : ''
          const response = await fetch(`/api/company/${symbol}${suffix}`, {
            cache: forceRefresh ? 'no-store' : 'default',
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          const item: WatchlistItem = {
            symbol: data.symbol,
            name: data.name,
            currentPrice: data.marketData.price,
            change: data.marketData.change,
            changePercent: data.marketData.changePercent,
            addedAt: new Date(),
          }

          return item
        })
      )

      const nextWatchlist = responses.filter((item): item is WatchlistItem => item !== null)
      setWatchlist(nextWatchlist)
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    hydrateWatchlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSymbols])

  useEffect(() => {
    // Quick aggregate so the summary cards stay in sync.
    const totalChange = watchlist.reduce((sum, item) => sum + item.change * item.currentPrice, 0)
    const totalValue = watchlist.reduce((sum, item) => sum + item.currentPrice, 0)
    const totalPercent = totalValue > 0 ? (totalChange / totalValue) * 100 : 0
    setTotalGain(totalPercent)
  }, [watchlist])

  const removeFromWatchlist = (symbol: string) => {
    setSavedSymbols((prev) => prev.filter((item) => item !== symbol))
  }

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Watchlist</h1>
              <p className="text-muted-foreground">
                Track your companies with live pricing {lastUpdated ? `• Updated ${lastUpdated.toLocaleTimeString()}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => hydrateWatchlist(true)} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/search">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary cards */}
          {watchlist.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Companies</p>
                  <p className="text-2xl font-bold">{watchlist.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Portfolio Value</p>
                  <p className="text-2xl font-bold">
                    ${watchlist
                      .reduce((sum, item) => sum + item.currentPrice, 0)
                      .toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Change</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${totalGain > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalGain > 0 ? '+' : ''}{totalGain.toFixed(2)}%
                    </p>
                    {totalGain > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && watchlist.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-lg text-muted-foreground mb-6">Your watchlist is empty</p>
              <Link href="/search">
                <Button size="lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Search for Companies
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : !isLoading ? (
          <div className="grid gap-4">
            {sortedWatchlist.map((item) => {
              const isPositive = item.change > 0
              return (
                <Card key={item.symbol} className="hover:bg-card/80 transition">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Link href={`/company/${item.symbol}`} className="hover:text-primary transition">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.symbol}</p>
                        </Link>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-2xl font-bold">${item.currentPrice.toFixed(2)}</p>
                          <p
                            className={`text-sm font-medium flex items-center justify-end gap-1 ${
                              isPositive ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {isPositive ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                          </p>
                        </div>

                        <div className="text-right text-sm text-muted-foreground">
                          <p>Added {getRelativeDate(item.addedAt)}</p>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/company/${item.symbol}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWatchlist(item.symbol)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function getRelativeDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}
