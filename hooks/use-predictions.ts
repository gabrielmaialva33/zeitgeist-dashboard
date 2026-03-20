import { fetchApi } from '@/lib/api';
import { ScenarioList } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function usePredictions() {
  return useQuery<ScenarioList>({
    queryKey: ['predictions'],
    queryFn: () => fetchApi<ScenarioList>('/api/predictions'),
    refetchInterval: 15_000,
  });
}
