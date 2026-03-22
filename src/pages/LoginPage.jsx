import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      login(user, token);
      toast.success('Login successful!');

      // Redirect based on role
      if (user.role === 'hr') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="card bg-base-100 shadow-2xl border border-base-300">
            <div className="card-body">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">
                  AssetVerse
                </h1>
                <p className="text-base-600">
                  Welcome back! Sign in to your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered focus:input-primary transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="input input-bordered w-full focus:input-primary transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-500 hover:text-base-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Remember me</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full mt-6"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="divider my-6">OR</div>

              {/* Test Credentials */}
              <div className="bg-base-200 rounded-lg p-4 mb-6 flex flex-col gap-2">
                <p className="text-sm font-semibold text-center">Quick Login</p>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline btn-primary flex-1 btn-sm"
                    onClick={() => {
                      setEmail('hr@testcompany.com');
                      setPassword('password123');
                    }}
                  >
                    HR Demo
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-secondary flex-1 btn-sm"
                    onClick={() => {
                      setEmail('employee@testcompany.com');
                      setPassword('password123');
                    }}
                  >
                    Employee Demo
                  </button>
                </div>
              </div>

              {/* Register Links */}
              <div className="text-center space-y-2">
                <p className="text-sm text-base-600">
                  Don't have an account?{' '}
                  <Link to="/register/hr" className="link link-primary font-semibold">
                    Register as HR
                  </Link>
                </p>
                <p className="text-sm text-base-600">
                  Or{' '}
                  <Link to="/register/employee" className="link link-primary font-semibold">
                    Register as Employee
                  </Link>
                </p>
              </div>

              {/* Forgot Password */}
              <button className="btn btn-ghost btn-sm w-full mt-4">
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6 text-sm text-base-600">
            <p>
              By signing in, you agree to our{' '}
              <a href="#" className="link link-primary">
                Terms of Service
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
