import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: () => {},
  logout: () => {},
  setUser: () => {},
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
  const res = await api.get('/api/auth/me');
      setUser(res.data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const logout = useCallback(() => {
    // Simple logout: clear cookie by expiring it (needs backend endpoint ideally)
    // Fallback: overwrite cookie via client (works if same site) & clear state
    document.cookie = 'token=; Max-Age=0; path=/;';
    setUser(null);
  }, []);

  const value = { user, loading, refresh: fetchMe, logout, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line
export function useAuth() { return useContext(AuthContext); }

export default AuthProvider;
