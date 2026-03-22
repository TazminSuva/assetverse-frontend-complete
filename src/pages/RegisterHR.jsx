import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterHR = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    companyLogo: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.companyName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.registerHR({
        name: formData.name,
        companyName: formData.companyName,
        companyLogo: formData.companyLogo || 'https://via.placeholder.com/150',
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
      });

      const { token, user } = response.data;
      login(user, token);
      toast.success('Registration successful! Welcome aboard! 🎉');
      navigate('/hr/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          className="w-full max-w-2xl"
        >
          <div className="card bg-base-100 shadow-2xl border border-base-300">
            <div className="card-body">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">
                  Register as HR Manager
                </h1>
                <p className="text-base-600">
                  Set up your company's asset management system
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Full Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered focus:input-primary transition-colors"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Company Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Company Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Tech Corp"
                      className="input input-bordered focus:input-primary transition-colors"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="hr@company.com"
                    className="input input-bordered focus:input-primary transition-colors"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Company Logo */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Company Logo URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    className="input input-bordered focus:input-primary transition-colors"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleChange}
                  />
                </div>

                {/* Date of Birth */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Date of Birth *</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered focus:input-primary transition-colors"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Password *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        className="input input-bordered w-full focus:input-primary transition-colors"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Confirm Password *</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className="input input-bordered focus:input-primary transition-colors"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Show Password Checkbox */}
                <label className="label cursor-pointer">
                  <span className="label-text">Show password</span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full mt-6"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-base-600">
                  Already have an account?{' '}
                  <Link to="/login" className="link link-primary font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900">
                  <strong>✨ Benefits of registering as HR:</strong>
                </p>
                <ul className="text-xs text-blue-800 mt-2 space-y-1">
                  <li>✓ Manage company assets and inventory</li>
                  <li>✓ Start with 5 employee slots (upgradeable)</li>
                  <li>✓ Track asset requests and approvals</li>
                  <li>✓ View analytics and reports</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6 text-sm text-base-600">
            <p>
              By registering, you agree to our{' '}
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

export default RegisterHR;
