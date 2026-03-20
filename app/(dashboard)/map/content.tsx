'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { MapEventPanel } from '@/components/zeitgeist/map-event-panel'
import { useEvents } from '@/hooks/use-events'
import { useWsEvents, useWsStatus } from '@/hooks/use-zeitgeist-ws'
import { Wifi, WifiOff } from 'lucide-react'
import type { Event } from '@/lib/types'

// Wrap IntelligenceMap in dynamic to ensure no SSR (maplibre-gl requires browser)
const IntelligenceMap = dynamic(
  () => import('@/components/zeitgeist/intelligence-map').then((m) => ({ default: m.IntelligenceMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading map...
      </div>
    ),
  },
)

export function MapContent() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const { data, isLoading } = useEvents()
  const wsEvents = useWsEvents()
  const { connected, eventsPerMinute } = useWsStatus()

  // Merge WS (newest first) + API events, dedup by id
  const allEvents = (() => {
    const apiEvents = data?.events ?? []
    const seen = new Set<string>()
    const merged: Event[] = []
    for (const evt of [...wsEvents, ...apiEvents]) {
      if (!seen.has(evt.id)) {
        seen.add(evt.id)
        merged.push(evt)
      }
    }
    return merged
  })()

  const geoCount = allEvents.filter((e) => e.lat != null && e.lon != null && e.lat !== 0 && e.lon !== 0).length

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Intelligence Map</h1>
          <span className="text-xs text-muted-foreground">{geoCount} geo-tagged events</span>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge variant="success" appearance="light" size="xs">
              <Wifi size={10} className="mr-1" />
              {eventsPerMinute}/min
            </Badge>
          ) : (
            <Badge variant="destructive" appearance="light" size="xs">
              <WifiOff size={10} className="mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Map area — fills remaining height */}
      <div className="relative flex-1 overflow-hidden">
        {isLoading && allEvents.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading events...
          </div>
        ) : (
          <>
            <IntelligenceMap events={allEvents} onEventClick={setSelectedEvent} />
            {selectedEvent && (
              <MapEventPanel
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
