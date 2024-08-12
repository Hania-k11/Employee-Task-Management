import React from 'react';
import { Link } from 'react-router-dom';

const NoPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Page Not Found</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back 
      </Link>
    </div>
  );
};

export default NoPage;
