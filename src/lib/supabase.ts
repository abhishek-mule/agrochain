import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not set
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Using mock client.');
    // Return a mock client that won't cause errors
    return {
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
        order: () => Promise.resolve({ data: [], error: null })
      })
    } as any;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Database types
export interface Farmer {
  id: string;
  wallet_address: string;
  name: string;
  location: string;
  farm_name: string;
  certification_status: string;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  farmer_id: string;
  name: string;
  batch_id: string;
  planted_date: string;
  expected_harvest: string;
  actual_harvest?: string;
  status: 'planted' | 'growing' | 'harvesting' | 'harvested';
  nft_token_id?: string;
  ipfs_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  crop_id: string;
  name: string;
  description: string;
  price_inr: number;
  price_crypto: number;
  image_url: string;
  category: string;
  organic: boolean;
  verified: boolean;
  rating: number;
  harvest_date: string;
  created_at: string;
  updated_at: string;
}

export interface Consumer {
  id: string;
  wallet_address: string;
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
}