import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Shield,
  Leaf,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Sun,
  QrCode,
  ExternalLink,
  Wallet,
  CreditCard,
  Clock,
  Award,
  LogOut,
  ChevronRight,
  Users,
  Package,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAddress, useContract, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

interface User {
  address: string;
  type: 'farmer' | 'consumer';
  name: string;
}

interface ProductDetailPageProps {
  product: any;
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, user, onBack, onLogout }) => {
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'crypto'>('upi');
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string>('');
  
  const address = useAddress();

  const traceabilityStory = `Our ${product.name} journey began 90 days ago when premium seeds were planted in rich, organic soil at ${product.farmer}. Located in ${product.location}, this farm follows sustainable practices with regular soil testing and natural pest management.

The crops were carefully nurtured with optimal irrigation schedules and received abundant sunlight. Weather monitoring showed ideal growing conditions with temperatures ranging 22-28°C and adequate rainfall. 

Harvested at peak ripeness ${product.harvest}, each produce item underwent quality checks and was immediately processed for freshness. The entire process is documented on the blockchain, ensuring complete transparency from seed to your table.`;

  const onChainData = [
    { label: 'Harvest Date', value: '2024-01-20', verified: true },
    { label: 'Batch ID', value: 'TOM-2024-001', verified: true },
    { label: 'Farm Location', value: product.location, verified: true },
    { label: 'Organic Certification', value: 'NPOP-2024-001', verified: true },
    { label: 'Quality Grade', value: 'Premium A+', verified: true },
    { label: 'Storage Temperature', value: '4-6°C', verified: true }
  ];

  const farmingTimeline = [
    { date: '2023-11-01', event: 'Seed Planting', detail: 'Organic seeds planted in prepared soil' },
    { date: '2023-11-15', event: 'First Sprouts', detail: 'Healthy germination rate of 98%' },
    { date: '2023-12-01', event: 'Transplanting', detail: 'Seedlings moved to main growing area' },
    { date: '2023-12-20', event: 'Flowering Stage', detail: 'Plants showing strong flower development' },
    { date: '2024-01-10', event: 'Fruit Formation', detail: 'Early fruit development observed' },
    { date: '2024-01-20', event: 'Harvest Ready', detail: 'Peak ripeness achieved, harvest completed' }
  ];

  const handleMetaMaskPayment = async () => {
    if (!address) {
      setPaymentError('Please connect your wallet first');
      setPaymentStatus('error');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStatus('processing');
    setPaymentError('');

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Calculate total amount in crypto
      const cryptoAmount = parseFloat(product.cryptoPrice.split(' ')[0]) * quantity;
      const amountInWei = ethers.utils.parseEther(cryptoAmount.toString());

      // Get the current provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Simulate farmer's wallet address (in real app, this would come from the product data)
      const farmerAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A'; // Example address

      // Create transaction
      const transaction = {
        to: farmerAddress,
        value: amountInWei,
        gasLimit: ethers.utils.hexlify(21000), // Standard gas limit for ETH transfer
      };

      // Request transaction
      const txResponse = await signer.sendTransaction(transaction);
      
      // Wait for transaction confirmation
      const receipt = await txResponse.wait();
      
      if (receipt.status === 1) {
        setPaymentStatus('success');
        
        // Here you would typically:
        // 1. Update the order status in your database
        // 2. Send confirmation emails
        // 3. Update inventory
        // 4. Create delivery tracking
        
        console.log('Payment successful!', {
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        });
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      
      // Handle specific error types
      if (error.code === 4001) {
        setPaymentError('Transaction was rejected by user');
      } else if (error.code === -32603) {
        setPaymentError('Insufficient funds for transaction');
      } else if (error.message?.includes('MetaMask')) {
        setPaymentError(error.message);
      } else {
        setPaymentError('Payment failed. Please try again.');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUPIPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentStatus('processing');
    setPaymentError('');

    try {
      // Simulate UPI payment process
      // In a real application, you would integrate with a payment gateway
      // that supports UPI and can convert fiat to crypto
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Simulate successful payment
      setPaymentStatus('success');
      
      console.log('UPI Payment successful!', {
        amount: `₹${parseInt(product.price.replace('₹', '')) * quantity + 10}`,
        quantity,
        product: product.name
      });
      
    } catch (error) {
      setPaymentStatus('error');
      setPaymentError('UPI payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetPaymentStatus = () => {
    setPaymentStatus('idle');
    setPaymentError('');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AgroChain</h1>
                <p className="text-sm text-gray-500">Product Details</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Image and Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-6 left-6 flex space-x-2">
                  {product.verified && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>Blockchain Verified</span>
                    </div>
                  )}
                  {product.organic && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1">
                      <Leaf className="h-4 w-4" />
                      <span>Organic Certified</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Harvested {product.harvest}</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                    <span className="text-xl font-semibold text-gray-900">{product.rating}</span>
                    <span className="text-gray-500">(47 reviews)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 font-medium">{product.farmer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{product.location}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {product.description} These premium quality produce items are grown using sustainable farming practices with complete transparency and blockchain verification.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-700">100% Organic</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-blue-700">Verified Origin</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold text-purple-700">Premium Grade</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <Package className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-semibold text-orange-700">Fresh Harvest</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI-Generated Traceability Story */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Farm to Fork Journey</h2>
                  <p className="text-gray-500">AI-generated traceability story</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{traceabilityStory}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Growing Timeline</h3>
                <div className="space-y-4">
                  {farmingTimeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-medium text-gray-900">{item.event}</span>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-gray-600">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* On-Chain Data */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Blockchain Verification</h2>
                  <p className="text-gray-500">Immutable on-chain data</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {onChainData.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">{item.label}</span>
                      {item.verified && (
                        <div className="bg-green-100 p-1 rounded-full">
                          <Shield className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">View on Blockchain Explorer</p>
                    <p className="text-sm text-blue-700">Transaction Hash: 0x1a2b3c4d5e6f7890...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Farm Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Farm Location</h2>
                  <p className="text-gray-500">Interactive farm mapping</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-8 text-center">
                <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.farmer}</h3>
                <p className="text-gray-600 mb-4">{product.location}</p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="bg-white rounded-lg p-3">
                    <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-1" />
                    <p className="text-sm font-medium">25°C</p>
                    <p className="text-xs text-gray-500">Avg Temp</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-sm font-medium">750mm</p>
                    <p className="text-xs text-gray-500">Rainfall</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <Sun className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                    <p className="text-sm font-medium">8.5hrs</p>
                    <p className="text-xs text-gray-500">Sunlight</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Purchase Section */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="bg-gray-100 w-32 h-32 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Access QR</h3>
                <p className="text-sm text-gray-500">Scan to view product details</p>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                  <span className="text-lg text-blue-600 font-semibold">{product.cryptoPrice}</span>
                </div>
                <p className="text-sm text-gray-500">Per kg • Free delivery above ₹500</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold text-gray-900 w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">kg</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedPayment('upi')}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === 'upi'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedPayment === 'upi' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">UPI Payment</p>
                        <p className="text-sm text-gray-600">Instant fiat-to-crypto bridge</p>
                      </div>
                      <div className="ml-auto">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedPayment('crypto')}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === 'crypto'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedPayment === 'crypto' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">MetaMask</p>
                        <p className="text-sm text-gray-600">Direct crypto payment</p>
                      </div>
                      <div className="ml-auto">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({quantity}kg)</span>
                    <span className="text-gray-900">₹{parseInt(product.price.replace('₹', '')) * quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform fee</span>
                    <span className="text-gray-900">₹10</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <div className="text-right">
                      <div>₹{parseInt(product.price.replace('₹', '')) * quantity + 10}</div>
                      <div className="text-sm text-blue-600">{(parseFloat(product.cryptoPrice.split(' ')[0]) * quantity).toFixed(3)} POL</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              {paymentStatus === 'success' ? (
                <div className="w-full bg-green-100 border border-green-200 text-green-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>Payment Successful!</span>
                </div>
              ) : paymentStatus === 'error' ? (
                <div className="space-y-3">
                  <div className="w-full bg-red-100 border border-red-200 text-red-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3">
                    <AlertCircle className="h-5 w-5" />
                    <span>Payment Failed</span>
                  </div>
                  {paymentError && (
                    <p className="text-sm text-red-600 text-center">{paymentError}</p>
                  )}
                  <button
                    onClick={resetPaymentStatus}
                    className="w-full bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <button
                  onClick={selectedPayment === 'upi' ? handleUPIPayment : handleMetaMaskPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : selectedPayment === 'upi' ? (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Pay with UPI</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" />
                      <span>Pay with MetaMask</span>
                    </>
                  )}
                </button>
              )}

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secure payment • 30-day return policy • Quality guaranteed
                </p>
              </div>
              
              {paymentStatus === 'processing' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    <div>
                      <p className="font-medium text-blue-900">
                        {selectedPayment === 'crypto' ? 'Waiting for MetaMask confirmation...' : 'Processing UPI payment...'}
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedPayment === 'crypto' 
                          ? 'Please confirm the transaction in your MetaMask wallet'
                          : 'Please complete the payment in your UPI app'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900 mb-1">Order Confirmed!</p>
                    <p className="text-sm text-green-700">
                      Your order will be delivered within 2-3 business days
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Why Choose AgroChain?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Blockchain verified authenticity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Direct from certified farmers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Premium quality assurance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Fresh harvest guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;