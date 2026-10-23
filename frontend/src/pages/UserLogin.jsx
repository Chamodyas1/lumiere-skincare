import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const UserLogin = () => {
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

    if (result.success) {
      toast.success(
        'Login successful! Welcome back to Lumière Skincare 💕'
      );

      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-light text-gray-900">
            Welcome Back
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Login to your Lumière account
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-full border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
              required
            />

          </div>

          {/* Password */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-full border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
              required
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Login
          </button>

        </form>

        {/* Register */}
        <div className="text-center mt-6">

          <p className="text-sm text-gray-500">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-sm font-medium text-[#b48b6a] hover:underline mt-1"
          >
            Create an account
          </button>

        </div>

      </div>

    </div>
  );
};

export default UserLogin;