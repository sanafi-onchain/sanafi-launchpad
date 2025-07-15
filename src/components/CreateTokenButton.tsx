import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type CreateTokenButtonProps = {
  className?: string;
};

export const CreateTokenButton = ({ className }: CreateTokenButtonProps) => {
  return (
    <Link href="/create-token">
      <Button
        className={cn(
          '!rounded-lg hover:scale-105 active:scale-95 transition-transform !px-6 !py-1.5 text-xs h-auto',
          className
        )}
      >
        <span className="flex items-center gap-1">
          <span className="iconify ph--rocket-bold w-4 h-4" />
          <span>Create Token</span>
        </span>
      </Button>
    </Link>
  );
};
