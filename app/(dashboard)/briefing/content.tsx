'use client'

import { Activity, BookOpen, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/zeitgeist/stat-card'
import { AlertCard } from '@/components/zeitgeist/alert-card'
import { RiskGauge } from '@/components/zeitgeist/risk-gauge'
import { WorldMiniCard } from '@/components/zeitgeist/world-mini-card'
import { useEvents } from '@/hooks/use-events'
import { useWorlds } from '@/hooks/use-worlds'
import { usePredictions } from '@/hooks/use-predictions'
import { useWsStatus } from '@/hooks/use-zeitgeist-ws'

export function BriefingContent() {
  const { data: events, isLoading: eventsLoading } = useEvents()
  const { data: worlds } = useWorlds()
  const { data: predictions } = usePredictions()
  const { eventsPerMinute } = useWsStatus()

  if (eventsLoading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  const totalEvents = events?.total ?? events?.events?.length ?? 0
  const allWorlds = worlds?.worlds ?? []
  const simWorlds = allWorlds.filter((w) => !w.is_baseline)
  const allScenarios = predictions?.scenarios ?? []
  // Use probability > 0.5 as "active" proxy, risk_delta > 0 as "positive" proxy
  const highProbScenarios = allScenarios.filter((s) => s.probability > 0.5)
  const positiveDeltaScenarios = allScenarios.filter((s) => s.risk_delta > 0)

  // Rough global risk: average severity of recent events, or 42 if no events
  const avgSeverity =
    events?.events && events.events.length > 0
      ? Math.round(events.events.slice(0, 20).reduce((acc, e) => acc + e.severity, 0) / Math.min(events.events.length, 20))
      : 42

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Situation Briefing</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' — '}
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          })}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Events Ingested"
          value={totalEvents}
          subtitle={`${eventsPerMinute}/min`}
          icon={Activity}
        />
        <StatCard
          title="Scenarios"
          value={allScenarios.length}
          subtitle={`${highProbScenarios.length} high probability`}
          icon={BookOpen}
          color="elevated"
        />
        <StatCard
          title="Risk-Increasing"
          value={positiveDeltaScenarios.length}
          subtitle="positive risk delta"
          icon={TrendingUp}
          color="critical"
          trend="up"
        />
        <StatCard
          title="Simulated Worlds"
          value={simWorlds.length}
          subtitle={`${allWorlds.length} total`}
          icon={TrendingDown}
          color="normal"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Risk Gauge */}
        <Card>
          <CardHeader>
            <CardTitle>Global Risk</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <RiskGauge score={avgSeverity} />
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Critical &amp; Watch Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {totalEvents === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No alerts — waiting for events from Zeitgeist backend
              </p>
            ) : (
              <>
                <AlertCard
                  severity="medium"
                  title="Monitoring active feeds"
                  description={`${totalEvents} events ingested across all streams`}
                />
                {events?.events?.slice(0, 4).map((evt) => (
                  <AlertCard
                    key={evt.id}
                    severity={evt.severity > 70 ? 'high' : evt.severity > 40 ? 'medium' : 'low'}
                    title={evt.title}
                    description={evt.summary}
                    country={evt.country_code}
                    timestamp={evt.occurred_at}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Simulation Worlds */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Worlds</CardTitle>
          </CardHeader>
          <CardContent>
            {simWorlds.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No simulation worlds</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {simWorlds.slice(0, 4).map((w) => (
                  <WorldMiniCard key={w.id} world={w} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Active Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            {allScenarios.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No scenarios — waiting for predictions from backend
              </p>
            ) : (
              <div className="divide-y divide-border">
                {allScenarios.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-start justify-between py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{s.description}</p>
                    </div>
                    <div className="ml-3 text-right shrink-0">
                      <p className="font-mono text-xs">{Math.round(s.probability * 100)}%</p>
                      <p
                        className={
                          s.risk_delta > 0
                            ? 'text-[10px] text-red-500'
                            : s.risk_delta < 0
                              ? 'text-[10px] text-green-500'
                              : 'text-[10px] text-muted-foreground'
                        }
                      >
                        {s.risk_delta > 0 ? '+' : ''}
                        {s.risk_delta.toFixed(1)} risk
                      </p>
                    </div>
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
