import { useQuery } from '@tanstack/react-query';

export interface AllTokensToken {
  id: number;
  contract_address: string;
  symbol: string;
  name: string;
  description: string;
  icon: string;
  live_onchain_at: string;
  user: {
    id: number;
    address: string;
  };
  x_username?: string;
}

export interface AllTokensResponse {
  data: AllTokensToken[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: Record<string, unknown>;
}

export interface AllTokensFilters {
  symbol?: string;
  contract_address?: string;
  creator_address?: string;
  page?: number;
  limit?: number;
}

const fetchAllTokens = async (filters: AllTokensFilters = {}): Promise<AllTokensResponse> => {
  const params = new URLSearchParams();

  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.symbol) params.append('symbol', filters.symbol);
  if (filters.contract_address) params.append('contract_address', filters.contract_address);
  if (filters.creator_address) params.append('creator_address', filters.creator_address);

  const response = await fetch(`/api/all-tokens?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch all tokens');
  }

  return response.json();
};

export const useAllTokens = (filters: AllTokensFilters = {}) => {
  const query = useQuery({
    queryKey: ['allTokens', filters],
    queryFn: () => fetchAllTokens(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};
