"use client"

import clsx from 'clsx'

export default function SentimentChip({
  sentiment,
  children,
}: {
  sentiment: 'bullish' | 'bearish' | 'neutral'
  children?: React.ReactNode
}) {
  const classes = clsx(
    'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm',
    sentiment === 'bullish' && 'bg-emerald-600/10 text-emerald-300 ring-1 ring-emerald-400/10',
    sentiment === 'bearish' && 'bg-rose-600/8 text-rose-300 ring-1 ring-rose-400/8',
    sentiment === 'neutral' && 'bg-slate-700/20 text-slate-200 ring-1 ring-slate-500/8'
  )

  return <span className={classes}>{children ?? sentiment}</span>
}
