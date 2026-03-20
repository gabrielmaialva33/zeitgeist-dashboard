'use client'

import { cn } from '@/lib/utils'

interface CascadeNode {
  id: string
  impact: number
  depth: number
  lag_hours: number
}

interface CascadeTreeProps {
  nodes: CascadeNode[]
}

export function CascadeTree({ nodes }: CascadeTreeProps) {
  if (nodes.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        Select an infrastructure node to simulate cascade
      </p>
    )
  }

  return (
    <div className="space-y-1">
      {nodes.map((node) => {
        const impactPct = Math.round(node.impact * 100)
        const barColor =
          impactPct >= 70 ? 'bg-red-500' : impactPct >= 40 ? 'bg-amber-500' : 'bg-cyan-500'

        return (
          <div
            key={node.id}
            className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-secondary/50"
            style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
          >
            <span className="text-xs text-muted-foreground">{node.depth === 0 ? '■' : '└─'}</span>
            <span className="flex-1 text-xs font-medium">{node.id}</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
              <div className={cn('h-full rounded-full', barColor)} style={{ width: `${impactPct}%` }} />
            </div>
            <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">{impactPct}%</span>
            <span className="w-12 text-right text-[10px] text-muted-foreground">{node.lag_hours}h lag</span>
          </div>
        )
      })}
    </div>
  )
}
