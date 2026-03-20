'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'stable'
  color?: 'default' | 'critical' | 'elevated' | 'normal'
}

const COLOR_MAP = {
  default: 'text-foreground',
  critical: 'text-red-500',
  elevated: 'text-yellow-500',
  normal: 'text-green-500',
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'default' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn('rounded-lg bg-secondary p-2.5', COLOR_MAP[color])}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className={cn('text-2xl font-bold', COLOR_MAP[color])}>{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
