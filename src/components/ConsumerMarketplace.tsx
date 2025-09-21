import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Leaf, 
  Shield, 
  MapPin, 
  Eye,
  Wallet,
  LogOut,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

interface User {
  address: string;
  type: 'farmer' | 'consumer';
  name: string;
}

interface ConsumerMarketplaceProps {
  user: User;
  onLogout: () => void;
  onProductView: (product: any) => void;
}

const ConsumerMarketplace: React.FC<ConsumerMarketplaceProps> = ({ user, onLogout, onProductView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Organic Cherry Tomatoes',
      farmer: 'Green Valley Farm',
      location: 'Maharashtra, India',
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      price: '₹180',
      cryptoPrice: '0.05 POL',
      rating: 4.9,
      verified: true,
      organic: true,
      harvest: '2 days ago',
      category: 'vegetables',
      description: 'Fresh, juicy cherry tomatoes grown using sustainable farming practices.'
    },
    {
      id: 2,
      name: 'Premium Sweet Corn',
      farmer: 'Sunshine Acres',
      location: 'Punjab, India',
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
      price: '₹120',
      cryptoPrice: '0.03 POL',
      rating: 4.8,
      verified: true,
      organic: false,
      harvest: '1 day ago',
      category: 'grains',
      description: 'Sweet, tender corn kernels perfect for your family meals.'
    },
    {
      id: 3,
      name: 'Fresh Bell Peppers Mix',
      farmer: 'Rainbow Gardens',
      location: 'Karnataka, India',
      image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg',
      price: '₹200',
      cryptoPrice: '0.06 POL',
      rating: 4.7,
      verified: true,
      organic: true,
      harvest: '3 hours ago',
      category: 'vegetables',
      description: 'Colorful mix of red, yellow, and green bell peppers.'
    },
    {
      id: 4,
      name: 'Organic Baby Spinach',
      farmer: 'Pure Greens Co.',
      location: 'Himachal Pradesh, India',
      image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
      price: '₹90',
      cryptoPrice: '0.025 POL',
      rating: 4.9,
      verified: true,
      organic: true,
      harvest: '5 hours ago',
      category: 'leafy',
      description: 'Tender baby spinach leaves packed with nutrients.'
    },
    {
      id: 5,
      name: 'Heirloom Carrots',
      farmer: 'Heritage Farms',
      location: 'Rajasthan, India',
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
      price: '₹150',
      cryptoPrice: '0.04 POL',
      rating: 4.6,
      verified: true,
      organic: true,
      harvest: '1 day ago',
      category: 'vegetables',
      description: 'Colorful heirloom carrots with exceptional flavor.'
    },
    {
      id: 6,
      name: 'Fresh Basil Leaves',
      farmer: 'Herb Haven',
      location: 'Kerala, India',
      image: 'https://images.pexels.com/photos/4750279/pexels-photo-4750279.jpeg',
      price: '₹60',
      cryptoPrice: '0.02 POL',
      rating: 5.0,
      verified: true,
      organic: true,
      harvest: '2 hours ago',
      category: 'herbs',
      description: 'Aromatic fresh basil perfect for cooking and garnishing.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Products', count: products.length },
    { id: 'vegetables', label: 'Vegetables', count: products.filter(p => p.category === 'vegetables').length },
    { id: 'leafy', label: 'Leafy Greens', count: products.filter(p => p.category === 'leafy').length },
    { id: 'herbs', label: 'Herbs', count: products.filter(p => p.category === 'herbs').length },
    { id: 'grains', label: 'Grains', count: products.filter(p => p.category === 'grains').length }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AgroChain</h1>
                <p className="text-sm text-gray-500">Marketplace</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 px-3 py-2 rounded-lg flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">Connected</span>
              </div>
              
              <div className="bg-blue-50 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-mono">
                  {user.address.slice(0, 6)}...{user.address.slice(-4)}
                </span>
              </div>
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Fresh, Verified Produce from Local Farmers
            </h2>
            <p className="text-green-100 mb-6">
              Every product is blockchain-verified for authenticity and traceability. 
              Support sustainable farming while enjoying the freshest produce.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                <Shield className="h-5 w-5" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                <Leaf className="h-5 w-5" />
                <span>Farm Fresh</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                <Award className="h-5 w-5" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products or farmers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 text-gray-500" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">150+</p>
            <p className="text-sm text-gray-500">Active Farmers</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
            <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">500+</p>
            <p className="text-sm text-gray-500">Fresh Products</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-500">Verified</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">4.8★</p>
            <p className="text-sm text-gray-500">Avg Rating</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {product.verified && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  )}
                  {product.organic && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
                      <Leaf className="h-3 w-3" />
                      <span>Organic</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-green-600" />
                    <span className="text-gray-700">{product.harvest}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{product.farmer}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{product.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{product.price}</p>
                    <p className="text-sm text-blue-600">{product.cryptoPrice}</p>
                  </div>
                  <button
                    onClick={() => onProductView(product)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerMarketplace;