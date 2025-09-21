import React, { useState, useEffect } from 'react';
import { Leaf, Shield, Users, Wallet } from 'lucide-react';
import WalletAuth from './components/WalletAuth';
import FarmerDashboard from './components/FarmerDashboard';
import ConsumerMarketplace from './components/ConsumerMarketplace';
import ProductDetailPage from './components/ProductDetailPage';

interface User {
  address: string;
  type: 'farmer' | 'consumer';
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'auth' | 'farmer' | 'marketplace' | 'product'>('auth');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    // Check if user is already connected
    const savedUser = localStorage.getItem('agrochain-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(JSON.parse(savedUser).type === 'farmer' ? 'farmer' : 'marketplace');
    }
  }, []);

  const handleWalletConnect = (address: string, userType: 'farmer' | 'consumer') => {
    const newUser = {
      address,
      type: userType,
      name: userType === 'farmer' ? 'Farmer' : 'Consumer'
    };
    setUser(newUser);
    localStorage.setItem('agrochain-user', JSON.stringify(newUser));
    setCurrentView(userType === 'farmer' ? 'farmer' : 'marketplace');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('agrochain-user');
    setCurrentView('auth');
  };

  const handleProductView = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const handleBackToMarketplace = () => {
    setCurrentView('marketplace');
    setSelectedProduct(null);
  };

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AgroChain</h1>
                  <p className="text-sm text-gray-600">Farm to Fork Transparency</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-green-600">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Blockchain Secured</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Connecting Farms to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500"> Tables</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience complete transparency in your food supply chain. From seed to plate, 
              every step is recorded on the blockchain for ultimate trust and traceability.
            </p>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Farmers</h3>
                <p className="text-gray-600">Create NFTs of your crops, track production, and connect directly with consumers</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Consumers</h3>
                <p className="text-gray-600">Trace your food's journey, verify authenticity, and support sustainable farming</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Security</h3>
                <p className="text-gray-600">Immutable records, smart contracts, and decentralized verification</p>
              </div>
            </div>
          </div>

          <WalletAuth onConnect={handleWalletConnect} />
        </main>
      </div>
    );
  }

  if (currentView === 'product' && selectedProduct) {
    return (
      <ProductDetailPage 
        product={selectedProduct} 
        user={user!} 
        onBack={handleBackToMarketplace}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'farmer' && user?.type === 'farmer') {
    return <FarmerDashboard user={user} onLogout={handleLogout} />;
  }

  if (currentView === 'marketplace' && user?.type === 'consumer') {
    return (
      <ConsumerMarketplace 
        user={user} 
        onLogout={handleLogout}
        onProductView={handleProductView}
      />
    );
  }

  return null;
}

export default App;