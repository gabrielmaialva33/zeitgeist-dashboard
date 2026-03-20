'use client'

import { Badge } from '@/components/ui/badge'

const STREAM_COLORS: Record<
  string,
  { variant: 'destructive' | 'warning' | 'info' | 'success' | 'secondary'; label: string }
> = {
  conflict: { variant: 'destructive', label: 'Conflict' },
  military: { variant: 'destructive', label: 'Military' },
  diplomatic: { variant: 'info', label: 'Diplomatic' },
  economic: { variant: 'warning', label: 'Economic' },
  political: { variant: 'secondary', label: 'Political' },
  cyber: { variant: 'warning', label: 'Cyber' },
  humanitarian: { variant: 'success', label: 'Humanitarian' },
  intelligence: { variant: 'info', label: 'Intel' },
  protest: { variant: 'warning', label: 'Protest' },
  natural_disaster: { variant: 'destructive', label: 'Natural' },
  news: { variant: 'secondary', label: 'News' },
  market: { variant: 'warning', label: 'Market' },
  seismic: { variant: 'destructive', label: 'Seismic' },
  other: { variant: 'secondary', label: 'Other' },
}

export function StreamBadge({ stream }: { stream: string }) {
  const config = STREAM_COLORS[stream] ?? STREAM_COLORS.other!
  return (
    <Badge variant={config.variant} appearance="light" size="sm">
      {config.label}
    </Badge>
  )
}
