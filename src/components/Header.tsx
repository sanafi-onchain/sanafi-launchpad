import Link from 'next/link';
import { CreateTokenButton } from './CreateTokenButton';
import { ConnectWalletButton } from './ConnectWalletButton';
import { LogoutButton } from './LogoutButton';
import { useRouter } from 'next/router';

type HeaderProps = {
  isLogin?: boolean;
};

export const Header = ({ isLogin }: HeaderProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        router.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="w-full px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="https://imagedelivery.net/77VSeueIxa_OonUVDWCJsg/logo-ethics-only-e-symbol-new/public"
            alt="Ethics Logo"
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <h1 className="whitespace-nowrap text-lg md:text-2xl font-bold">Ethics</h1>
        </Link>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-4">
          {!['/create-token', '/auth'].includes(router.pathname) && <CreateTokenButton />}
          {!['/auth'].includes(router.pathname) && <ConnectWalletButton />}
          {isLogin && <LogoutButton onClick={() => handleLogout()} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
