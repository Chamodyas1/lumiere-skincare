import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      return;
    }

    const loggedUser = result.user;

    console.log('Logged User:', loggedUser);
    console.log('Role:', loggedUser?.role);

    if (
      loggedUser?.role === 'admin' ||
      loggedUser?.role === 'super_admin'
    ) {

      toast.success(
        'Admin login successful! Welcome to Admin Dashboard 👑'
      );

      navigate('/admin', { replace: true });

    } else {

      toast.error('Admin access only');

    }
  };

  return (
    <div className="container-custom py-12 flex justify-center">

      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full">

        <div className="text-center mb-6">

          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Admin Login
          </h2>

          <p className="text-sm text-gray-500">
            Lumière Skincare Administration
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
              placeholder="admin@lumiere.com"
              required
            />

          </div>

          {/* Password */}
          <div className="mb-6">

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
              placeholder="Enter admin password"
              required
            />

          </div>

          {/* Admin Login */}
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Admin Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;