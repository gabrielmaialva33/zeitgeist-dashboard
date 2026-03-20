import { fetchApi } from '@/lib/api';
import { Briefing } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useBriefing() {
  return useQuery<Briefing>({
    queryKey: ['briefing'],
    queryFn: () => fetchApi<Briefing>('/api/briefing'),
    refetchInterval: 30_000,
  });
}
