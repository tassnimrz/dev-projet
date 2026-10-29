import { Gift, UserProfile } from '../types';

const API_BASE = '/api';

// Helper to pass authenticated admin credentials for database modifications
function getAuthHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem('giftly_demo_user');
    if (raw) {
      const u = JSON.parse(raw);
      return {
        'x-user-role': u.role || 'user',
        'x-user-email': u.email || '',
        'x-user-id': u.id || '',
      };
    }
  } catch {}
  return {};
}

export const api = {
  // Health
  async checkHealth(): Promise<{ status: string; database?: string; connected: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
      return { status: 'error', connected: false };
    } catch {
      return { status: 'offline', connected: false };
    }
  },

  // Gifts
  async getGifts(): Promise<Gift[]> {
    const res = await fetch(`${API_BASE}/gifts`);
    if (!res.ok) throw new Error('Failed to fetch gifts from MySQL');
    return await res.json();
  },

  async getGiftById(id: string): Promise<Gift> {
    const res = await fetch(`${API_BASE}/gifts/${id}`);
    if (!res.ok) throw new Error('Gift not found in MySQL');
    return await res.json();
  },

  async createGift(giftData: Partial<Gift>): Promise<Gift> {
    const res = await fetch(`${API_BASE}/gifts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(giftData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to create gift in MySQL');
    }
    return await res.json();
  },

  async updateGift(id: string, updates: Partial<Gift>): Promise<Gift> {
    const res = await fetch(`${API_BASE}/gifts/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update gift in MySQL');
    }
    return await res.json();
  },

  async deleteGift(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/gifts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to delete gift from MySQL');
    }
    return await res.json();
  },

  async resetCatalog(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/reset-catalog`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to reset catalog');
    }
    return await res.json();
  },

  // Auth
  async login(email: string, password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erreur de connexion' };
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Serveur indisponible' };
    }
  },

  async register(email: string, password: string, fullName: string, role = 'user'): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erreur d\'inscription' };
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Serveur indisponible' };
    }
  },

  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) return [];
    return await res.json();
  },

  async createUser(userData: { email: string; fullName: string; password?: string; role?: 'admin' | 'user' }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  },

  async updateUserRole(userId: string, role: 'admin' | 'user'): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return await res.json();
  },

  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  },

  // Favorites
  async getFavorites(userId: string): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/favorites/${userId}`);
      if (res.ok) return await res.json();
      return [];
    } catch {
      return [];
    }
  },

  async toggleFavorite(userId: string, giftId: string): Promise<{ favorited: boolean }> {
    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, giftId }),
    });
    return await res.json();
  },
};
