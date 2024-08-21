import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Agent = () => {
    const { userid } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAgentTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/getTasksByAgent/${userid}`);
                console.log('Fetched tasks:', response.data); // Log the fetched tasks
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching agent tasks:', error);
                setError(error.response?.data?.error || 'Failed to fetch tasks');
            }
        };

        fetchAgentTasks();
    }, [userid]);

    const handleButtonClick = async (taskid) => {
        console.log('Button clicked for taskId:', taskid); // Log the taskId

        try {
            const response = await axios.post('http://localhost:3000/api/submitButton', {
                agentid: userid,
                taskid: taskid // Pass the taskId directly
            });

            if (response.data.success) {
                // Update only the specific task that was clicked
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.taskid === taskid
                            ? { ...task, submittedFlag: true }
                            : task
                    )
                );
            } else {
                setError(response.data.message || 'Failed to update task status.');
            }
        } catch (error) {
            console.error('Failed to submit task:', error);
            setError('Failed to update task status.');
        }
    };

    
    const getButtonStyles = (task) => {
        if (task.submittedFlag) {
            return 'bg-gray-500 text-white';
        }
        return new Date(task.end_date) > new Date()
            ? 'bg-blue-500 text-white'
            : 'bg-red-500 text-white';
    };

    const getButtonText = (task) => {
        if (task.submittedFlag) {
            return 'Submitted';
        }
        return new Date(task.end_date) > new Date()
            ? 'Submit'
            : 'Extended';
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Tasks for Agent </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task.taskid} className="flex items-center justify-between p-4 border rounded shadow-sm">
                        <div>
                            <p className="font-semibold">{task.taskName}</p>
                            <p className="text-gray-600">Assigned Date: {task.start_date}</p>
                            <p className="text-gray-600">End Date: {task.end_date}</p>
                        </div>
                        <button
                            onClick={() => handleButtonClick(task.taskid)} // Pass task.taskId
                            className={`px-4 py-2 rounded transition duration-200 ${getButtonStyles(task)}`}
                            disabled={task.submittedFlag || new Date(task.end_date) <= new Date()}
                        >
                            {getButtonText(task)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Agent;
