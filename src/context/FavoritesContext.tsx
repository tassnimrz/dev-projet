import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { authStorage } from '../services/supabase';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (giftId: string) => boolean;
  toggleFavorite: (giftId: string) => Promise<void>;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user, isMySqlConnected } = useAuth();

  useEffect(() => {
    async function loadFavorites() {
      if (user && isMySqlConnected) {
        try {
          const list = await api.getFavorites(user.id);
          if (Array.isArray(list)) {
            setFavorites(list);
            return;
          }
        } catch (e) {
          console.warn('MySQL favorites fetch failed:', e);
        }
      }

      // Default local storage
      const stored = authStorage.getStoredFavorites();
      setFavorites(stored);
    }

    loadFavorites();
  }, [user, isMySqlConnected]);

  const toggleFavorite = async (giftId: string) => {
    const exists = favorites.includes(giftId);
    const updated = exists ? favorites.filter((id) => id !== giftId) : [...favorites, giftId];
    setFavorites(updated);
    authStorage.saveStoredFavorites(updated);

    if (user && isMySqlConnected) {
      try {
        await api.toggleFavorite(user.id, giftId);
      } catch (err) {
        console.error('Failed to sync favorite with MySQL:', err);
      }
    }
  };

  const isFavorite = (giftId: string) => favorites.includes(giftId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
