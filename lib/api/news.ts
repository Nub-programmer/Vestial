import { NewsArticle } from '@/lib/types'

export async function getNews(
  company: string,
  limit: number = 10
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) {
    console.warn('NEWSAPI_KEY is not configured')
    return getMockNews(company, limit)
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        company
      )}&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${apiKey}`,
      { next: { revalidate: 600 } } // Revalidate every 10 min.
    )

    if (!response.ok) {
      console.error('NewsAPI error:', response.statusText)
      return getMockNews(company, limit)
    }

    const data = await response.json()
    const articles = data.articles || []

    return articles.map((article: any, index: number) => ({
      id: `${article.url}-${index}`,
      title: article.title,
      description: article.description || '',
      url: article.url,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt),
      image: article.urlToImage,
      sentiment: getSentiment(article.title + ' ' + (article.description || '')),
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return getMockNews(company, limit)
  }
}

function getSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = [
    'surge',
    'gain',
    'bull',
    'rally',
    'growth',
    'strong',
    'beat',
    'profit',
  ]
  const negativeWords = [
    'fall',
    'decline',
    'bear',
    'loss',
    'weak',
    'miss',
    'risk',
    'concern',
  ]

  const lower = text.toLowerCase()
  const posCount = positiveWords.filter((word) => lower.includes(word)).length
  const negCount = negativeWords.filter((word) => lower.includes(word)).length

  if (posCount > negCount) return 'positive'
  if (negCount > posCount) return 'negative'
  return 'neutral'
}

export function getMockNews(company: string, limit: number = 10): NewsArticle[] {
  const headlines = [
    `${company} reports strong quarterly earnings`,
    `${company} announces new strategic partnership`,
    `Market analysis: ${company} stock outlook`,
    `${company} expands operations to new market`,
    `Analysts maintain bullish rating on ${company}`,
    `${company} faces regulatory challenges`,
    `${company} launches innovative product`,
    `Insider activity highlights at ${company}`,
    `${company} dividend increase signals confidence`,
    `Tech sector rally benefits ${company}`,
  ]

  return Array.from({ length: Math.min(limit, headlines.length) }).map(
    (_, i) => ({
      id: `mock-${i}`,
      title: headlines[i],
      description: `Latest updates and analysis on ${company}`,
      url: '#',
      source: 'Market News',
      publishedAt: new Date(Date.now() - i * 3600000),
      sentiment: ['positive', 'neutral', 'negative'][i % 3] as any,
    })
  )
}
