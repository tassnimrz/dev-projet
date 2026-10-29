import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage fallback keys
const DEMO_USER_KEY = 'giftly_demo_user';
const FAVORITES_KEY = 'giftly_favorites_list';

// SQL Schema for Supabase setup
export const SUPABASE_SETUP_SQL = `-- GIFTLY Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor:

-- 1. Create Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create User Favorites table
create table if not exists public.user_favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  gift_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, gift_id)
);

-- 3. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_favorites enable row level security;

create policy "Users can view own profile" 
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

create policy "Users can view own favorites" 
  on public.user_favorites for select using (auth.uid() = user_id);

create policy "Users can insert own favorites" 
  on public.user_favorites for insert with check (auth.uid() = user_id);

create policy "Users can delete own favorites" 
  on public.user_favorites for delete using (auth.uid() = user_id);
`;

export const authStorage = {
  getDemoUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(DEMO_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setDemoUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
    }
  },
  getStoredFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : ['gift-1', 'gift-4']; // Initial lovely starter favorites
    } catch {
      return ['gift-1', 'gift-4'];
    }
  },
  saveStoredFavorites(favs: string[]) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
};
