import React, { createContext, useState, useEffect, useContext } from 'react';
import Home from '../components/UserDetails';
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

  const [name, setname] = useState(() => {
    return localStorage.getItem('name') || '';
  });

const [userid, setUserid] = useState(() => {
    return localStorage.getItem('userid') || '';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || '';
  });

  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('userid', userid);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      localStorage.removeItem('userid');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
    }
  }, [isAuthenticated, username,userid, role, name]);

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
    localStorage.removeItem('userid');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
  
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername, password, setPassword, attempted, setAttempted, 
    userid, setUserid, name, setname, role, setRole, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
