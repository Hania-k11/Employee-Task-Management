import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({children}) => {
    
  const protectedd = useContext(AuthContext);

  if (!protectedd.isAuthenticated && !protectedd.attempted) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;