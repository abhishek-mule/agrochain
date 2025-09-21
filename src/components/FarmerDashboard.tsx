import React, { useState } from 'react';
import { 
  Leaf, 
  Wallet, 
  Plus, 
  Image, 
  MessageCircle, 
  BarChart3, 
  MapPin,
  Calendar,
  Package,
  TrendingUp,
  Send,
  LogOut,
  Shield,
  Coins,
  Upload,
  Loader2
} from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import { useFarmer, useCrops } from '../hooks/useSupabase';
import { uploadToIPFS, uploadJSONToIPFS } from '../lib/ipfs';
import { getNFTContract } from '../lib/web3';

interface User {
  address: string;
  type: 'farmer' | 'consumer';
  name: string;
}

interface FarmerDashboardProps {
  user: User;
  onLogout: () => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCropForm, setShowCropForm] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [cropFormData, setCropFormData] = useState({
    name: '',
    batch_id: '',
    planted_date: '',
    expected_harvest: '',
    description: '',
    category: 'vegetables',
    organic: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const { address, disconnect } = useWeb3();
  const { farmer, loading: farmerLoading, createFarmer } = useFarmer(address);
  const { crops, loading: cropsLoading, createCrop } = useCrops(farmer?.id);
  
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', message: 'Hello! I\'m your AI Farm Assistant. How can I help you optimize your farming today?' }
  ]);

  React.useEffect(() => {
    if (address && !farmer && !farmerLoading) {
      // Auto-create farmer profile if it doesn't exist
      createFarmer({
        wallet_address: address,
        name: user.name,
        location: 'India',
        farm_name: `${user.name}'s Farm`,
        certification_status: 'pending',
      }).catch(console.error);
    }
  }, [address, farmer, farmerLoading, createFarmer, user.name]);

  const handleChatSend = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory([
      ...chatHistory,
      { role: 'user', message: chatMessage },
      { role: 'assistant', message: `Based on your query about "${chatMessage}", I recommend checking soil moisture levels and considering organic fertilizer options for optimal crop growth.` }
    ]);
    setChatMessage('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleCropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer || !selectedImage) return;

    setIsUploading(true);
    try {
      // Upload image to IPFS
      const imageResult = await uploadToIPFS(selectedImage);
      
      // Create crop metadata
      const metadata = {
        name: cropFormData.name,
        description: cropFormData.description,
        image: `https://gateway.pinata.cloud/ipfs/${imageResult.IpfsHash}`,
        attributes: [
          { trait_type: 'Category', value: cropFormData.category },
          { trait_type: 'Organic', value: cropFormData.organic ? 'Yes' : 'No' },
          { trait_type: 'Batch ID', value: cropFormData.batch_id },
          { trait_type: 'Farm', value: farmer.farm_name },
          { trait_type: 'Location', value: farmer.location },
        ],
      };

      // Upload metadata to IPFS
      const metadataResult = await uploadJSONToIPFS(metadata);

      // Create crop in database
      await createCrop({
        farmer_id: farmer.id,
        name: cropFormData.name,
        batch_id: cropFormData.batch_id,
        planted_date: cropFormData.planted_date,
        expected_harvest: cropFormData.expected_harvest,
        status: 'planted',
        ipfs_hash: metadataResult.IpfsHash,
      });

      // Reset form
      setCropFormData({
        name: '',
        batch_id: '',
        planted_date: '',
        expected_harvest: '',
        description: '',
        category: 'vegetables',
        organic: true,
      });
      setSelectedImage(null);
      setShowCropForm(false);
    } catch (error) {
      console.error('Error creating crop:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const nftCollection = [
    { id: 1, name: 'Organic Tomato Batch #001', image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg', price: '0.05 POL', sold: false },
    { id: 2, name: 'Sweet Corn Harvest #002', image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg', price: '0.08 POL', sold: true },
    { id: 3, name: 'Fresh Lettuce Bundle #003', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg', price: '0.03 POL', sold: false },
  ];

  const handleLogout = async () => {
    await disconnect();
    onLogout();
  };

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
                <p className="text-sm text-gray-500">Farmer Dashboard</p>
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
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-2">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'crops', label: 'My Crops', icon: Leaf },
                  { id: 'nfts', label: 'NFT Gallery', icon: Image },
                  { id: 'assistant', label: 'AI Assistant', icon: MessageCircle },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Crops</p>
                        <p className="text-2xl font-bold text-gray-900">{crops.length}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-xl">
                        <Leaf className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">NFTs Minted</p>
                        <p className="text-2xl font-bold text-gray-900">{crops.filter(c => c.nft_token_id).length}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Image className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">0.45 POL</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'NFT Minted', item: 'Organic Tomato Batch #001', time: '2 hours ago', status: 'success' },
                      { action: 'Crop Updated', item: 'Sweet Corn Growth Stage', time: '5 hours ago', status: 'info' },
                      { action: 'NFT Sold', item: 'Lettuce Bundle #003', time: '1 day ago', status: 'success' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'crops' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Crops</h2>
                  <button
                    onClick={() => setShowCropForm(!showCropForm)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Crop</span>
                  </button>
                </div>

                {showCropForm && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Crop</h3>
                    <form onSubmit={handleCropSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                          <input
                            type="text"
                            value={cropFormData.name}
                            onChange={(e) => setCropFormData({...cropFormData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Organic Tomatoes"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
                          <input
                            type="text"
                            value={cropFormData.batch_id}
                            onChange={(e) => setCropFormData({...cropFormData, batch_id: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., TOM-2024-004"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Plant Date</label>
                          <input
                            type="date"
                            value={cropFormData.planted_date}
                            onChange={(e) => setCropFormData({...cropFormData, planted_date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Harvest</label>
                          <input
                            type="date"
                            value={cropFormData.expected_harvest}
                            onChange={(e) => setCropFormData({...cropFormData, expected_harvest: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={cropFormData.category}
                            onChange={(e) => setCropFormData({...cropFormData, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="vegetables">Vegetables</option>
                            <option value="fruits">Fruits</option>
                            <option value="grains">Grains</option>
                            <option value="herbs">Herbs</option>
                            <option value="leafy">Leafy Greens</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Organic</label>
                          <select
                            value={cropFormData.organic ? 'true' : 'false'}
                            onChange={(e) => setCropFormData({...cropFormData, organic: e.target.value === 'true'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={cropFormData.description}
                          onChange={(e) => setCropFormData({...cropFormData, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={3}
                          placeholder="Describe your crop..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Crop Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="crop-image"
                            required
                          />
                          <label htmlFor="crop-image" className="cursor-pointer">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600">
                              {selectedImage ? selectedImage.name : 'Click to upload crop image'}
                            </p>
                          </label>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button 
                          type="submit"
                          disabled={isUploading}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Creating...</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              <span>Create Crop</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCropForm(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid gap-4">
                  {cropsLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
                      <p className="text-gray-500">Loading crops...</p>
                    </div>
                  ) : crops.length === 0 ? (
                    <div className="text-center py-8">
                      <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No crops added yet. Create your first crop!</p>
                    </div>
                  ) : (
                    crops.map((crop) => (
                    <div key={crop.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-xl">
                            <Leaf className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                            <p className="text-sm text-gray-500">Batch: {crop.batch_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Planted</p>
                            <p className="font-medium text-gray-900">{new Date(crop.planted_date).toLocaleDateString()}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            crop.status === 'growing' || crop.status === 'planted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                          </div>
                          {crop.nft_token_id && (
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'nfts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">NFT Gallery</h2>
                  <div className="bg-blue-50 px-3 py-2 rounded-lg flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">Total Value: 0.16 POL</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nftCollection.map((nft) => (
                    <div key={nft.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="aspect-w-1 aspect-h-1">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{nft.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-600">{nft.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            nft.sold ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {nft.sold ? 'Sold' : 'Listed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assistant' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Farm Assistant</h3>
                      <p className="text-sm text-gray-500">Get personalized farming advice</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        chat.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {chat.message}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                      placeholder="Ask about crop management, weather, or farming tips..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleChatSend}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;