import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type LogoutButtonProps = {
  className?: string;
  onClick: () => void;
};

export const LogoutButton = ({ className, onClick }: LogoutButtonProps) => {
  return (
    <Button
      className={cn(
        '!rounded-lg hover:scale-105 active:scale-95 transition-transform !px-6 !py-1.5 text-xs h-auto',
        className
      )}
      onClick={onClick}
    >
      <span className="flex items-center gap-1">
        <span className="iconify ph--sign-out-bold w-4 h-4" />
        <span>Logout</span>
      </span>
    </Button>
  );
};
