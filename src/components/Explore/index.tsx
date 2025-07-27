import ExploreGrid from './ExploreGrid';
import { DataStreamProvider } from '@/contexts/DataStreamProvider';
import { ExploreMsgHandler } from './ExploreMsgHandler';
import { ExploreProvider } from '@/contexts/ExploreProvider';
import { PropsWithChildren, useState } from 'react';
import AllTokensTable from '@/components/AllTokensTable';
import { cn } from '@/lib/utils';

type TabType = 'AlphaScan' | 'All Active';

const Explore = () => {
  const [activeTab, setActiveTab] = useState<TabType>('AlphaScan');

  return (
    <ExploreContext>
      <div className="py-4 space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-neutral-900/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('AlphaScan')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'AlphaScan'
                ? 'bg-white/5 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            )}
          >
            AlphaScan
          </button>
          <button
            onClick={() => setActiveTab('All Active')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'All Active'
                ? 'bg-white/5 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            )}
          >
            All Active
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'AlphaScan' && (
            <div>
              <ExploreGrid className="flex-1" />
            </div>
          )}

          {activeTab === 'All Active' && (
            <div>
              <AllTokensTable />
            </div>
          )}
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
