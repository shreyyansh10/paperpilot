import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('paperpilot_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('paperpilot_token');
      if (savedToken) {
        try {
          const res = await fetch('http://localhost:8000/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('paperpilot_token');
            setToken(null);
          }
        } catch {
          localStorage.removeItem('paperpilot_token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('paperpilot_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('paperpilot_token');
  };

  return (
    <AuthContext.Provider value={{
      user, token, login, logout,
      isAuthenticated: !!token,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;