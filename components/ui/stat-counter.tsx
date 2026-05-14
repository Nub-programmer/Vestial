"use client"

import { useEffect, useState } from 'react'

export default function StatCounter({ value, suffix = '', className = '' }: { value: number; suffix?: string; className?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = performance.now()
    const duration = 700
    const from = display
    const to = value

    let raf = 0
    function step(ts: number) {
      const t = Math.min(1, (ts - start) / duration)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      const cur = Math.round(from + (to - from) * eased)
      setDisplay(cur)
      if (t < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span className={className}>{display.toLocaleString()}{suffix}</span>
}
