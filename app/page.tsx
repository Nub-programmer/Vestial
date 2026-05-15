import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TrendingUp, Zap, BarChart3 } from 'lucide-react'
import HeroClient from '@/components/landing/HeroClient'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="mx-auto max-w-7xl">
          <HeroClient />
        </div>
      </section>

      {/* Feature highlights */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 bg-card/40">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4">Built For Fast, Confident Decisions</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            One workflow for market context, current headlines, risks, and opportunity signals.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Market Data',
                description: 'Real-time prices, 52-week highs/lows, market cap, and key metrics',
              },
              {
                icon: Zap,
                title: 'Clear Explanations',
                description: 'Readable summaries that simplify complex company updates and why they matter',
              },
              {
                icon: TrendingUp,
                title: 'Signal Over Noise',
                description: 'Current news with sentiment cues so you can scan bullish and bearish pressure quickly',
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-border/50 bg-background/80 card-glass hover:border-cyan-400/30 transition"
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
        <div className="mx-auto max-w-4xl text-center space-y-8 bg-gradient-to-r from-cyan-500/10 to-amber-400/10 p-12 rounded-xl border border-cyan-300/20 card-glass">
          <h2 className="text-3xl font-bold">Start With A Ticker. Leave With Clarity.</h2>
          <p className="text-lg text-muted-foreground">
            Research faster with live market context, source-backed headlines, and concise briefings.
          </p>
          <Link href="/search">
            <Button size="lg" className="glow-accent">
              Start Searching
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
