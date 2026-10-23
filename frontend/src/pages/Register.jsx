import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await register(
      name,
      email,
      password
    );

    if (result.success) {

      toast.success(
        'Registration successful! Welcome to Lumière Skincare 🎉'
      );

      navigate('/', { replace: true });
    }
  };

  return (
    <div className="container-custom py-12 flex justify-center">

      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full">

        <h2 className="text-2xl font-light text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
              placeholder="John Doe"
              required
            />

          </div>

          {/* Email */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
              placeholder="your@email.com"
              required
            />

          </div>

          {/* Password */}
          <div className="mb-6">

            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
              placeholder="Min 6 characters"
              required
            />

          </div>

          {/* Register */}
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-4 text-sm text-[#4d453e]">

          Already have an account?{' '}

          <Link
            to="/login"
            className="text-[#b48b6a] font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;