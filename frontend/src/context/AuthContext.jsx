import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => { logout(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (employeeId, password) => {
    const res = await api.post('/auth/login', { employeeId, password });
    localStorage.setItem('smc_token', res.data.token);
    localStorage.setItem('smc_user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('smc_token');
    localStorage.removeItem('smc_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const isSuperAdmin = user && user.role === 'superadmin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin, isSuperAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);