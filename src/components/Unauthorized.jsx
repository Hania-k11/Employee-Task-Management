import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';



const Unauthorized = () => {

    const myauth= useContext(AuthContext);
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
      <p className="text-gray-700 mt-4">{myauth.username} is not authorized</p>
    </div>
  </div>
  )
}

export default Unauthorized