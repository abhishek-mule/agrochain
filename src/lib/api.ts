// Backend API Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.agrochain.com';
const API_KEY = import.meta.env.VITE_API_KEY;

class APIClient {
  private baseURL: string;
  private apiKey: string | undefined;

  constructor(baseURL: string, apiKey?: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // ✅ Farmer endpoints
  async createFarmer(data: CreateFarmerRequest): Promise<Farmer> {
    return this.makeRequest<Farmer>('/api/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFarmer(walletAddress: string): Promise<Farmer> {
    return this.makeRequest<Farmer>(`/api/farmers/${walletAddress}`);
  }

  async updateFarmer(walletAddress: string, data: Partial<Farmer>): Promise<Farmer> {
    return this.makeRequest<Farmer>(`/api/farmers/${walletAddress}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ✅ Crop endpoints
  async createCrop(data: CreateCropRequest): Promise<Crop> {
    return this.makeRequest<Crop>('/api/crops', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCrops(farmerId?: string): Promise<Crop[]> {
    const query = farmerId ? `?farmer_id=${farmerId}` : '';
    return this.makeRequest<Crop[]>(`/api/crops${query}`);
  }

  async updateCrop(cropId: string, data: Partial<Crop>): Promise<Crop> {
    return this.makeRequest<Crop>(`/api/crops/${cropId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ✅ Product endpoints
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest<Product[]>(`/api/products${query}`);
  }

  async getProduct(productId: string): Promise<ProductDetail> {
    return this.makeRequest<ProductDetail>(`/api/products/${productId}`);
  }

  // ✅ Order endpoints
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return this.makeRequest<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.makeRequest<Order[]>(`/api/orders?user_id=${userId}`);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return this.makeRequest<Order>(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ✅ Blockchain endpoints
  async mintNFT(data: MintNFTRequest): Promise<MintNFTResponse> {
    return this.makeRequest<MintNFTResponse>('/api/blockchain/mint-nft', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyTransaction(txHash: string): Promise<TransactionStatus> {
    return this.makeRequest<TransactionStatus>(`/api/blockchain/verify/${txHash}`);
  }

  async getSupplyChainEvents(tokenId: string): Promise<SupplyChainEvent[]> {
    return this.makeRequest<SupplyChainEvent[]>(`/api/blockchain/supply-chain/${tokenId}`);
  }

  // ✅ Analytics endpoints
  async getFarmerAnalytics(farmerId: string): Promise<FarmerAnalytics> {
    return this.makeRequest<FarmerAnalytics>(`/api/analytics/farmer/${farmerId}`);
  }

  async getMarketplaceStats(): Promise<MarketplaceStats> {
    return this.makeRequest<MarketplaceStats>('/api/analytics/marketplace');
  }

  // ✅ Payment endpoints
  async createPaymentIntent(data: CreatePaymentRequest): Promise<PaymentIntent> {
    return this.makeRequest<PaymentIntent>('/api/payments/intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmPayment(paymentId: string, txHash?: string): Promise<PaymentConfirmation> {
    return this.makeRequest<PaymentConfirmation>(`/api/payments/${paymentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ txHash }),
    });
  }

  // ✅ File upload endpoints
  async uploadFile(file: File, type: 'crop' | 'profile'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.makeRequest<UploadResponse>('/api/upload', {
      method: 'POST',
      headers: { ...(this.apiKey && { 'X-API-Key': this.apiKey }) },
      body: formData,
    });
  }
}

// Types
export interface CreateFarmerRequest { /* ...same as your code... */ }
export interface CreateCropRequest { /* ... */ }
export interface ProductFilters { /* ... */ }
export interface CreateOrderRequest { /* ... */ }
export interface MintNFTRequest { /* ... */ }
export interface CreatePaymentRequest { /* ... */ }
export interface FarmerAnalytics { /* ... */ }
export interface MarketplaceStats { /* ... */ }
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Create API client instance
export const api = new APIClient(API_BASE_URL, API_KEY);

// React hooks for API integration
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useFarmerQuery = (walletAddress?: string) => { /* ... */ };
export const useCreateFarmer = () => { /* ... */ };
export const useCropsQuery = (farmerId?: string) => { /* ... */ };
export const useCreateCrop = () => { /* ... */ };
export const useProductsQuery = (filters?: ProductFilters) => { /* ... */ };
export const useProductQuery = (productId?: string) => { /* ... */ };
export const useCreateOrder = () => { /* ... */ };
export const useMintNFT = () => { /* ... */ };
