import { NextRequest, NextResponse } from 'next/server'
import { COMPANY_CATALOG, resolveAlias } from '@/lib/company-catalog'

type SearchSuggestion = {
  symbol: string
  name: string
  source: 'live' | 'local'
}

function getLocalSuggestions(query: string): SearchSuggestion[] {
  const normalized = query.trim().toLowerCase()
  const localMatches = Object.values(COMPANY_CATALOG).filter((company) => {
    return (
      company.symbol.toLowerCase().includes(normalized) ||
      company.name.toLowerCase().includes(normalized)
    )
  })

  return localMatches.slice(0, 8).map((company) => ({
    symbol: company.symbol,
    name: company.name,
    source: 'local' as const,
  }))
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (query.length < 1) {
    return NextResponse.json({ suggestions: [] })
  }

  const alias = resolveAlias(query)
  const aliasSuggestion = alias
    ? [{ symbol: alias, name: COMPANY_CATALOG[alias]?.name ?? alias, source: 'local' as const }]
    : []

  const local = getLocalSuggestions(query)
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return NextResponse.json({ suggestions: dedupeSuggestions([...aliasSuggestion, ...local]).slice(0, 8) })
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`,
      { next: { revalidate: 120 } }
    )

    if (!response.ok) {
      return NextResponse.json({ suggestions: dedupeSuggestions([...aliasSuggestion, ...local]).slice(0, 8) })
    }

    const data = await response.json()
    const result = Array.isArray(data?.result) ? data.result : []

    const live: SearchSuggestion[] = result
      .filter((item) => typeof item?.symbol === 'string' && typeof item?.description === 'string')
      .map((item) => ({
        symbol: item.symbol,
        name: item.description,
        source: 'live' as const,
      }))
      .filter((item) => item.symbol.length > 0)
      .slice(0, 8)

    return NextResponse.json({
      suggestions: dedupeSuggestions([...aliasSuggestion, ...live, ...local]).slice(0, 8),
    })
  } catch {
    return NextResponse.json({ suggestions: dedupeSuggestions([...aliasSuggestion, ...local]).slice(0, 8) })
  }
}

function dedupeSuggestions(input: SearchSuggestion[]): SearchSuggestion[] {
  const seen = new Set<string>()
  const deduped: SearchSuggestion[] = []

  for (const suggestion of input) {
    const key = suggestion.symbol.toUpperCase()
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push({ ...suggestion, symbol: key })
    }
  }

  return deduped
}
