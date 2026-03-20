'use client'

import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import type { CountryRisk } from '@/lib/types'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CiiLeaderboardProps {
  countries: CountryRisk[]
}

export function CiiLeaderboard({ countries }: CiiLeaderboardProps) {
  const sorted = [...countries].sort((a, b) => b.risk_score - a.risk_score).slice(0, 10)

  return (
    <div className="divide-y divide-border">
      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No country data available</p>
      ) : (
        sorted.map((c, i) => (
          <div key={c.country_code} className="flex items-center gap-3 px-3 py-2">
            <span className="w-5 font-mono text-xs text-muted-foreground">{i + 1}</span>
            <span className="w-8 font-mono text-xs font-medium">{c.country_code}</span>
            <span className="flex-1 truncate text-sm">{c.country_name}</span>
            <MiniSparkline score={c.risk_score} />
            <RiskBadge score={c.risk_score} />
            <span className="w-8 text-right font-mono text-sm font-bold">{c.risk_score}</span>
          </div>
        ))
      )}
    </div>
  )
}

function RiskBadge({ score }: { score: number }) {
  if (score >= 75) return <Badge variant="destructive" appearance="light" size="xs">CRITICAL</Badge>
  if (score >= 50) return <Badge variant="warning" appearance="light" size="xs">ELEVATED</Badge>
  if (score >= 25) return <Badge variant="info" appearance="light" size="xs">WATCH</Badge>
  return <Badge variant="success" appearance="light" size="xs">NORMAL</Badge>
}

function MiniSparkline({ score }: { score: number }) {
  // Deterministic-ish sparkline based on score with sine wave variance
  const data = Array.from({ length: 12 }, (_, i) =>
    Math.max(0, Math.min(100, score + Math.sin(i * 0.8) * 5 + (i % 3) * 1.5 - 2)),
  )
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f59e0b' : score >= 25 ? '#06b6d4' : '#10b981'

  return (
    <Chart
      type="line"
      width={60}
      height={24}
      series={[{ data }]}
      options={{
        chart: { sparkline: { enabled: true }, background: 'transparent', animations: { enabled: false } },
        stroke: { curve: 'smooth', width: 1.5 },
        colors: [color],
        tooltip: { enabled: false },
        yaxis: { show: false },
        xaxis: { labels: { show: false } },
      }}
    />
  )
}
