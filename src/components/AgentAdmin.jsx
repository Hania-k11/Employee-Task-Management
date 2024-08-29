import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AgentAdmin = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [agents, setAgents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [isRescheduling, setIsRescheduling] = useState(false);
    const { userid } = useContext(AuthContext);

    useEffect(() => {
        fetchTasks();
        
    }, []);

    useEffect(() => {
        if (selectedTask && selectedTask.AgentID) {
            fetchAgents(selectedTask.AgentID);
            console.log(selectedTask.AgentID);
        }
    }, [selectedTask]);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/AgentSupervisorTasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchAgents = async (excludedAgentId) => {
        try {
          console.log('id id idyyyy:', excludedAgentId);
            const response = await axios.get(`http://localhost:3000/api/getAgentsWithMinimumTasksExcluding/${excludedAgentId}`);
            if (Array.isArray(response.data)) {
                setAgents(response.data);
            } else {
                console.error('Expected an array but received:', response.data);
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const isTaskOverdue = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        return today > end;
    };


    
    const handlePendingClick = (task) => {
        setSelectedTask(task);
        setIsRescheduling(false);
        setShowPopup(true);
        fetchAgents(task.AgentID);
    };

    useEffect(() => {
      if (selectedTask && selectedTask.isResheduled) {
        const updatedTask = { ...selectedTask, isResheduled: true };
        setTasks(prevTasks => prevTasks.map(task => task.TaskID === updatedTask.TaskID ? updatedTask : task));
      }
    
    }, [selectedTask]);
    

    const handleRescheduleClick = (task) => {
      const today = new Date().toISOString().split('T')[0];
      setSelectedTask({ ...task, newStartDate: today });
        setIsRescheduling(true);
        setShowPopup(true);
        fetchAgents(task.AgentID);
        this.forceUpdate();

        console.log('reeeeeeesheeeeeeee',task.isResheduled)
    };

    

    const handleRescheduleConfirm = async () => {
    
      if (!selectedTask || !selectedTask.newAgentID) {
          alert("Please select an agent before proceeding.");
          return;
      }
  
      console.log("Selected Task:", selectedTask);
      console.log("Task ID:", selectedTask.TaskID);
      console.log("New Agent ID:", Number(selectedTask.newAgentID));
      console.log("Approver ID:", userid);
      console.log("Start Date:", selectedTask.newStartDate);
      console.log("End Date:", selectedTask.newEndDate);
  
      try {
       
          const rescheduleResponse = await axios.post('http://localhost:3000/api/rescheduleTasky', {
              taskid: selectedTask.TaskID,
              agentid: Number(selectedTask.newAgentID),
              approverID: userid,
              start_date: selectedTask.newStartDate,
              end_date: selectedTask.newEndDate,
              supervisorid: userid
          });
  
          
          console.log("Response from rescheduleTasky API:", rescheduleResponse.data);
  
          
          // alert(rescheduleResponse.data.message);
  
          if (rescheduleResponse.data.success) {
              alert('Task rescheduled successfully.');
  
              const updateResponse = await axios.post('http://localhost:3000/api/updateRescheduled', {
                  tokenid: selectedTask.tokenID 
              });
  
              console.log("Response from updateRescheduled API:", updateResponse.data);
  
              if (updateResponse.data.success) {
                  alert('Task is marked as rescheduled.');
  
                  
                  setTasks(prevTasks =>
                      prevTasks.map(task =>
                          task.TaskID === selectedTask.TaskID
                              ? { ...task, end_date: selectedTask.newEndDate }
                              : task
                      )
                  );
  
                  setShowPopup(false);
                  setSelectedTask(null);
              } else {
             
                  alert(`Error updating rescheduled flag: ${updateResponse.data.message}`);
              }
          } else {
            
              alert(`Error rescheduling task: ${rescheduleResponse.data.message}`);
          }
      } catch (error) {
          console.error('An error occurred:', error);
          console.log('Error:', error);

  
          const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
          // alert(errorMessage);
  
        
          if (error.response) {
              console.error('Response data:', error.response.data);
              console.error('Response status:', error.response.status);
              console.error('Response headers:', error.response.headers);
          } else if (error.request) {
              console.error('Request data:', error.request);
          } else {
              console.error('Error message:', error.message);
          }
      }
  };
  

    const handleApprove = async () => {
        if (!remarks) {
            alert('Please add remarks before approving.');
            return;
        }

        if (!selectedTask || !selectedTask.tokenID) {
            alert('No task selected or missing tokenID.');
            return;
        }

        if (!userid) {
            alert('User ID is missing.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/approveToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tokenid: selectedTask.tokenID,
                    AdminRemarks: remarks,
                    userid: userid,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.tokenID === selectedTask.tokenID
                            ? { ...task, Status: 'Approved' }
                            : task
                    )
                );
                setShowPopup(false);
                setSelectedTask(null);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            alert('An error occurred while approving the task.');
            console.error(error);
        }
    };

   // Function to format date as YYYY/MM/DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Example usage
const startDate = new Date();
const endDate = new Date();
const newStartDate = new Date();

console.log(formatDate(startDate)); // Output: YYYY/MM/DD

  console.log(formatDate(startDate)); // Output: YYYY/MM/DD

    const handleReject = async () => {
        if (!remarks) {
            alert('Please add remarks before rejecting.');
            return;
        }

        if (!selectedTask || !selectedTask.tokenID) {
            alert('No task selected or missing tokenID.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/rejectToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tokenid: selectedTask.tokenID,
                    AdminRemarks: remarks,
                    userid: userid,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.tokenID === selectedTask.tokenID
                            ? { ...task, Status: 'Rejected' }
                            : task
                    )
                );
                setShowPopup(false);
                setSelectedTask(null);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            alert('An error occurred while rejecting the task.');
            console.error(error);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedTask(null);
    };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Agent and Supervisor Tasks</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-2 border-b">Agent ID </th>
              <th className="py-2 px-2 border-b">Supervisor ID</th>
              <th className="py-2 px-2 border-b">Supervisor Name</th>
              <th className="py-2 px-2 border-b">Agent Name</th>
              <th className="py-2 px-2 border-b">Task Name</th>
              <th className="py-2 px-2 border-b">Start Date</th>
              <th className="py-2 px-2 border-b">End Date</th>
              <th className="py-2 px-2 border-b">Number of Tasks Assigned</th>
              <th className="py-2 px-2 border-b">Action By User</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.TaskID} className="border-t hover:bg-gray-100">
                <td className="py-2 px-2 border-b">{task.AgentID}</td>
                <td className="py-2 px-2 border-b">{task.SupervisorID}</td>
                <td className="py-2 px-2 border-b">{task.SupervisorName}</td>
                <td className="py-2 px-2 border-b">{task.AgentName}</td>
                <td className="py-2 px-2 border-b">{task.TaskName}</td>
                <td className="py-2 px-2 border-b">{formatDate(new Date(task.StartDate))}</td>
                <td className="py-2 px-2 border-b">{formatDate(new Date(task.EndDate))}</td>
                <td className="py-2 px-2 border-b">{task.NumberOfTasksAssigned}</td>
                <td className="py-2 px-2 border-b">
                  {task.Status === 'Pending' ? (
                    <button
                      onClick={() => handlePendingClick(task)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Take Action
                    </button>
                  ) : (
                    task.ActionByUser
                  )}
                </td>
                <td className="py-2 px-2 border-b">
                  {task.Status === 'Pending' && (
                    <button className="bg-yellow-500 text-white px-4 py-1 rounded">Pending</button>
                  )}
                  {task.Status === 'Rejected' && (
                    <button className="bg-red-500 text-white px-4 py-1 rounded cursor-not-allowed" disabled>Rejected</button>
                  )}
                  {task.Status === 'Approved' && (
                    <button className="bg-green-500 text-white px-4 py-1 rounded cursor-not-allowed" disabled>Approved</button>
                  )}
                </td>
                <td className="py-2 px-2 border-b">
                  {task.Status === 'Approved' && task.ActionByUser === 'Not Submitted' && (
                   <button
                   onClick={() => handleRescheduleClick(task)}
                   className={`px-4 py-1 rounded ${task.isResheduled ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-700'}`}
                   disabled={task.isResheduled}
               >
                   {task.isResheduled ? 'Rescheduled' : 'Reschedule'}
               </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup for actions */}
      {showPopup && selectedTask && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">{isRescheduling ? 'Reschedule Task' : 'Task Action'}</h2>
      {isRescheduling ? (
        <>
          <p className="mb-2"><strong>Agent ID:</strong> {selectedTask?.AgentID}</p>
          <p className="mb-2"><strong>Agent Name:</strong> {selectedTask?.AgentName}</p>
          <p className="mb-2"><strong>Start Date:</strong> {formatDate(new Date(selectedTask.StartDate))}
          </p>
          <p className="mb-2"><strong>End Date:</strong> {formatDate(new Date(selectedTask.EndDate))}
          </p>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">New Start Date:</label>
            <input
              type="date"
              value={selectedTask?.newStartDate || ''}
              onChange={(e) => setSelectedTask({ ...selectedTask, newStartDate: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">New End Date:</label>
            <input
              type="date"
              value = {formatDate(new Date(selectedTask?.newEndDate || ''))} 
              
              onChange={(e) => setSelectedTask({ ...selectedTask, newEndDate: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Assign to New Agent:</label>
            <select 
        className="w-full p-2 border rounded"

        value={selectedTask?.newAgentID || ''}
        onChange={(e) => {
          console.log('Selected AgentID:', e.target.value);
          setSelectedTask({ ...selectedTask, newAgentID: e.target.value });
      }}
    >
        <option value="">-- Select Agent --</option>
        {agents.map(agent => (
            <option key={agent.agentid} value={agent.agentid}>
                {agent.AgentName}
            </option>
        ))}
    </select>
          </div>
          <button
            onClick={handleRescheduleConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Confirm Reschedule
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Admin Remarks:</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border p-2 w-full h-24"
            />
          </div>
          <button
            onClick={handleApprove}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
          >
            Reject
          </button>
        </>
      )}
      <button
        onClick={handleClosePopup}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mt-4"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default AgentAdmin;

