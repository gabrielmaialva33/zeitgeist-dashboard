'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { World } from '@/lib/types'

export function WorldMiniCard({ world }: { world: World }) {
  const stateVariant = world.is_baseline ? 'success' : 'info'
  const stateLabel = world.is_baseline ? 'Baseline' : 'Simulation'

  return (
    <Card>
      <CardContent className="space-y-2 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{world.name}</span>
          <Badge variant={stateVariant} appearance="light" size="xs">
            {stateLabel}
          </Badge>
        </div>
        {world.description && (
          <p className="line-clamp-2 text-[11px] text-muted-foreground">{world.description}</p>
        )}
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Created {new Date(world.created_at).toLocaleDateString()}</span>
          {world.parent_world_id && <span>Fork</span>}
        </div>
      </CardContent>
    </Card>
  )
}
