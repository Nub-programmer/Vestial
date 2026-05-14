import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 px-4 sm:px-6 lg:px-8 py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-400 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h3l3-8 4 16 4-10 3 6h4" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold">Vestial</div>
            <div className="text-xs text-muted-foreground">Actionable company intelligence, faster.</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </div>

        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Vestial. All rights reserved.</div>
      </div>
    </footer>
  )
}
