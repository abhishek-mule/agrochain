import { useState, useEffect } from 'react';
import { useAddress, useConnectionStatus, useWallet } from '@thirdweb-dev/react';

export const useWeb3 = () => {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const wallet = useWallet();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(connectionStatus === 'connected' && !!address);
  }, [connectionStatus, address]);

  const disconnect = async () => {
    if (wallet) {
      await wallet.disconnect();
    }
  };

  return {
    address,
    isConnected,
    connectionStatus,
    wallet,
    disconnect,
  };
};