'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'

type ServiceHealth = {
  status: 'ok' | 'missing' | 'error'
  message?: string
  latencyMs?: number
}

type HealthResponse = {
  timestamp: string
  services: Record<string, ServiceHealth>
}

const STATUS_VARIANT: Record<ServiceHealth['status'], 'success' | 'warning' | 'danger'> = {
  ok: 'success',
  missing: 'warning',
  error: 'danger',
}

export default function ApiHealthPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchHealth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/health', { cache: 'no-store' })
      const data = (await response.json()) as HealthResponse
      setHealth(data)
    } catch {
      setHealth(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">API Health</h1>
            <p className="text-muted-foreground">Live connectivity checks for external services.</p>
          </div>
          <Button variant="outline" onClick={fetchHealth} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>
              {health ? `Last checked ${new Date(health.timestamp).toLocaleString()}` : 'No data yet'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && <p className="text-sm text-muted-foreground">Checking services...</p>}

            {!isLoading && !health && (
              <p className="text-sm text-rose-300">Health check failed. Try refresh.</p>
            )}

            {!isLoading && health && (
              <div className="grid gap-3">
                {Object.entries(health.services).map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3">
                    <div>
                      <p className="font-medium capitalize">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {status.message ?? 'OK'}
                        {status.latencyMs !== undefined ? ` • ${status.latencyMs}ms` : ''}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[status.status]}>{status.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
