'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, TrendingUp, Clock, ArrowUpRight, CircleAlert } from 'lucide-react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

const POPULAR_COMPANIES = [
  { name: 'Apple', symbol: 'AAPL', sector: 'Technology' },
  { name: 'Microsoft', symbol: 'MSFT', sector: 'Technology' },
  { name: 'Tesla', symbol: 'TSLA', sector: 'Automotive' },
  { name: 'Google', symbol: 'GOOGL', sector: 'Technology' },
  { name: 'Amazon', symbol: 'AMZN', sector: 'E-commerce' },
  { name: 'Meta', symbol: 'META', sector: 'Technology' },
]

type SearchSuggestion = {
  symbol: string
  name: string
  source: 'live' | 'local'
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('vestial-recent-searches', ['NVDA', 'TSLA', 'MSFT'])

  const trimmedQuery = useMemo(() => query.trim(), [query])

  const handleSearch = useCallback(
    async (searchQuery: string, preferredSymbol?: string) => {
      if (!searchQuery.trim()) return

      setIsLoading(true)
      setFormError(null)

      try {
        const tickerLike = /^[A-Za-z.\-]{1,10}$/.test(searchQuery.trim())
        const firstSuggestion = suggestions[0]?.symbol
        const target = (preferredSymbol ?? firstSuggestion ?? (tickerLike ? searchQuery.trim().toUpperCase() : '')).toUpperCase()

        if (!target) {
          setFormError('No matching company found. Try a ticker like NVDA or AAPL.')
          return
        }

        const validationResponse = await fetch(`/api/company/${encodeURIComponent(target)}?validate=1`, {
          cache: 'no-store',
        })

        if (!validationResponse.ok) {
          setFormError('That symbol could not be found. Try a different company or ticker.')
          return
        }

        setRecentSearches((prev) => {
          const next = [target, ...prev.filter((item) => item !== target)]
          return next.slice(0, 8)
        })

        router.push(`/company/${encodeURIComponent(target)}`)
      } catch (error) {
        setFormError('Search is temporarily unavailable. Please try again in a moment.')
      } finally {
        setIsLoading(false)
      }
    },
    [router, setRecentSearches, suggestions]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setSuggestions([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsSearchingSuggestions(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          cache: 'no-store',
        })
        const data = await response.json()
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : [])
      } catch {
        setSuggestions([])
      } finally {
        setIsSearchingSuggestions(false)
      }
    }, 260)

    return () => clearTimeout(timeout)
  }, [trimmedQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Top heading */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-2">Search Companies</h1>
          <p className="text-muted-foreground">
            Enter a company name or ticker symbol to get started
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by company name or ticker (e.g., AAPL, Tesla)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setFormError(null)
              }}
              className="pl-12 h-12 text-base"
            />
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {isLoading ? 'Loading...' : 'Search'}
            </Button>
          </div>

          <AnimatePresence>
            {(isSearchingSuggestions || suggestions.length > 0 || formError) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="mt-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3"
              >
                {isSearchingSuggestions ? (
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-1">
                    {suggestions.map((item) => (
                      <button
                        key={`${item.symbol}-${item.name}`}
                        type="button"
                        onClick={() => handleSearch(item.symbol, item.symbol)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-background/70 transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.symbol}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.source === 'live' ? 'success' : 'secondary'}>
                            {item.source}
                          </Badge>
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {formError && (
                  <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 flex items-start gap-2">
                    <CircleAlert className="w-4 h-4 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Popular companies */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Trending Companies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {POPULAR_COMPANIES.map((company) => (
              <button
                key={company.symbol}
                onClick={() => handleSearch(company.symbol)}
                className="text-left p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card transition group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold group-hover:text-primary transition">
                      {company.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{company.symbol}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {company.sector}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Recent Searches</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSearch(symbol)}
                  className="px-4 py-2 rounded-full border border-border/50 text-sm hover:bg-card transition"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
