import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Zap, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Top nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Vestial</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm hover:text-primary transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm hover:text-primary transition">
                How It Works
              </Link>
              <Link href="/about" className="text-sm hover:text-primary transition">
                About
              </Link>
              <div className="flex items-center gap-3 border-l border-border/50 pl-8">
                <Link href="/search">
                  <Button variant="ghost" size="sm">
                    Search
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="ghost" size="sm">
                    Compare
                  </Button>
                </Link>
                <Link href="/watchlist">
                  <Button variant="ghost" size="sm">
                    Watchlist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Understand Any Company
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 block">
                in Minutes
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered company intelligence with market data, recent news, risks, opportunities,
              and beginner-friendly insights. Search by name or ticker and get answers instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/search">
                <Button size="lg" className="gap-2">
                  Start Exploring <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 bg-card/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Market Data',
                description: 'Real-time prices, 52-week highs/lows, market cap, and key metrics',
              },
              {
                icon: Zap,
                title: 'AI Intelligence',
                description: 'Smart summaries and beginner-friendly explanations of complex companies',
              },
              {
                icon: TrendingUp,
                title: 'News & Sentiment',
                description: 'Latest news with sentiment analysis to understand market mood',
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="p-6 rounded-lg border border-border/50 bg-background hover:bg-card transition"
                >
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-4xl text-center space-y-8 bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-primary/20">
          <h2 className="text-3xl font-bold">Ready to Explore?</h2>
          <p className="text-lg text-muted-foreground">
            Search for any company and get instant insights backed by real data and AI.
          </p>
          <Link href="/search">
            <Button size="lg">
              Start Searching
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-muted-foreground">
        <p>© 2024 Vestial. Built with Next.js, AI, and data. Powered by Groq, NewsAPI, and Finnhub.</p>
      </footer>
    </div>
  )
}
