'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StreamBadge } from '@/components/zeitgeist/stream-badge'
import { ConfidenceBar } from '@/components/zeitgeist/confidence-bar'
import { useEvents } from '@/hooks/use-events'
import { useWsEvents, useWsStatus } from '@/hooks/use-zeitgeist-ws'
import { Wifi, WifiOff } from 'lucide-react'
import type { Event } from '@/lib/types'

const STREAM_OPTIONS = [
  { value: 'all', label: 'All Streams' },
  { value: 'conflict', label: 'Conflict' },
  { value: 'military', label: 'Military' },
  { value: 'diplomatic', label: 'Diplomatic' },
  { value: 'economic', label: 'Economic' },
  { value: 'political', label: 'Political' },
  { value: 'cyber', label: 'Cyber' },
  { value: 'humanitarian', label: 'Humanitarian' },
  { value: 'intelligence', label: 'Intelligence' },
  { value: 'protest', label: 'Protest' },
  { value: 'natural_disaster', label: 'Natural Disaster' },
  { value: 'other', label: 'Other' },
]

export function EventsContent() {
  const [streamFilter, setStreamFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data, isLoading } = useEvents()
  const wsEvents = useWsEvents()
  const { connected, eventsPerMinute } = useWsStatus()

  // Merge WS events (newest first) with API events, dedup by id
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

  // Apply filters
  const filtered = allEvents.filter((evt) => {
    if (streamFilter !== 'all' && evt.kind !== streamFilter) return false
    if (
      search &&
      !evt.title.toLowerCase().includes(search.toLowerCase()) &&
      !evt.summary.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Events Feed</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} events</p>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge variant="success" appearance="light" size="sm">
              <Wifi size={12} className="mr-1" /> Live — {eventsPerMinute}/min
            </Badge>
          ) : (
            <Badge variant="destructive" appearance="light" size="sm">
              <WifiOff size={12} className="mr-1" /> Disconnected
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 p-3">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={streamFilter} onValueChange={setStreamFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STREAM_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading events...</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No events yet — start Zeitgeist backend on :4000
              </div>
            ) : (
              filtered.slice(0, 100).map((evt) => (
                <div key={evt.id}>
                  <button
                    onClick={() => setExpandedId(expandedId === evt.id ? null : evt.id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-secondary/50"
                  >
                    <span className="w-20 shrink-0 font-mono text-[10px] text-muted-foreground">
                      {new Date(evt.occurred_at ?? evt.ingested_at).toLocaleTimeString()}
                    </span>
                    <StreamBadge stream={evt.kind} />
                    <span className="flex-1 truncate text-sm">{evt.title}</span>
                    {evt.country_code && (
                      <span className="text-xs text-muted-foreground">{evt.country_code}</span>
                    )}
                    <ConfidenceBar value={evt.confidence} />
                  </button>
                  {expandedId === evt.id && (
                    <div className="border-t border-border bg-secondary/30 px-4 py-3">
                      <p className="text-sm text-muted-foreground">{evt.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                        <span>ID: {evt.id}</span>
                        <span>Severity: {evt.severity}/100</span>
                        {evt.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" size="xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
