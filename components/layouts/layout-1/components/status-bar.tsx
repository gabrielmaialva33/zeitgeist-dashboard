'use client';

import { useEffect, useState } from 'react';
import { useWsStatus } from '@/hooks/use-zeitgeist-ws';
import { cn } from '@/lib/utils';

interface HealthData {
  version?: string;
  service?: string;
  status?: string;
}

export function StatusBar() {
  const { connected, eventsPerMinute } = useWsStatus();
  const [health, setHealth] = useState<HealthData>({});

  useEffect(() => {
    let cancelled = false;

    async function fetchHealth() {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) return;
        const data = (await res.json()) as HealthData;
        if (!cancelled) setHealth(data);
      } catch {
        // ignore
      }
    }

    fetchHealth();
    const id = setInterval(fetchHealth, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const version = health.version ?? health.service ?? 'zeitgeist';

  return (
    <div className="h-8 border-t border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left: WS status + events/min */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            'size-2 rounded-full shrink-0',
            connected ? 'bg-green-500' : 'bg-red-500',
          )}
        />
        <span>{connected ? 'Connected' : 'Disconnected'}</span>
        {connected && eventsPerMinute > 0 && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span>{eventsPerMinute} events/min</span>
          </>
        )}
      </div>

      {/* Right: service version */}
      <div className="text-xs text-muted-foreground/60 font-mono">{version}</div>
    </div>
  );
}
