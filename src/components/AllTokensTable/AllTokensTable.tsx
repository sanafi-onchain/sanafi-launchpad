import React, { useState, useMemo } from 'react';
import { useAllTokens, AllTokensToken, AllTokensFilters } from '@/hooks/useAllTokens';
import Spinner from '@/components/Spinner/Spinner';
import { cn } from '@/lib/utils';
import { TruncatedAddress } from '@/components/TruncatedAddress/TruncatedAddress';
import { Copyable } from '@/components/ui/Copyable';
import CopyIconSVG from '@/icons/CopyIconSVG';
import SearchIcon from '@/icons/SearchIcon';
import ExternalIcon from '@/icons/ExternalIcon';

interface AllTokensTableProps {
  className?: string;
}

const AllTokensTable: React.FC<AllTokensTableProps> = ({ className }) => {
  const [filters, setFilters] = useState<AllTokensFilters>({
    page: 1,
    limit: 10,
  });

  const [searchInputs, setSearchInputs] = useState({
    symbol: '',
    contract_address: '',
    creator_address: '',
  });

  const { data, status, error, refetch, isFetching } = useAllTokens(filters);

  const handleSearchInputChange = (key: keyof typeof searchInputs, value: string) => {
    setSearchInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchSubmit = () => {
    setFilters((prev) => ({
      ...prev,
      ...searchInputs,
      page: 1, // Reset to page 1 when searching
    }));
  };

  const handleReset = () => {
    setSearchInputs({
      symbol: '',
      contract_address: '',
      creator_address: '',
    });
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const formatCreatedAt = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return 'just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  if (status === 'loading') {
    return (
      <div className={cn('flex justify-center py-8', className)}>
        <Spinner />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={cn('text-center py-8 text-red-400', className)}>
        <p>Failed to load tokens</p>
        {error instanceof Error && <p className="text-sm text-neutral-500 mt-1">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          {/* <h3 className="text-xl font-semibold text-white">All Tokens</h3> */}
          <p className="text-sm text-neutral-400 mt-1">Browse and search all available tokens</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          {isFetching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Refreshing...
            </>
          ) : (
            'Refresh'
          )}
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white mb-4">Search Filters</h4>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Symbol</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="e.g., VENIAM"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={searchInputs.symbol}
                  onChange={(e) => handleSearchInputChange('symbol', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Contract Address</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="e.g., 81c8tX...MVFU"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={searchInputs.contract_address}
                  onChange={(e) => handleSearchInputChange('contract_address', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Creator Address</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="e.g., 3BGnge...fnSe"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={searchInputs.creator_address}
                  onChange={(e) => handleSearchInputChange('creator_address', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 pt-2">
            <button
              onClick={handleSearchSubmit}
              disabled={isFetching}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {isFetching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="h-4 w-4 text-white" />
                  Search Tokens
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={isFetching}
              className="px-6 py-3 bg-neutral-600 hover:bg-neutral-700 disabled:bg-neutral-400 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-neutral-900/30 rounded-xl border border-neutral-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-neutral-800/50 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-white">Token Results</h4>
            {data?.pagination && (
              <div className="text-sm text-neutral-400">
                Page {data.pagination.page}{' '}
                {data.pagination.totalPages && `of ${data.pagination.totalPages}`}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                  Contract Address
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                  Chart
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50 bg-neutral-900/20">
              {data?.data && data.data.length > 0 ? (
                data.data.map((token) => (
                  <TokenRow key={token.id} token={token} formatCreatedAt={formatCreatedAt} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <SearchIcon className="h-12 w-12 text-neutral-600" />
                      <div className="text-neutral-400 text-lg font-medium">No tokens found</div>
                      <div className="text-neutral-500 text-sm">
                        Try adjusting your search filters
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          hasNextPage={data.pagination.hasNextPage}
          hasPrevPage={data.pagination.hasPrevPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

interface TokenRowProps {
  token: AllTokensToken;
  formatCreatedAt: (dateString: string) => string;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, formatCreatedAt }) => {
  return (
    <tr className="has-hover:hover:bg-neutral-800/30 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-neutral-800 flex-shrink-0 ring-2 ring-neutral-700">
            {token.icon ? (
              <img
                src={token.icon}
                alt={token.symbol}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.setAttribute('style', 'display: flex');
                }}
              />
            ) : null}
            <div
              className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-400 font-bold text-sm"
              style={{ display: token.icon ? 'none' : 'flex' }}
            >
              {token.symbol.charAt(0)}
            </div>
          </div>
          <div className="font-semibold text-white text-lg">{token.symbol}</div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="text-neutral-200 font-medium">{token.name}</div>
          {token.description && (
            <div className="text-xs text-neutral-500 max-w-xs truncate leading-relaxed">
              {token.description}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-5">
        <Copyable
          name="Contract Address"
          copyText={token.contract_address}
          className="group/copy flex cursor-pointer items-center gap-2 text-neutral-400 transition-colors has-hover:hover:text-neutral-200 p-2 rounded-lg hover:bg-neutral-800/50"
        >
          <TruncatedAddress
            className="text-sm font-mono"
            address={token.contract_address}
            charsStart={6}
            charsEnd={4}
          />
          <CopyIconSVG className="h-4 w-4 opacity-0 transition-opacity group-hover/copy:opacity-100" />
        </Copyable>
      </td>
      <td className="px-6 py-5">
        <Copyable
          name="Creator"
          copyText={token.user.address}
          className="group/copy cursor-pointer transition-colors has-hover:hover:text-neutral-200 p-2 rounded-lg hover:bg-neutral-800/50"
        >
          <TruncatedAddress
            className="text-sm font-mono text-neutral-400"
            address={token.user.address}
            charsStart={6}
            charsEnd={4}
          />
        </Copyable>
      </td>
      <td className="px-6 py-5">
        <div className="text-sm text-neutral-400 font-medium">
          {formatCreatedAt(token.live_onchain_at)}
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-2 w-28">
          <a
            href={`https://jup.ag/tokens/${token.contract_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
          >
            <ExternalIcon className="h-3 w-3" />
            Jupiter
          </a>
          <a
            href={`https://dexscreener.com/solana/${token.contract_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
          >
            <ExternalIcon className="h-3 w-3" />
            DexScreener
          </a>
        </div>
      </td>
    </tr>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}) => {
  return (
    <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400 font-medium">
          Page {currentPage} {totalPages && `of ${totalPages}`}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm font-medium rounded-lg">
              {currentPage}
            </span>
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllTokensTable;
