import React, { createContext, useContext, useState, useEffect } from 'react';
import { Gift } from '../types';
import { SAMPLE_GIFTS } from '../data/gifts';
import { api } from '../services/api';

interface GiftsContextType {
  gifts: Gift[];
  isMySqlConnected: boolean;
  isLoading: boolean;
  addGift: (newGift: Omit<Gift, 'id'>) => Promise<Gift>;
  updateGift: (id: string, updates: Partial<Gift>) => Promise<void>;
  deleteGift: (id: string) => Promise<void>;
  resetCatalog: () => Promise<void>;
  getGiftById: (id: string) => Gift | undefined;
  refreshGifts: () => Promise<void>;
}

const GIFTS_STORAGE_KEY = 'giftly_custom_gifts_catalog';

const GiftsContext = createContext<GiftsContextType | undefined>(undefined);

export const GiftsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gifts, setGifts] = useState<Gift[]>(SAMPLE_GIFTS);
  const [isMySqlConnected, setIsMySqlConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchGiftsFromMySQL = async () => {
    try {
      const data = await api.getGifts();
      if (Array.isArray(data) && data.length > 0) {
        setGifts(data);
        setIsMySqlConnected(true);
        try {
          localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(data));
        } catch {}
        return;
      }
    } catch (err) {
      console.warn('MySQL API not responding, falling back to local storage:', err);
      setIsMySqlConnected(false);
    }

    // Local fallback
    try {
      const stored = localStorage.getItem(GIFTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGifts(parsed);
          return;
        }
      }
    } catch {}
    setGifts(SAMPLE_GIFTS);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchGiftsFromMySQL().finally(() => setIsLoading(false));
  }, []);

  const addGift = async (newGiftData: Omit<Gift, 'id'>): Promise<Gift> => {
    try {
      const created = await api.createGift(newGiftData);
      if (created && created.id) {
        setGifts((prev) => [created, ...prev.filter((g) => g.id !== created.id)]);
        setIsMySqlConnected(true);
        try {
          const current = [created, ...gifts.filter((g) => g.id !== created.id)];
          localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(current));
        } catch {}
        return created;
      }
    } catch (e) {
      console.warn('MySQL create failed, using local fallback:', e);
    }

    // Local fallback
    const id = `gift-${Date.now()}`;
    const newGift: Gift = {
      ...newGiftData,
      id,
      rating: newGiftData.rating || 5.0,
      reviewsCount: newGiftData.reviewsCount || 1,
    };
    const updated = [newGift, ...gifts];
    setGifts(updated);
    try {
      localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newGift;
  };

  const updateGift = async (id: string, updates: Partial<Gift>) => {
    try {
      const updatedItem = await api.updateGift(id, updates);
      if (updatedItem && updatedItem.id) {
        setGifts((prev) => prev.map((g) => (g.id === id ? updatedItem : g)));
        setIsMySqlConnected(true);
        return;
      }
    } catch (e) {
      console.warn('MySQL update failed, using local fallback:', e);
    }

    const updated = gifts.map((g) => (g.id === id ? { ...g, ...updates } : g));
    setGifts(updated);
    try {
      localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const deleteGift = async (id: string) => {
    try {
      await api.deleteGift(id);
      setIsMySqlConnected(true);
    } catch (e) {
      console.warn('MySQL delete failed, using local fallback:', e);
    }

    const updated = gifts.filter((g) => g.id !== id);
    setGifts(updated);
    try {
      localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const resetCatalog = async () => {
    try {
      await api.resetCatalog();
      await fetchGiftsFromMySQL();
      setIsMySqlConnected(true);
      return;
    } catch (e) {
      console.warn('MySQL reset failed, using local fallback:', e);
    }

    setGifts(SAMPLE_GIFTS);
    try {
      localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(SAMPLE_GIFTS));
    } catch {}
  };

  const getGiftById = (id: string) => {
    return gifts.find((g) => g.id === id);
  };

  return (
    <GiftsContext.Provider
      value={{
        gifts,
        isMySqlConnected,
        isLoading,
        addGift,
        updateGift,
        deleteGift,
        resetCatalog,
        getGiftById,
        refreshGifts: fetchGiftsFromMySQL,
      }}
    >
      {children}
    </GiftsContext.Provider>
  );
};

export const useGifts = () => {
  const context = useContext(GiftsContext);
  if (!context) {
    throw new Error('useGifts must be used within a GiftsProvider');
  }
  return context;
};
