import { fetchApi } from '@/lib/api';
import { CountryRisk } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useCii(countryCode: string | undefined) {
  return useQuery<CountryRisk>({
    queryKey: ['cii', countryCode],
    queryFn: () => fetchApi<CountryRisk>(`/api/cii/${countryCode}`),
    enabled: !!countryCode,
  });
}
