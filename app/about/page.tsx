import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Zap, Globe } from 'lucide-react'

export const metadata = {
  title: 'About Vestial',
  description: 'Learn about Vestial and how we provide AI-powered company intelligence',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Back nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="font-bold text-xl hover:text-primary transition">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">About Vestial</h1>
          <p className="text-xl text-muted-foreground">
            Making company research instant, actionable, and accessible to everyone
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 prose prose-invert max-w-none">
            <p>
              Vestial exists to democratize company intelligence. Whether you're a student learning about
              finance, an investor researching opportunities, or someone curious about companies, our platform
              removes barriers to understanding.
            </p>
            <p>
              Instead of spending hours reading financial documents or news articles, Vestial delivers clean,
              source-backed insights in minutes. We combine real-time market data, current news, and AI analysis
              to create the clearest possible picture of any company.
            </p>
          </CardContent>
        </Card>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Search',
                description: 'Enter a company name or ticker symbol',
                icon: Zap,
              },
              {
                title: 'Analyze',
                description: 'We fetch real-time market data and recent news',
                icon: Globe,
              },
              {
                title: 'Understand',
                description: 'AI generates summaries and beginner-friendly explanations',
                icon: CheckCircle,
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <Card key={i}>
                  <CardHeader>
                    <Icon className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Data sources */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Data Sources</CardTitle>
            <CardDescription>We believe in transparency. All our data comes from trusted sources.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Market Data</h3>
                <p className="text-muted-foreground">
                  Real-time stock prices, market cap, P/E ratios, and financial metrics from Finnhub
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">News & Headlines</h3>
                <p className="text-muted-foreground">
                  Latest news articles from thousands of sources worldwide via NewsAPI
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Smart summaries and beginner explanations powered by Groq's AI models
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Market Sentiment</h3>
                <p className="text-muted-foreground">
                  Sentiment analysis on news articles to show market mood and investor perception
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="space-y-4">
            {[
              'Live market data with 52-week highs/lows and key metrics',
              'Recent news feed with sentiment analysis',
              'AI-generated company summaries backed by latest information',
              'Risk analysis identifying potential concerns',
              'Opportunity identification for informed decisions',
              '"Explain Like I\'m 15" mode for beginners',
              'Compare two companies side-by-side',
              'Personal watchlist to track favorite companies',
              'Mobile-responsive design for research on the go',
              'Fast, beautiful interface built for modern browsers',
            ].map((feature, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border border-border/50">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Built With Modern Tech</CardTitle>
            <CardDescription>Vestial is built on a foundation of industry-leading tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Frontend</h3>
                <p className="text-sm text-muted-foreground">
                  Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion for beautiful, fast interfaces
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Backend</h3>
                <p className="text-sm text-muted-foreground">
                  Next.js API Routes, Prisma for database management, and caching strategies for performance
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Database</h3>
                <p className="text-sm text-muted-foreground">
                  Neon PostgreSQL for reliable, scalable data persistence
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Deployment</h3>
                <p className="text-sm text-muted-foreground">
                  Vercel for edge functions, SSR, and optimal performance worldwide
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-primary/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-muted-foreground mb-6">
            Start searching for companies and get instant AI-powered insights
          </p>
          <Link href="/search">
            <Button size="lg">Start Searching</Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-muted-foreground mt-16">
        <p>© 2024 Vestial. A portfolio project by a passionate developer.</p>
        <p className="mt-2">
          Data powered by Finnhub, NewsAPI, and Groq. Deployed on Vercel.
        </p>
      </footer>
    </div>
  )
}
