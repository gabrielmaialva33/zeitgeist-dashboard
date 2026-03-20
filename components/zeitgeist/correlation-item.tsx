'use client'

import { Badge } from '@/components/ui/badge'

interface CorrelationItemProps {
  pattern: string
  entities: string[]
  confidence: number
}

export function CorrelationItem({ pattern, entities, confidence }: CorrelationItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Badge variant="info" appearance="light" size="xs">
          {pattern}
        </Badge>
        <span className="text-xs text-muted-foreground">{entities.join(', ')}</span>
      </div>
      <span className="font-mono text-xs text-muted-foreground">{Math.round(confidence * 100)}%</span>
    </div>
  )
}
