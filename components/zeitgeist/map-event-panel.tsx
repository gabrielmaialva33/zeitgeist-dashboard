'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StreamBadge } from '@/components/zeitgeist/stream-badge'
import { ConfidenceBar } from '@/components/zeitgeist/confidence-bar'
import type { Event } from '@/lib/types'

interface MapEventPanelProps {
  event: Event
  onClose: () => void
}

export function MapEventPanel({ event, onClose }: MapEventPanelProps) {
  const severityVariant =
    event.severity >= 75
      ? ('destructive' as const)
      : event.severity >= 50
        ? ('warning' as const)
        : event.severity >= 25
          ? ('info' as const)
          : ('success' as const)

  return (
    <div className="absolute right-0 top-0 z-20 h-full w-80 overflow-y-auto border-l border-border bg-card shadow-xl">
      {/* Sticky header */}
      <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-3">
        <span className="text-sm font-medium">Event Detail</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X size={14} />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        {/* Stream + severity badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StreamBadge stream={event.kind} />
            <Badge variant={severityVariant} appearance="light" size="xs">
              Severity {event.severity}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold leading-snug">{event.title}</h3>
          <p className="text-xs text-muted-foreground">{event.summary}</p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Confidence</span>
            <ConfidenceBar value={event.confidence} />
          </div>

          {event.country_code && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Country</span>
              <span className="font-mono uppercase">{event.country_code}</span>
            </div>
          )}

          {event.lat != null && event.lon != null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coordinates</span>
              <span className="font-mono">
                {event.lat.toFixed(3)}, {event.lon.toFixed(3)}
              </span>
            </div>
          )}

          {event.occurred_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Occurred</span>
              <span>{new Date(event.occurred_at).toLocaleString()}</span>
            </div>
          )}

          {event.location && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="text-right">{event.location}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary" size="xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Source URLs */}
        {event.source_urls && event.source_urls.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Sources</p>
            {event.source_urls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-xs text-blue-400 hover:underline"
              >
                {url}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
