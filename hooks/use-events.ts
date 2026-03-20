import { fetchApi } from '@/lib/api';
import { EventList } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useEvents() {
  return useQuery<EventList>({
    queryKey: ['events'],
    queryFn: () => fetchApi<EventList>('/api/events'),
    refetchInterval: 30_000,
  });
}
