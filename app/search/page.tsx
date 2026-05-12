'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Clock } from 'lucide-react'

const POPULAR_COMPANIES = [
  { name: 'Apple', symbol: 'AAPL', sector: 'Technology' },
  { name: 'Microsoft', symbol: 'MSFT', sector: 'Technology' },
  { name: 'Tesla', symbol: 'TSLA', sector: 'Automotive' },
  { name: 'Google', symbol: 'GOOGL', sector: 'Technology' },
  { name: 'Amazon', symbol: 'AMZN', sector: 'E-commerce' },
  { name: 'Meta', symbol: 'META', sector: 'Technology' },
]

const RECENT_SEARCHES = ['NVDA', 'TSLA', 'MSFT', 'AAPL'] // Would come from localStorage

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return

      setIsLoading(true)
      try {
        // Navigate to company brief page
        router.push(`/company/${searchQuery.toUpperCase()}`)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-2">Search Companies</h1>
          <p className="text-muted-foreground">
            Enter a company name or ticker symbol to get started
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by company name or ticker (e.g., AAPL, Tesla)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
        </form>

        {/* Popular Companies */}
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

        {/* Recent Searches */}
        {RECENT_SEARCHES.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Recent Searches</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {RECENT_SEARCHES.map((symbol) => (
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
