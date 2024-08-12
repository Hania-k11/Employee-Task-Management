import React, { createContext, useState, useEffect, useContext } from 'react';
import Home from '../components/Home';
import Unauthorized from '../components/Unauthorized';

export const AuthContext = createContext(null);

export const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedData = localStorage.getItem('isAuthenticated');
    return storedData === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
    }
  }, [isAuthenticated, username]);

  useEffect(() => {
    
    if (!isAuthenticated) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
    }
  }, []);

 

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setAttempted(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername, password, setPassword, attempted, setAttempted, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
