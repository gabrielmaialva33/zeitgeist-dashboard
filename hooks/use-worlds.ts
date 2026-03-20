import { fetchApi } from '@/lib/api';
import { World, WorldList } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useWorlds() {
  return useQuery<WorldList>({
    queryKey: ['worlds'],
    queryFn: () => fetchApi<WorldList>('/api/worlds'),
    refetchInterval: 10_000,
  });
}

export function useWorld(id: string | undefined) {
  return useQuery<World>({
    queryKey: ['worlds', id],
    queryFn: () => fetchApi<World>(`/api/worlds/${id}`),
    enabled: !!id,
    refetchInterval: 5_000,
  });
}
