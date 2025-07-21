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
    <div className={cn('space-y-3', className)}>
      {/* Compact Header Section */}
      {/* <div className="flex items-center justify-end">
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded font-medium transition-colors flex items-center gap-1.5"
        >
          {isFetching ? (
            <>
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              Refreshing
            </>
          ) : (
            <>
              <div className="w-3 h-3">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              Refresh
            </>
          )}
        </button>
      </div> */}

      {/* Compact Search Section */}
      <div className="bg-neutral-900/30 rounded-lg p-3 border border-neutral-800/50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">Symbol</label>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-neutral-500" />
              <input
                type="text"
                placeholder="VENIAM"
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all"
                value={searchInputs.symbol}
                onChange={(e) => handleSearchInputChange('symbol', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">Contract</label>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-neutral-500" />
              <input
                type="text"
                placeholder="81c8tX...MVFU"
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all"
                value={searchInputs.contract_address}
                onChange={(e) => handleSearchInputChange('contract_address', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">Creator</label>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-neutral-500" />
              <input
                type="text"
                placeholder="3BGnge...fnSe"
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all"
                value={searchInputs.creator_address}
                onChange={(e) => handleSearchInputChange('creator_address', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearchSubmit}
              disabled={isFetching}
              className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded font-medium transition-colors flex items-center gap-1"
            >
              {isFetching ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  Search
                </>
              ) : (
                <>
                  <SearchIcon className="h-3 w-3 text-white" />
                  Search
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={isFetching}
              className="px-3 py-1.5 text-xs bg-neutral-600 hover:bg-neutral-700 disabled:bg-neutral-400 text-white rounded font-medium transition-colors flex items-center gap-1"
            >
              <div className="w-3 h-3">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Compact Results Table */}
      <div className="bg-neutral-900/20 rounded-lg border border-neutral-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800/30">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Chart
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/30 bg-neutral-900/10">
              {data?.data && data.data.length > 0 ? (
                data.data.map((token) => (
                  <TokenRow key={token.id} token={token} formatCreatedAt={formatCreatedAt} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <SearchIcon className="h-8 w-8 text-neutral-600" />
                      <div className="text-neutral-400 text-sm font-medium">No tokens found</div>
                      <div className="text-neutral-500 text-xs">
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
    <tr className="has-hover:hover:bg-neutral-800/20 transition-colors">
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-neutral-800 flex-shrink-0">
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
              className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-400 font-bold text-xs"
              style={{ display: token.icon ? 'none' : 'flex' }}
            >
              {token.symbol.charAt(0)}
            </div>
          </div>
          <div className="font-medium text-white text-sm">{token.symbol}</div>
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="space-y-0.5">
          <div className="text-neutral-200 text-sm font-medium">{token.name}</div>
          {token.description && (
            <div className="text-xs text-neutral-500 max-w-xs truncate">{token.description}</div>
          )}
        </div>
      </td>
      <td className="px-3 py-2">
        <Copyable
          name="Contract Address"
          copyText={token.contract_address}
          className="group/copy flex cursor-pointer items-center gap-1 text-neutral-400 transition-colors has-hover:hover:text-neutral-200 p-1 rounded hover:bg-neutral-800/30"
        >
          <TruncatedAddress
            className="text-xs font-mono"
            address={token.contract_address}
            charsStart={4}
            charsEnd={4}
          />
          <CopyIconSVG className="h-3 w-3 opacity-0 transition-opacity group-hover/copy:opacity-100" />
        </Copyable>
      </td>
      <td className="px-3 py-2">
        <Copyable
          name="Creator"
          copyText={token.user.address}
          className="group/copy flex cursor-pointer items-center gap-1 text-neutral-400 transition-colors has-hover:hover:text-neutral-200 p-1 rounded hover:bg-neutral-800/30"
        >
          <TruncatedAddress
            className="text-xs font-mono text-neutral-400"
            address={token.user.address}
            charsStart={4}
            charsEnd={4}
          />
          <CopyIconSVG className="h-3 w-3 opacity-0 transition-opacity group-hover/copy:opacity-100" />
        </Copyable>
      </td>
      <td className="px-3 py-2">
        <div className="text-xs text-neutral-400 font-medium">
          {formatCreatedAt(token.live_onchain_at)}
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex gap-1">
          <a
            href={`https://jup.ag/tokens/${token.contract_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
          >
            <ExternalIcon className="h-2.5 w-2.5" />
            Jup
          </a>
          <a
            href={`https://dexscreener.com/solana/${token.contract_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 px-2 py-1 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded transition-colors"
          >
            <ExternalIcon className="h-2.5 w-2.5" />
            Dex
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
    <div className="bg-neutral-900/20 rounded-lg p-2 border border-neutral-800/50">
      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-500">
          Page {currentPage} {totalPages && `of ${totalPages}`}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 text-white rounded font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Prev
          </button>
          <div className="flex items-center">
            <span className="w-6 h-6 flex items-center justify-center bg-white/10 text-white text-xs font-medium rounded border border-white/20">
              {currentPage}
            </span>
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 text-white rounded font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllTokensTable;
