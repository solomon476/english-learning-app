import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserProfile } from '../types';
import { ApiService } from './api';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  isGuest?: boolean;
}

const LOCAL_SESSION_KEY = 'swl_auth_session_v1';
const LOCAL_ACCOUNTS_KEY = 'swl_registered_accounts_v1';

export class AuthService {
  // Listeners for auth state changes
  private static listeners: Array<(user: AuthUser | null) => void> = [];

  public static onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Learner',
            isGuest: false
          };
          callback(authUser);
        } else {
          callback(null);
        }
      });

      return () => {
        subscription.unsubscribe();
        this.listeners = this.listeners.filter((l) => l !== callback);
      };
    }

    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private static notifyListeners(user: AuthUser | null) {
    this.listeners.forEach((callback) => callback(user));
  }

  // Get current active session user
  public static async getCurrentUser(): Promise<AuthUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          return {
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Learner',
            isGuest: false
          };
        }
      } catch (err) {
        console.warn('Supabase auth session check failed:', err);
      }
    }

    // Local persistent session fallback
    const local = localStorage.getItem(LOCAL_SESSION_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    }

    return null;
  }

  // Register a new account
  public static async signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            display_name: cleanName
          }
        }
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('Failed to create account.');

      const authUser: AuthUser = {
        id: data.user.id,
        email: cleanEmail,
        displayName: cleanName,
        isGuest: false
      };

      await this.syncGuestProgressToAccount(authUser);
      this.notifyListeners(authUser);
      return authUser;
    }

    // Local fallback for offline/development mode
    const accountsRaw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const accounts: Record<string, { id: string; email: string; pass: string; displayName: string }> = 
      accountsRaw ? JSON.parse(accountsRaw) : {};

    if (accounts[cleanEmail]) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newId = `usr-${Date.now()}`;
    accounts[cleanEmail] = {
      id: newId,
      email: cleanEmail,
      pass: password,
      displayName: cleanName
    };
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));

    const authUser: AuthUser = {
      id: newId,
      email: cleanEmail,
      displayName: cleanName,
      isGuest: false
    };

    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(authUser));
    await this.syncGuestProgressToAccount(authUser);
    this.notifyListeners(authUser);
    return authUser;
  }

  // Sign In with existing credentials
  public static async signIn(email: string, password: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('Invalid credentials.');

      const authUser: AuthUser = {
        id: data.user.id,
        email: cleanEmail,
        displayName: data.user.user_metadata?.display_name || cleanEmail.split('@')[0],
        isGuest: false
      };

      await this.syncGuestProgressToAccount(authUser);
      this.notifyListeners(authUser);
      return authUser;
    }

    // Local fallback
    const accountsRaw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const accounts: Record<string, { id: string; email: string; pass: string; displayName: string }> = 
      accountsRaw ? JSON.parse(accountsRaw) : {};

    const account = accounts[cleanEmail];
    if (!account || account.pass !== password) {
      throw new Error('Incorrect email or password.');
    }

    const authUser: AuthUser = {
      id: account.id,
      email: account.email,
      displayName: account.displayName,
      isGuest: false
    };

    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(authUser));
    await this.syncGuestProgressToAccount(authUser);
    this.notifyListeners(authUser);
    return authUser;
  }

  // Password Recovery Request
  public static async resetPassword(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/#reset-password`
      });
      if (error) throw new Error(error.message);
      return;
    }

    // Local fallback
    const accountsRaw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const accounts: Record<string, { id: string; email: string; pass: string; displayName: string }> = 
      accountsRaw ? JSON.parse(accountsRaw) : {};

    if (!accounts[cleanEmail]) {
      throw new Error('No account found with this email.');
    }
  }

  // Sign Out
  public static async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    this.notifyListeners(null);
  }

  // Phase 3 Link guest learning data to the authenticated account
  public static async syncGuestProgressToAccount(user: AuthUser): Promise<void> {
    try {
      const profile = await ApiService.getUserProfile();
      const updatedProfile: UserProfile = {
        ...profile,
        id: user.id,
        displayName: user.displayName,
        email: user.email
      };
      await ApiService.updateUserProfile(updatedProfile);
    } catch (err) {
      console.warn('Failed to link guest progress to account:', err);
    }
  }
}
