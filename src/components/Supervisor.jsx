import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Supervisor = () => {
    const [agents, setAgents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedTask, setSelectedTask] = useState('');
    const [target, setTarget] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { userid, role, name } = useContext(AuthContext);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);

        const fetchAgentsAndTasks = async () => {
            try {
                const [agentsResponse, tasksResponse] = await Promise.all([
                    axios.get('http://localhost:3000/api/allAgents'),
                    axios.get('http://localhost:3000/api/allTasks')
                ]);
    
                setAgents(agentsResponse.data.data || []);
                setTasks(tasksResponse.data.data || []);
            } catch (error) {
                console.error('Failed to fetch agents or tasks', error);
            }
        };

        fetchAgentsAndTasks();
    }, []);

    const handleAssignTask = async () => {
        if (!selectedAgent || !selectedTask || !target || !startDate || !endDate) {
            alert('Please fill all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/assignTask', {
                taskid: selectedTask,
                supervisorid: userid,
                agentid: selectedAgent,
                start_date: startDate,  
                end_date: endDate,
                remarks: target,
            });

            // Display success or error message from the API
            if (response.data.success) {
                alert(response.data.message || 'Task assigned successfully');
                // Clear the form after successful submission
                setSelectedAgent('');
                setSelectedTask('');
                setTarget('');
                setStartDate(new Date().toISOString().split('T')[0]);
                setEndDate('');
            } else {
                alert(response.data.message || 'Failed to assign task');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to assign task due to an error.';
            console.error('Failed to assign task:', errorMessage);
            alert(errorMessage);
        }
    };

    const isSupervisor = role === 'Supervisor';

    return (
        <div className="container mx-auto p-6">
            {isSupervisor && (
                <h1 className="text-3xl font-bold mb-6">Supervisor: {name}</h1>
            )}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Agent</label>
                <select 
                    className="w-full p-2 border rounded"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    disabled={!isSupervisor}  
                >
                    <option value="">-- Select Agent --</option>
                    {agents.map(agent => (
                        <option key={agent.ID} value={agent.ID}>
                            {agent.Name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Task</label>
                <select 
                    className="w-full p-2 border rounded"
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    disabled={!isSupervisor}  
                >
                    <option value="">-- Select Task --</option>
                    {tasks.map(task => (
                        <option key={task.taskid} value={task.taskid}>
                            {task.taskName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Remarks</label>
                <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={!isSupervisor}  
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Start Date</label>
                <input 
                    type="date" 
                    className="w-full p-2 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">End Date</label>
                <input 
                    type="date" 
                    className="w-full p-2 border rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!isSupervisor}  
                />
            </div>
            <button 
                onClick={handleAssignTask}
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${!isSupervisor ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isSupervisor} 
            >
                Assign Task
            </button>
        </div>
    );
};

export default Supervisor;
