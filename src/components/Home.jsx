import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/userdetails');
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleChangeStatus = async (userid) => {
        try {
            const response = await axios.post('http://localhost:3000/api/toggleUserActivity', { userid });
            alert(response.data.message || 'No message returned from server');
            
            // Update the user's Activity status in the local state
            setUsers(prevUsers => prevUsers.map(user => 
                user.userID === userid 
                    ? { ...user, Activity: user.Activity === 'active' ? 'inactive' : 'active' } 
                    : user
            ));
        } catch (error) {
            alert('Failed to change status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">User Details</h1>
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-4 text-left">User Name</th>
                            <th className="py-3 px-4 text-left">Password</th>
                            <th className="py-3 px-4 text-left">Gender</th>
                            <th className="py-3 px-4 text-left">Contact</th>
                            <th className="py-3 px-4 text-left">Age</th>
                            <th className="py-3 px-4 text-left">Activity</th>
                            <th className="py-3 px-4 text-left">Employee Code</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Role Name</th>
                            <th className="py-3 px-4 text-left">Role ID</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {users.map((user, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-4 text-left">{user.userName}</td>
                                <td className="py-3 px-4 text-left">{user.userPassword}</td>
                                <td className="py-3 px-4 text-left">{user.gender}</td>
                                <td className="py-3 px-4 text-left">{user.contact}</td>
                                <td className="py-3 px-4 text-left">{user.age}</td>
                                <td className="py-3 px-4 text-left">{user.Activity}</td>
                                <td className="py-3 px-4 text-left">{user.EmployeeCode}</td>
                                <td className="py-3 px-4 text-left">{user.Email}</td>
                                <td className="py-3 px-4 text-left">{user.rolename}</td>
                                <td className="py-3 px-4 text-left">{user.roleid}</td>
                                <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleChangeStatus(user.userID)} 
                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                                            Change Status
                                        </button>
                                        <button className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200">
                                            View Log
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Home;
