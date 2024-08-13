import React from 'react';

const Logs = ({ isOpen, onClose, logs }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">User Logs</h2>
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-4 text-left">Log ID</th>
                            <th className="py-3 px-4 text-left">Old Status</th>
                            <th className="py-3 px-4 text-left">New Status</th>
                            <th className="py-3 px-4 text-left">Updated By</th>
                            <th className="py-3 px-4 text-left">Updated At</th>
                            <th className="py-3 px-4 text-left">Key</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {logs.map((log, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-4 text-left">{log.logID}</td>
                                <td className="py-3 px-4 text-left">{log.oldStatus ? 'Active' : 'Inactive'}</td>
                                <td className="py-3 px-4 text-left">{log.newStatus ? 'Active' : 'Inactive'}</td>
                                <td className="py-3 px-4 text-left">{log.updatedBy}</td>
                                <td className="py-3 px-4 text-left">{new Date(log.updatedAt).toLocaleString()}</td>
                                <td className="py-3 px-4 text-left">{log.key}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button 
                    onClick={onClose} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Logs;
