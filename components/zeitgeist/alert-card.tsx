'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AlertCardProps {
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  country?: string
  timestamp?: string
}

const SEVERITY_CONFIG = {
  critical: { variant: 'destructive' as const, border: 'border-l-4 border-l-red-500' },
  high: { variant: 'destructive' as const, border: 'border-l-4 border-l-orange-500' },
  medium: { variant: 'warning' as const, border: 'border-l-4 border-l-yellow-500' },
  low: { variant: 'info' as const, border: 'border-l-4 border-l-violet-500' },
}

export function AlertCard({ severity, title, description, country, timestamp }: AlertCardProps) {
  const config = SEVERITY_CONFIG[severity]
  return (
    <Card className={cn(config.border)}>
      <CardContent className="flex items-start gap-3 p-3">
        <Badge variant={config.variant} appearance="light" size="xs">
          {severity.toUpperCase()}
        </Badge>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="flex gap-2 text-[10px] text-muted-foreground">
            {country && <span>{country}</span>}
            {timestamp && <span>{new Date(timestamp).toLocaleTimeString()}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
