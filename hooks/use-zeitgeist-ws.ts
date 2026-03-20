'use client';

import { useWs } from '@/providers/ws-provider';
import { Event } from '@/lib/types';
import { useMemo } from 'react';

/**
 * Returns events from the WebSocket stream, optionally filtered by stream/kind.
 */
export function useWsEvents(stream?: string): Event[] {
  const { events } = useWs();

  return useMemo(() => {
    if (!stream) return events;
    return events.filter((e) => e.kind === stream);
  }, [events, stream]);
}

/**
 * Returns WebSocket connection status and throughput metrics.
 */
export function useWsStatus(): {
  connected: boolean;
  eventsPerMinute: number;
  lastEventAt: number | null;
} {
  const { connected, eventsPerMinute, lastEventAt } = useWs();
  return { connected, eventsPerMinute, lastEventAt };
}
