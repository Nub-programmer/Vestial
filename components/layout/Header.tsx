"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="border-b border-border/40 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Vestial</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition">Search</Link>
            <Link href="/compare" className="text-sm text-muted-foreground hover:text-foreground transition">Compare</Link>
            <Link href="/watchlist" className="text-sm text-muted-foreground hover:text-foreground transition">Watchlist</Link>
            <div className="flex items-center gap-3 border-l border-border/40 pl-6">
              <Link href="/search">
                <Button variant="ghost" size="sm">Search</Button>
              </Link>
              <Link href="/about">
                <Button variant="default" size="sm">Get Started <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
