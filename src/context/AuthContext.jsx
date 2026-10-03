import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, AUTH_TOKEN_KEY } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (username, password) => {
    const result = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem(AUTH_TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
    window.location.hash = '#/admin/login';
  }, []);

  useEffect(() => {
    let active = true;
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return () => { active = false; };
    }
    apiFetch('/api/auth/me')
      .then((currentUser) => {
        if (active) {
          setToken(storedToken);
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const clearExpiredSession = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:expired', clearExpiredSession);
    return () => window.removeEventListener('auth:expired', clearExpiredSession);
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    let expirationTimer;
    try {
      const encodedPayload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
      if (!encodedPayload) throw new Error('Invalid token payload.');
      const payload = JSON.parse(window.atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')));
      if (!Number.isFinite(payload.exp)) throw new Error('Token expiration is missing.');
      expirationTimer = window.setTimeout(logout, Math.max(0, payload.exp * 1000 - Date.now()));
    } catch {
      logout();
    }
    return () => window.clearTimeout(expirationTimer);
  }, [token, logout]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
    isSuperAdmin: user?.role === 'superadmin',
  }), [user, token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
