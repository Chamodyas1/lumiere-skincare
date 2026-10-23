import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginType, setLoginType] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (loginType === 'user') {
      navigate('/user-login');
    }

    if (loginType === 'admin') {
      navigate('/admin-login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Select your account type to continue
          </p>
        </div>

        <div className="space-y-4">

          {/* USER */}
          <button
            type="button"
            onClick={() => setLoginType('user')}
            className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition ${
              loginType === 'user'
                ? 'border-[#b48b6a] bg-[#faf6f1]'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl">U</span>
            </div>

            <div className="text-left">
              <h2 className="font-semibold text-lg">
                User
              </h2>

              <p className="text-sm text-gray-500">
                Login to your customer account
              </p>
            </div>
          </button>

          {/* ADMIN */}
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition ${
              loginType === 'admin'
                ? 'border-[#b48b6a] bg-[#faf6f1]'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl">A</span>
            </div>

            <div className="text-left">
              <h2 className="font-semibold text-lg">
                Admin
              </h2>

              <p className="text-sm text-gray-500">
                Login to the admin dashboard
              </p>
            </div>
          </button>

        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!loginType}
          className="w-full mt-6 py-3 rounded-xl bg-black text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default Login;