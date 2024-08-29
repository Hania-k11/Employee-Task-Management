import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import CreateUser from './CreateUser';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logs from './Logs'; 
import Supervisor from './Supervisor';
import AgentAdmin from './AgentAdmin'; 
import AgentSupervisor from './AgentSupervisor'; 
import Agent from './Agent'; 

const UserDetails = () => {
    const home = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isLogsOpen, setIsLogsOpen] = useState(false); 
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('UserDetails');

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
        if (home.role !== 'Admin') return;

        console.log('Roleleeee:', home.role);
        console.log('Password:', home.password);
        const currentRoute = location.pathname.split('/').pop();
        try {
            const response = await axios.post('http://localhost:3000/api/toggleUserActivityLog', { 
                userid, 
                updatedBy: home.username, 
                key: currentRoute 
            });
            alert(response.data.message || 'No message returned from server');
            
            setUsers(prevUsers => prevUsers.map(user => 
                user.userID === userid 
                    ? { ...user, Activity: user.Activity === 'active' ? 'inactive' : 'active' } 
                    : user
            ));
        } catch (error) {
            alert('Failed to change status');
        }
    };

    const handleViewLog = async (userid) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/getUserLogs/${userid}`);
            setLogs(response.data);
            setIsLogsOpen(true); 
        } catch (error) {
            alert('Failed to retrieve logs');
        }
    };

    const closeLogs = () => {
        setIsLogsOpen(false);
        setLogs([]);
    };

    const renderTable = (includeActions) => (
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
                    {includeActions && (
                        <th className="py-3 px-4 text-left">Actions</th>
                    )}
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
                        {includeActions && (
                            <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handleChangeStatus(user.userID)} 
                                        className={`px-3 py-2 ${home.role === 'Admin' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-500 text-gray-200 cursor-not-allowed'} rounded transition duration-200`}
                                        disabled={home.role !== 'Admin'}
                                    >
                                        Change Status
                                    </button>
                                    <button 
                                        onClick={() => handleViewLog(user.userID)} 
                                        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200">
                                        View Log
                                    </button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'UserDetails':
                return (
                    <div>
                        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">User Details</h1>
                        {renderTable(true)}
                    </div>
                );
            case 'RegisterUser':
                return (
                    <div>
                        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Register User</h1>
                        <CreateUser /> 
                    </div>
                );
            case 'Report':
                return (
                    <div>
                        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Report</h1>
                        {renderTable(false)}
                    </div>
                );
            case 'Supervisor':
                return (
                    <div>
                        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Supervisor</h1>
                        <Supervisor /> 
                    </div>
                );
            case 'Agent':
                if (home.role === 'Admin') {
                    return (
                        <div>
                            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Agent - Admin View</h1>
                            <AgentAdmin /> 
                        </div>
                    );
                } else if (home.role === 'Supervisor') {
                    return (
                        <div>
                            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Agent - Supervisor View</h1>
                            <AgentSupervisor /> 
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Agent</h1>
                            <Agent /> {/* Render default Agent component */}
                        </div>
                    );
                }
            default:
                return null;
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
                <div className="tabs mb-6 flex justify-center">
                    <button 
                        className={`px-6 py-3 rounded-t-lg border-b-2 ${activeTab === 'UserDetails' ? 'bg-white text-blue-600 border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-200'} transition duration-200`}
                        onClick={() => setActiveTab('UserDetails')}
                    >
                        User Details
                    </button>
                    <button 
                        className={`px-6 py-3 rounded-t-lg border-b-2 ${activeTab === 'RegisterUser' ? 'bg-white text-blue-600 border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-200'} transition duration-200`}
                        onClick={() => setActiveTab('RegisterUser')}
                    >
                        Register User
                    </button>
                    <button 
                        className={`px-6 py-3 rounded-t-lg border-b-2 ${activeTab === 'Report' ? 'bg-white text-blue-600 border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-200'} transition duration-200`}
                        onClick={() => setActiveTab('Report')}
                    >
                        Report
                    </button>
                    <button 
                        className={`px-6 py-3 rounded-t-lg border-b-2 ${activeTab === 'Supervisor' ? 'bg-white text-blue-600 border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-200'} transition duration-200`}
                        onClick={() => setActiveTab('Supervisor')}
                    >
                        Supervisor
                    </button>
                    <button 
                        className={`px-6 py-3 rounded-t-lg border-b-2 ${activeTab === 'Agent' ? 'bg-white text-blue-600 border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-200'} transition duration-200`}
                        onClick={() => setActiveTab('Agent')}
                    >
                        Agent
                    </button>
                </div>
                {renderTabContent()}
                <Logs isOpen={isLogsOpen} close={closeLogs} logs={logs} />
            </div>
        </>
    );
};

export default UserDetails;
