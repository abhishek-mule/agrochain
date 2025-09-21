import React, { useState } from 'react';
import { Wallet, Leaf, Shield, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { ConnectWallet, useAddress, useConnectionStatus } from '@thirdweb-dev/react';
import { useWeb3 } from '../hooks/useWeb3';

interface WalletAuthProps {
  onConnect: (address: string, userType: 'farmer' | 'consumer') => void;
}

const WalletAuth: React.FC<WalletAuthProps> = ({ onConnect }) => {
  const [selectedUserType, setSelectedUserType] = useState<'farmer' | 'consumer' | null>(null);
  const [error, setError] = useState<string>('');
  const { address, isConnected, connectionStatus } = useWeb3();

  React.useEffect(() => {
    if (isConnected && address && selectedUserType) {
      onConnect(address, selectedUserType);
    }
  }, [isConnected, address, selectedUserType, onConnect]);

  const handleConnect = () => {
    if (!selectedUserType) {
      setError('Please select your user type first');
      return;
    }
    setError('');
  };

  const isConnecting = connectionStatus === 'connecting';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
          <p className="text-green-100">Secure, decentralized access to the AgroChain platform</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">I am a...</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedUserType('farmer')}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  selectedUserType === 'farmer'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50 hover:border-green-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedUserType === 'farmer' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                  }`}>
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-semibold text-gray-900">Farmer</h5>
                    <p className="text-sm text-gray-600">I grow and sell crops</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedUserType('consumer')}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  selectedUserType === 'consumer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedUserType === 'consumer' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-semibold text-gray-900">Consumer</h5>
                    <p className="text-sm text-gray-600">I want to buy verified produce</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Wallet className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium text-amber-800 mb-1">Web3 Wallet Required</h5>
                <p className="text-sm text-amber-700">
                  AgroChain uses Web3 wallets for secure blockchain transactions. 
                  Make sure you have a compatible wallet installed and set up.
                </p>
              </div>
            </div>
          </div>

          <div onClick={handleConnect}>
            <ConnectWallet
              theme="light"
              btnTitle="Connect Wallet"
              modalTitle="Connect to AgroChain"
              modalSize="wide"
              welcomeScreen={{
                title: "Welcome to AgroChain",
                subtitle: "Connect your wallet to access the decentralized agricultural marketplace",
              }}
              className="!w-full !bg-gradient-to-r !from-green-500 !to-blue-500 !text-white !font-semibold !py-4 !px-6 !rounded-2xl hover:!from-green-600 hover:!to-blue-600 disabled:!from-gray-400 disabled:!to-gray-500 disabled:!cursor-not-allowed !transition-all !duration-200"
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #22c55e, #3b82f6)',
                color: 'white',
                fontWeight: '600',
                padding: '16px 24px',
                borderRadius: '16px',
                border: 'none',
                cursor: selectedUserType ? 'pointer' : 'not-allowed',
                opacity: selectedUserType ? 1 : 0.5,
              }}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAuth;