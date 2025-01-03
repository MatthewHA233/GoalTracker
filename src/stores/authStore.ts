import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (updates: { username: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signUp: async (email: string, password: string, username?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });
    if (error) throw error;
  },
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  initialize: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    set({ user, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });
  },
  updateProfile: async ({ username }) => {
    const { error } = await supabase.auth.updateUser({
      data: { username }
    });
    if (error) throw error;
    
    const { data: { user } } = await supabase.auth.getUser();
    set({ user });
  },
  updatePassword: async (currentPassword: string, newPassword: string) => {
    // 先验证当前密码
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: useAuthStore.getState().user?.email || '',
      password: currentPassword
    });
    if (signInError) throw new Error('当前密码错误');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },
}));