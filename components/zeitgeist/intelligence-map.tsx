'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import type { Event } from '@/lib/types'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const REGION_PRESETS = [
  { label: 'Global', lng: 30, lat: 25, zoom: 2.5 },
  { label: 'MENA', lng: 45, lat: 30, zoom: 4 },
  { label: 'Europe', lng: 15, lat: 50, zoom: 4 },
  { label: 'Asia', lng: 105, lat: 35, zoom: 3.5 },
  { label: 'Americas', lng: -80, lat: 15, zoom: 3 },
]

function severityColor(severity: number): [number, number, number, number] {
  if (severity >= 75) return [239, 68, 68, 210]
  if (severity >= 50) return [245, 158, 11, 210]
  if (severity >= 25) return [6, 182, 212, 190]
  return [16, 185, 129, 160]
}

function kindRadius(kind: string): number {
  switch (kind) {
    case 'conflict':
    case 'military':
      return 8
    case 'natural_disaster':
      return 10
    default:
      return 5
  }
}

interface IntelligenceMapProps {
  events: Event[]
  onEventClick?: (event: Event) => void
}

export function IntelligenceMap({ events, onEventClick }: IntelligenceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlayRef = useRef<any>(null)
  const [mapReady, setMapReady] = useState(false)

  const geoEvents = useMemo(
    () => events.filter((e) => e.lat != null && e.lon != null && e.lat !== 0 && e.lon !== 0),
    [events],
  )

  // Keep onEventClick in a ref so the layer effect doesn't re-run on callback identity change
  const onEventClickRef = useRef(onEventClick)
  useEffect(() => {
    onEventClickRef.current = onEventClick
  }, [onEventClick])

  // Init map once on mount
  useEffect(() => {
    if (!containerRef.current) return

    let isMounted = true

    const init = async () => {
      const [{ Map }, { MapboxOverlay }] = await Promise.all([
        import('maplibre-gl'),
        import('@deck.gl/mapbox'),
      ])
      // Import CSS — only runs in browser context
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — CSS module import, no type declarations needed
      await import('maplibre-gl/dist/maplibre-gl.css')

      if (!isMounted || !containerRef.current) return

      const map = new Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: [30, 25],
        zoom: 2.5,
        attributionControl: false,
      })

      mapRef.current = map

      const overlay = new MapboxOverlay({ interleaved: false, layers: [] })
      overlayRef.current = overlay
      map.addControl(overlay)

      map.on('load', () => {
        if (isMounted) setMapReady(true)
      })
    }

    init().catch(console.error)

    return () => {
      isMounted = false
      try {
        overlayRef.current?.finalize()
      } catch {}
      try {
        mapRef.current?.remove()
      } catch {}
      overlayRef.current = null
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  // Update deck.gl layers when geoEvents changes
  useEffect(() => {
    if (!mapReady || !overlayRef.current) return

    const updateLayers = async () => {
      const { ScatterplotLayer } = await import('@deck.gl/layers')

      const layer = new ScatterplotLayer<Event>({
        id: 'events',
        data: geoEvents,
        getPosition: (d) => [d.lon!, d.lat!],
        getRadius: (d) => kindRadius(d.kind),
        getFillColor: (d) => severityColor(d.severity),
        radiusUnits: 'pixels',
        radiusMinPixels: 4,
        radiusMaxPixels: 20,
        pickable: true,
        stroked: true,
        getLineColor: (d) => (d.severity >= 75 ? [239, 68, 68, 255] : [0, 0, 0, 0]),
        getLineWidth: (d) => (d.severity >= 75 ? 2 : 0),
        lineWidthUnits: 'pixels',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: (info: any) => {
          if (info.object) {
            onEventClickRef.current?.(info.object as Event)
          }
        },
      })

      overlayRef.current?.setProps({ layers: [layer] })
    }

    updateLayers().catch(console.error)
  }, [geoEvents, mapReady])

  const flyTo = useCallback((lng: number, lat: number, zoom: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 1000 })
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {/* Map container */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Severity legend — bottom left */}
      <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-border bg-card/90 p-3 text-xs backdrop-blur">
        <p className="mb-2 font-medium text-foreground">Severity</p>
        <div className="space-y-1">
          {[
            { color: 'bg-red-500', label: 'Critical (75+)' },
            { color: 'bg-amber-500', label: 'Elevated (50–74)' },
            { color: 'bg-cyan-500', label: 'Info (25–49)' },
            { color: 'bg-emerald-500', label: 'Normal (0–24)' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">{geoEvents.length} events on map</p>
      </div>

      {/* Region presets — top right */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-1">
        {REGION_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => flyTo(preset.lng, preset.lat, preset.zoom)}
            className="rounded border border-border bg-card/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur transition-colors hover:bg-secondary hover:text-foreground"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
