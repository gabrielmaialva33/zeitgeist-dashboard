'use client';

import { getWsUrl } from '@/lib/api';
import { Event } from '@/lib/types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const MAX_EVENTS = 500;
const RECONNECT_DELAY_MS = 3000;
const EVENTS_PER_MIN_WINDOW_MS = 60_000;

interface WsContextValue {
  connected: boolean;
  events: Event[];
  eventsPerMinute: number;
  lastEventAt: number | null;
}

const WsContext = createContext<WsContextValue>({
  connected: false,
  events: [],
  eventsPerMinute: 0,
  lastEventAt: null,
});

export function WsProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsPerMinute, setEventsPerMinute] = useState(0);
  const [lastEventAt, setLastEventAt] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timestampsRef = useRef<number[]>([]);
  const mountedRef = useRef(true);

  const updateEventsPerMinute = useCallback(() => {
    const now = Date.now();
    timestampsRef.current = timestampsRef.current.filter(
      (ts) => now - ts < EVENTS_PER_MIN_WINDOW_MS,
    );
    setEventsPerMinute(timestampsRef.current.length);
  }, []);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    const url = getWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setConnected(true);
    };

    ws.onmessage = (msg) => {
      if (!mountedRef.current) return;
      try {
        const event = JSON.parse(msg.data) as Event;
        const now = Date.now();
        timestampsRef.current.push(now);
        updateEventsPerMinute();
        setLastEventAt(now);
        setEvents((prev) => {
          const next = [event, ...prev];
          return next.length > MAX_EVENTS ? next.slice(0, MAX_EVENTS) : next;
        });
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setConnected(false);
      reconnectTimerRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, RECONNECT_DELAY_MS);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [updateEventsPerMinute]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  return (
    <WsContext.Provider value={{ connected, events, eventsPerMinute, lastEventAt }}>
      {children}
    </WsContext.Provider>
  );
}

export function useWs(): WsContextValue {
  return useContext(WsContext);
}
