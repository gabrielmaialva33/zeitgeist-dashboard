'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CiiLeaderboard } from '@/components/zeitgeist/cii-leaderboard'
import { CascadeTree } from '@/components/zeitgeist/cascade-tree'
import { CorrelationItem } from '@/components/zeitgeist/correlation-item'
import { StatCard } from '@/components/zeitgeist/stat-card'
import { useEvents } from '@/hooks/use-events'
import { AlertTriangle, TrendingUp, GitBranch, Activity } from 'lucide-react'
import type { CountryRisk } from '@/lib/types'

// Demo data — replaced by API calls when /api/risk/cii endpoints are ready
const DEMO_COUNTRIES: CountryRisk[] = [
  {
    country_code: 'UA',
    country_name: 'Ukraine',
    risk_score: 92,
    conflict_index: 95,
    economic_stress: 80,
    political_stability: 30,
    cyber_threat_level: 85,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'SY',
    country_name: 'Syria',
    risk_score: 88,
    conflict_index: 90,
    economic_stress: 85,
    political_stability: 20,
    cyber_threat_level: 60,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'SD',
    country_name: 'Sudan',
    risk_score: 82,
    conflict_index: 85,
    economic_stress: 90,
    political_stability: 15,
    cyber_threat_level: 40,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'YE',
    country_name: 'Yemen',
    risk_score: 78,
    conflict_index: 80,
    economic_stress: 88,
    political_stability: 18,
    cyber_threat_level: 35,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'AF',
    country_name: 'Afghanistan',
    risk_score: 75,
    conflict_index: 70,
    economic_stress: 92,
    political_stability: 22,
    cyber_threat_level: 30,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'MM',
    country_name: 'Myanmar',
    risk_score: 71,
    conflict_index: 75,
    economic_stress: 70,
    political_stability: 25,
    cyber_threat_level: 45,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'SO',
    country_name: 'Somalia',
    risk_score: 68,
    conflict_index: 65,
    economic_stress: 85,
    political_stability: 20,
    cyber_threat_level: 25,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'LY',
    country_name: 'Libya',
    risk_score: 62,
    conflict_index: 60,
    economic_stress: 55,
    political_stability: 28,
    cyber_threat_level: 40,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'IQ',
    country_name: 'Iraq',
    risk_score: 58,
    conflict_index: 55,
    economic_stress: 50,
    political_stability: 35,
    cyber_threat_level: 50,
    updated_at: new Date().toISOString(),
  },
  {
    country_code: 'CD',
    country_name: 'DR Congo',
    risk_score: 55,
    conflict_index: 60,
    economic_stress: 75,
    political_stability: 25,
    cyber_threat_level: 20,
    updated_at: new Date().toISOString(),
  },
]

// Demo cascade — Strait of Hormuz disruption scenario
const DEMO_CASCADE = [
  { id: 'Strait of Hormuz', impact: 0.9, depth: 0, lag_hours: 0 },
  { id: 'Persian Gulf Oil Route', impact: 0.72, depth: 1, lag_hours: 6 },
  { id: 'Japan Oil Supply', impact: 0.52, depth: 2, lag_hours: 24 },
  { id: 'EU Energy Markets', impact: 0.38, depth: 2, lag_hours: 18 },
]

export function RiskContent() {
  const { data: eventsData } = useEvents()
  const totalEvents = eventsData?.events?.length ?? 0
  const criticalEvents = eventsData?.events?.filter((e) => e.severity >= 75).length ?? 0
  const criticalCountries = DEMO_COUNTRIES.filter((c) => c.risk_score >= 75).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Risk Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Country instability, anomalies, correlations, and cascade modeling
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Countries Tracked" value={DEMO_COUNTRIES.length} icon={Activity} />
        <StatCard
          title="Critical Risk"
          value={criticalCountries}
          subtitle="risk score ≥75"
          icon={AlertTriangle}
          color="critical"
        />
        <StatCard
          title="Critical Events"
          value={criticalEvents}
          subtitle={`of ${totalEvents} total`}
          icon={TrendingUp}
          color="elevated"
        />
        <StatCard title="Cascade Nodes" value={DEMO_CASCADE.length} icon={GitBranch} color="normal" />
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* CII Leaderboard — spans 2 rows */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Country Instability Index</CardTitle>
            <CardDescription>Top 10 countries by risk score</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CiiLeaderboard countries={DEMO_COUNTRIES} />
          </CardContent>
        </Card>

        {/* Cascade Simulator */}
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Cascade</CardTitle>
            <CardDescription>Strait of Hormuz disruption scenario</CardDescription>
          </CardHeader>
          <CardContent>
            <CascadeTree nodes={DEMO_CASCADE} />
          </CardContent>
        </Card>

        {/* Correlations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Correlations</CardTitle>
            <CardDescription>Cross-stream pattern detections</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0 px-5">
            <CorrelationItem pattern="VelocitySpike" entities={['Conflict events', 'MENA']} confidence={0.85} />
            <CorrelationItem
              pattern="Triangulation"
              entities={['Iran', 'News+Military+Market']}
              confidence={0.78}
            />
            <CorrelationItem
              pattern="NewsLeadsMarket"
              entities={['Oil', 'Reuters → Brent']}
              confidence={0.72}
            />
            <CorrelationItem
              pattern="SilentDivergence"
              entities={['UA CII↑', 'EUR stable']}
              confidence={0.65}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
