import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CreateUser = () => {
  const { role } = useContext(AuthContext); // Get the role from AuthContext
  
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    gender: '',
    contact: '',
    age: '',
    EmployeeCode: '',
    rolename: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields are filled
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        alert(`Please fill in the ${key}`);
        return;
      }
    }

    try {
      const response = await axios.post('http://localhost:3000/api/createUser', {
        userName: formData.userName,
        userPassword: formData.password,
        gender: formData.gender,
        contact: formData.contact,
        age: formData.age,
        EmployeeCode: formData.EmployeeCode,
        Email: formData.email,
        rolename: formData.rolename
      });

      console.log("API Response: ", response.data);

      if (!response.data.success) {
        alert(`Error: ${response.data.message}`);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error("API Error: ", err);
      alert('An error occurred while creating the user.');
    }
  };

  // Check if the current role should disable the button
  const isButtonDisabled = ['Agent', 'Supervisor', 'User', 'Report'].includes(role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-slate-300">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label htmlFor="userName" className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                id="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact</label>
              <input
                type="text"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your contact number"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="age" className="block text-gray-700 font-medium mb-2">Age</label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your age"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="EmployeeCode" className="block text-gray-700 font-medium mb-2">Employee Code</label>
              <input
                type="text"
                id="EmployeeCode"
                value={formData.EmployeeCode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your employee code"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="rolename" className="block text-gray-700 font-medium mb-2">Role</label>
              <select
                id="rolename"
                value={formData.rolename}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Agent">Agent</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition duration-300 ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            disabled={isButtonDisabled}
          >
            Signup
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default CreateUser;
