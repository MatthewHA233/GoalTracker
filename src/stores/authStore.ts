import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
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
  session: null,
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
    set({ user: null, session: null });
  },
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        set({ user: session.user, session });
      } else {
        set({ user: null, session: null });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, session: null });
    } finally {
      set({ loading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ 
        user: session?.user ?? null,
        session: session
      });
    });
  },
  updateProfile: async ({ username }) => {
    const { error } = await supabase.auth.updateUser({
      data: { username }
    });
    if (error) throw error;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      set({ user: session.user, session });
    }
  },
  updatePassword: async (currentPassword: string, newPassword: string) => {
    // First verify current password
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) throw new Error('未登录');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: currentPassword
    });
    if (signInError) throw new Error('当前密码错误');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },
}));