import ExploreGrid from './ExploreGrid';
import { DataStreamProvider } from '@/contexts/DataStreamProvider';
import { ExploreMsgHandler } from './ExploreMsgHandler';
import { ExploreProvider } from '@/contexts/ExploreProvider';
import { PropsWithChildren } from 'react';
import AllTokensTable from '@/components/AllTokensTable';

const Explore = () => {
  return (
    <ExploreContext>
      <div className="py-8 space-y-8">
        {/* 24h Tokens Section */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">24h Tokens</h1>
          <ExploreGrid className="flex-1" />
        </div>

        {/* All Tokens Section */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">All Tokens</h1>
          <AllTokensTable />
        </div>
      </div>
    </ExploreContext>
  );
};

const ExploreContext = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-full">
      <ExploreMsgHandler />

      <ExploreProvider>
        <DataStreamProvider>{children}</DataStreamProvider>
      </ExploreProvider>
    </div>
  );
};

export default Explore;
