import { useState, useEffect } from 'react';
import { supabase, type Farmer, type Crop, type Product, type Consumer } from '../lib/supabase';

export const useFarmer = (walletAddress?: string) => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchFarmer = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('farmers')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setFarmer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [walletAddress]);

  const createFarmer = async (farmerData: Omit<Farmer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .insert([farmerData])
        .select()
        .single();

      if (error) throw error;
      setFarmer(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { farmer, loading, error, createFarmer };
};

export const useCrops = (farmerId?: string) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!farmerId) return;

    const fetchCrops = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('crops')
          .select('*')
          .eq('farmer_id', farmerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCrops(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [farmerId]);

  const createCrop = async (cropData: Omit<Crop, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .insert([cropData])
        .select()
        .single();

      if (error) throw error;
      setCrops(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { crops, loading, error, createCrop };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            crops (
              *,
              farmers (*)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};