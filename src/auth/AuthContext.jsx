// ------------------------------------------------------------
// AuthContext.jsx
// Provides global authentication state and helpers to the app.
// Wrap your app with <AuthProvider> and consume via useAuth().
// ------------------------------------------------------------

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiV1 } from '../api/index';

// ── Storage key constants (single source of truth) ───────────
const ACCESS_TOKEN_KEY  = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// ── Context creation ──────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading]         = useState(true); // true while restoring session

  // ── Helper: persist tokens to localStorage and state ──────
  const persistTokens = useCallback((access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    setAccessToken(access);
  }, []);

  // ── Helper: wipe all auth data from storage and state ─────
  const clearAuth = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  // ── Session restore on mount ───────────────────────────────
  // Attempts to re-hydrate the user from a stored access token.
  // Falls back to a token refresh if the access token is expired.
  useEffect(() => {
    const restoreSession = async () => {
      const storedAccess  = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!storedAccess) {
        // No token at all – nothing to restore
        setLoading(false);
        return;
      }

      try {
        // Try fetching the current user with the stored access token.
        // The request interceptor will attach it as a Bearer header.
        const { data } = await apiV1.get('/users/me/');
        setUser(data);
        setAccessToken(storedAccess);
      } catch (err) {
        // Access token rejected (likely 401) – attempt a silent refresh
        if (err?.response?.status === 401 && storedRefresh) {
          try {
            const { data } = await apiV1.post('/auth/refresh/', {
              refresh: storedRefresh,
            });

            // Persist the new tokens
            persistTokens(data.access, data.refresh ?? null);

            // Fetch user profile with the fresh token
            const { data: me } = await apiV1.get('/users/me/');
            setUser(me);
          } catch {
            // Refresh also failed – force the user to log in again
            clearAuth();
          }
        } else {
          // Non-401 error or no refresh token available
          clearAuth();
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── login(username_or_email, password) ────────────────────
  // Calls POST /auth/login/, stores tokens, and sets user state.
  const login = useCallback(async (username_or_email, password) => {
    const { data } = await apiV1.post('/auth/login/', {
      username_or_email,
      password,
    });

    // Persist tokens so the interceptor can use them immediately
    persistTokens(data.access, data.refresh);
    setUser(data.user);

    return data.user; // caller can use role for redirect
  }, [persistTokens]);

  // ── logout() ──────────────────────────────────────────────
  // Notifies the backend then clears all local auth state.
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      // Best-effort: tell the server to invalidate the refresh token.
      // We don't await failure – local state is cleared regardless.
      await apiV1.post('/auth/logout/', { refresh_token: refreshToken });
    } catch {
      // Silently ignore – we're logging out anyway
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  // ── updateUser(data) ──────────────────────────────────────
  // Merges partial data into the current user state.
  // Call this after a successful PATCH /users/me/ to keep context in sync.
  const updateUser = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  // ── Context value ─────────────────────────────────────────
  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── useAuth hook ──────────────────────────────────────────────
// Throws if used outside an <AuthProvider>.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
