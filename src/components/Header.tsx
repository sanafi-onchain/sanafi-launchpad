import Link from 'next/link';
import { CreateTokenButton } from './CreateTokenButton';
import { ConnectWalletButton } from './ConnectWalletButton';
import { useRouter } from 'next/router';

export const Header = () => {
  const router = useRouter();

  return (
    <header className="w-full px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          <h1 className="whitespace-nowrap text-lg md:text-2xl font-bold">
            Ethics - Ethical Project Launchpad
          </h1>
        </Link>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-4">
          {router.pathname !== '/create-token' && <CreateTokenButton />}
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
