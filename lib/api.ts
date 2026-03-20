// ============================================================
// Zeitgeist API Fetch Helper
// ============================================================

const DEFAULT_API_URL = 'http://localhost:4000';

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_ZEITGEIST_API ?? DEFAULT_API_URL;
}

export function getWsUrl(): string {
  const httpUrl = getApiUrl();
  return httpUrl.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://');
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Zeitgeist API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
