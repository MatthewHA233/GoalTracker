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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      // Always clear local state on sign out, regardless of error
      set({ user: null, session: null });
    }
  },

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        set({ user: session.user, session });
      } else {
        // If no session, ensure user is logged out
        await supabase.auth.signOut();
        set({ user: null, session: null });
      }
    } catch (error) {
      // Handle initialization errors gracefully
      console.error('Auth initialization error:', error);
      // Ensure user is logged out on error
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } finally {
      set({ loading: false });
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          // Successfully refreshed token
          set({ user: session?.user ?? null, session });
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // Clear state on sign out or user deletion
          set({ user: null, session: null });
        } else {
          // Update state for all other auth events
          set({ user: session?.user ?? null, session });
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
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