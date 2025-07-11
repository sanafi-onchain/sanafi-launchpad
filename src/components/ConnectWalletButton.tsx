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
          className="hover:scale-105 active:scale-95 transition-transform text-white"
        >
          {shortenAddress(address)}
        </Button>
      ) : (
        <Button
          onClick={handleConnectWallet}
          className="hover:scale-105 active:scale-95 transition-transform text-white"
        >
          <span className="hidden md:block">Connect Wallet</span>
          <span className="block md:hidden">Connect</span>
        </Button>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="bg-card text-card-foreground border border-border sm:max-w-[400px] p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-2xl font-bold text-center">Confirm Disconnect</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-lg">
            Are you sure you want to disconnect your wallet?
          </div>
          <DialogFooter className="flex gap-6 justify-center pt-4">
            <Button
              onClick={() => setShowLogoutConfirm(false)}
              className="bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all px-6 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDisconnect}
              className="bg-gradient-to-r from-primary to-[#0f172a] hover:scale-105 active:scale-95 transition-all px-6 text-white"
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
