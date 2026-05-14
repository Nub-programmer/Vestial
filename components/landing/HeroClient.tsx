"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SentimentChip from '@/components/ui/sentiment-chip'
import StatCounter from '@/components/ui/stat-counter'

export default function HeroClient() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-6">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
        Instant company intelligence —
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-amber-400">actionable, source-backed, and easy to share</span>
      </h1>

      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        Save time with clear summaries, live market context, and risk signals — all in a polished, readable view designed for fast decisions.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link href="/search">
          <Button size="lg" className="gap-2 glow-accent">
            Try a Company <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="/about">
          <Button size="lg" variant="outline">See Demo</Button>
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="text-center">
          <div className="text-2xl font-semibold"><StatCounter value={120_542} /></div>
          <div className="text-xs">Companies explored</div>
        </div>
        <div className="flex items-center gap-3">
          <SentimentChip sentiment="bullish">Market mood: Bullish</SentimentChip>
        </div>
      </div>
    </motion.div>
  )
}
