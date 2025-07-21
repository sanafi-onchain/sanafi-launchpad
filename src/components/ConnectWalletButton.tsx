import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { shortenAddress } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';

type ConnectWalletButtonProps = {
  className?: string;
};

export const ConnectWalletButton = ({ className }: ConnectWalletButtonProps) => {
  const { setShowModal } = useUnifiedWalletContext();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { disconnect, publicKey } = useWallet();
  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const handleConnectWallet = () => {
    setShowModal(true);
  };

  const handleDisconnect = () => {
    setShowLogoutConfirm(true);
  };

  const confirmDisconnect = () => {
    disconnect();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {address ? (
        <Button
          onClick={handleDisconnect}
          className="!rounded-lg hover:scale-105 active:scale-95 transition-transform !px-6 !py-1.5 text-xs h-auto"
        >
          <span className="flex items-center gap-1">
            <span className="iconify ph--sign-out-bold w-4 h-4" />
            <span>{shortenAddress(address)}</span>
          </span>
        </Button>
      ) : (
        <Button
          onClick={handleConnectWallet}
          className="!rounded-lg hover:scale-105 active:scale-95 transition-transform !px-6 !py-1.5 text-xs h-auto"
        >
          <span className="flex items-center gap-1">
            <span className="iconify ph--wallet-bold w-4 h-4" />
            <span className="hidden md:block">Connect Wallet</span>
            <span className="block md:hidden">Connect</span>
          </span>
        </Button>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="bg-background text-foreground sm:max-w-[400px] p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-2xl font-bold text-center">Confirm Disconnect</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-lg">
            Are you sure you want to disconnect your wallet?
          </div>
          <DialogFooter className="flex gap-6 justify-center pt-4">
            <Button
              onClick={() => setShowLogoutConfirm(false)}
              className="!rounded-lg bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all px-6 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDisconnect}
              className="!rounded-lg hover:scale-105 active:scale-95 transition-all px-6"
            >
              Yes, Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectWalletButton;
