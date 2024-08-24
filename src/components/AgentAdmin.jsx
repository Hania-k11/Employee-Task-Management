import React, { useState, useEffect } from 'react';

const AgentAdmin = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [remarks, setRemarks] = useState(''); // State for admin remarks

  useEffect(() => {
    // Fetch tasks from the API
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/AgentSupervisorTasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handlePendingClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  const handleApprove = async () => {
    if (!remarks) {
      alert('Please add remarks before approving.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/approveToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenid: selectedTask.tokenID, // Ensure this matches your data structure
          AdminRemarks: remarks,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        // Update the task status locally
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.tokenID === selectedTask.tokenID
              ? { ...task, Status: 'Approved' } // Update only the selected task
              : task
          )
        );
        setShowPopup(false);
        setSelectedTask(null); // Clear selected task
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert('An error occurred while approving the task.');
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (!remarks) {
      alert('Please add remarks before rejecting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/rejectToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenid: selectedTask.tokenID, // Ensure this matches your data structure
          AdminRemarks: remarks,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        // Update the task status locally
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.tokenID === selectedTask.tokenID
              ? { ...task, Status: 'Rejected' } // Update only the selected task
              : task
          )
        );
        setShowPopup(false);
        setSelectedTask(null); // Clear selected task
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
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              {/* Table headers */}
              <th className="py-2 px-4 border-b">Agent ID</th>
              <th className="py-2 px-4 border-b">Supervisor ID</th>
              <th className="py-2 px-4 border-b">Supervisor Name</th>
              <th className="py-2 px-4 border-b">Agent Name</th>
              <th className="py-2 px-4 border-b">Task Name</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Number of Tasks Assigned</th>
              <th className="py-2 px-4 border-b">Action By User</th>
              <th className="py-2 px-4 border-b">Status</th> {/* Status column is last */}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.TaskID} className="border-t hover:bg-gray-100">
                {/* Table data cells */}
                <td className="py-2 px-4 border-b">{task.AgentID}</td>
                <td className="py-2 px-4 border-b">{task.SupervisorID}</td>
                <td className="py-2 px-4 border-b">{task.SupervisorName}</td>
                <td className="py-2 px-4 border-b">{task.AgentName}</td>
                <td className="py-2 px-4 border-b">{task.TaskName}</td>
                <td className="py-2 px-4 border-b">{task.StartDate}</td>
                <td className="py-2 px-4 border-b">{task.EndDate}</td>
                <td className="py-2 px-4 border-b">{task.NumberOfTasksAssigned}</td>
                <td className="py-2 px-4 border-b">
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
                <td className="py-2 px-4 border-b">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Task Action</h2>
            <p><strong>Task Name:</strong> {selectedTask.TaskName}</p>
            <p><strong>Status:</strong> {selectedTask.Status}</p>
            <textarea
              className="w-full p-2 mt-4 border rounded"
              placeholder="Add remarks here..."
              value={remarks} // Bind remarks to the state
              onChange={(e) => setRemarks(e.target.value)} // Update state on change
            ></textarea>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleApprove}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentAdmin;
