import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type CreateTokenButtonProps = {
  className?: string;
};

export const CreateTokenButton = ({ className }: CreateTokenButtonProps) => {
  return (
    <Button
      className={cn('hover:scale-105 active:scale-95 transition-transform text-white', className)}
    >
      <Link href="/create-token" className="flex items-center gap-1">
        <span className="iconify ph--rocket-bold w-4 h-4" />
        <span>Create Token</span>
      </Link>
    </Button>
  );
};
