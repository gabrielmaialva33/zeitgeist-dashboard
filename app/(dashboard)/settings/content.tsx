'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWsStatus } from '@/hooks/use-zeitgeist-ws'
import { useQuery } from '@tanstack/react-query'
import { fetchApi, getApiUrl, getWsUrl } from '@/lib/api'
import type { HealthStatus } from '@/lib/types'
import { CheckCircle, XCircle, Server, Wifi, Zap } from 'lucide-react'

export function SettingsContent() {
  const { connected, eventsPerMinute } = useWsStatus()
  const {
    data: health,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['health'],
    queryFn: () => fetchApi<HealthStatus>('/api/health'),
    refetchInterval: 30_000,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration and health monitoring</p>
      </div>

      <Tabs defaultValue="connection">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          {/* API Connection */}
          <Card>
            <CardHeader>
              <CardTitle>Zeitgeist API</CardTitle>
              <CardDescription>Backend connection status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">API URL</label>
                  <Input value={getApiUrl()} readOnly className="font-mono text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">WebSocket URL</label>
                  <Input value={getWsUrl()} readOnly className="font-mono text-sm" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <Server size={14} />
                  <span className="text-sm">API:</span>
                  {health ? (
                    <Badge variant="success" appearance="light" size="xs">
                      <CheckCircle size={10} className="mr-1" /> {health.status}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" appearance="light" size="xs">
                      <XCircle size={10} className="mr-1" /> {isError ? 'Unreachable' : 'Checking...'}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <Wifi size={14} />
                  <span className="text-sm">WebSocket:</span>
                  <Badge variant={connected ? 'success' : 'destructive'} appearance="light" size="xs">
                    {connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <Zap size={14} />
                  <span className="text-sm">Throughput:</span>
                  <span className="font-mono text-sm">{eventsPerMinute} events/min</span>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Test Connection
              </Button>
            </CardContent>
          </Card>

          {/* Environment */}
          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
              <CardDescription>Set via environment variables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-secondary p-4 font-mono text-xs">
                <p># .env.local</p>
                <p>NEXT_PUBLIC_ZEITGEIST_API={getApiUrl()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border py-2">
                  <span className="text-muted-foreground">Dashboard</span>
                  <span className="font-mono">Zeitgeist Dashboard v1.0.0</span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="text-muted-foreground">Backend</span>
                  <span className="font-mono">
                    {health ? `Zeitgeist ${health.version} (${health.status})` : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="text-muted-foreground">Framework</span>
                  <span className="font-mono">Next.js 16 + React 19</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">UI Kit</span>
                  <span className="font-mono">Metronic v9.4.6 + Tailwind 4</span>
                </div>
                {health && (
                  <div className="flex justify-between border-t border-border py-2">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-mono">{Math.floor(health.uptime_seconds / 3600)}h {Math.floor((health.uptime_seconds % 3600) / 60)}m</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
