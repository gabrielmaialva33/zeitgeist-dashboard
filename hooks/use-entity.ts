import { fetchApi } from '@/lib/api';
import { EntityWithFacts } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useEntity(entityId: string | undefined) {
  return useQuery<EntityWithFacts>({
    queryKey: ['entity', entityId],
    queryFn: () => fetchApi<EntityWithFacts>(`/api/entities/${entityId}`),
    enabled: !!entityId,
  });
}
