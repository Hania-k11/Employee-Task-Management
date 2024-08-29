import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const AgentSupervisor = () => {
    const { userid } = useContext(AuthContext); 
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/agentSupervisory/${userid}`);
                setTasks(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [userid]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tasks Assigned by Supervisor</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            {tasks.length === 0 ? (
                <div>No tasks found</div>
            ) : (
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Task ID</th>
                            <th className="py-2 px-4 border-b">Task Name</th>
                            <th className="py-2 px-4 border-b">Supervisor Name</th>
                            <th className="py-2 px-4 border-b">Agent Name</th>
                            <th className="py-2 px-4 border-b">Start Date</th>
                            <th className="py-2 px-4 border-b">End Date</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.taskid} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{task.taskid}</td>
                                <td className="py-2 px-4 border-b">{task.taskname}</td>
                                <td className="py-2 px-4 border-b">{task.SupervisorName}</td>
                                <td className="py-2 px-4 border-b">{task.AgentName}</td>
                                <td className="py-2 px-4 border-b">{new Date(task.start_date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{new Date(task.end_date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-white ${
                                            task.Status === 'Approved'
                                                ? 'bg-green-500'
                                                : task.status === 'Rejected'
                                                ? 'bg-red-500'
                                                : 'bg-yellow-500'
                                        }`}
                                    >
                                        {task.Status}
                                    </span>
                                </td>
                                {/* <td className="py-2 px-4 border-b">
                                    <button
                                        className={`px-4 py-2 text-white rounded ${
                                            task.action === 'Submitted'
                                                ? 'bg-gray-400'
                                                : task.action === 'Extended'
                                                ? 'bg-blue-500'
                                                : 'bg-yellow-500'
                                        }`}
                                    >
                                        {task.action}
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AgentSupervisor;
