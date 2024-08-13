import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Home from './UserDetails';
import Unauthorized from './Unauthorized';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDetails from './UserDetails';

const LoginForm = () => {
    const mystate = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(''); 

    const handleClick = async (e) => {
        e.preventDefault(); 
        console.log('Login button clicked');
        console.log('Username:', mystate.username);
        console.log('Password:', mystate.password);
         
        mystate.setAttempted(true);

        
        setLoading(true);
        setError('');

        const encodedEmail = encodeURIComponent(mystate.username);
        const encodedPassword = encodeURIComponent(mystate.password);
        
        
        const url = `http://localhost:3000/api/validateUser?email=${encodedEmail}&password=${encodedPassword}`;

        try {
            const response = await axios.get(url); 

            const data = response.data;

            if (data.success) {
                mystate.setIsAuthenticated(true);
                console.log('Authentication successful');
            } else {
                mystate.setIsAuthenticated(false);
                console.log('Authentication failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error validating user. Please try again.');
            mystate.setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (mystate.attempted) {
        if (mystate.isAuthenticated) {
            return <UserDetails />;
        } else {
            return <Unauthorized />;
        }
    }

    const handleSignupClick = () => {
        navigate('/create-user'); 
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-slate-300">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={mystate.username}
                                onChange={(e) => mystate.setUsername(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={mystate.password}
                                onChange={(e) => mystate.setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={handleClick}
                            className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        <div className="mt-4 text-center text-gray-700">
                            New user? <span className="font-medium text-blue-500" onClick={handleSignupClick}>Sign up to continue</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleSignupClick}
                            className="w-full mt-4 bg-slate-400 text-white font-medium py-3 rounded-lg hover:bg-gray-600 transition duration-300"
                        >
                            Signup
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
