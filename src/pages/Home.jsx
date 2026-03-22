import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { publicAPI } from '../api';
import { 
  CheckCircleIcon, 
  BarChart3Icon, 
  UsersIcon, 
  ShieldCheckIcon,
  TrendingUpIcon,
  ZapIcon
} from 'lucide-react';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState([
    { number: '0', label: 'Companies Trust Us' },
    { number: '0', label: 'Assets Managed' },
    { number: '24/7', label: 'Support Available' },
  ]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await publicAPI.getPackages();
        setPackages(response.data.packages);
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setLoadingPackages(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await publicAPI.getStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchPackages();
    fetchStats();
  }, []);

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Asset Security',
      description: 'Keep track of all company assets in one secure location',
    },
    {
      icon: <BarChart3Icon className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into asset distribution and usage',
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: 'Team Management',
      description: 'Manage employee affiliations and asset assignments',
    },
    {
      icon: <TrendingUpIcon className="w-8 h-8" />,
      title: 'Growth Tracking',
      description: 'Monitor asset inventory growth and trends',
    },
    {
      icon: <ZapIcon className="w-8 h-8" />,
      title: 'Quick Requests',
      description: 'Streamlined asset request and approval workflow',
    },
    {
      icon: <CheckCircleIcon className="w-8 h-8" />,
      title: 'Compliance',
      description: 'Maintain audit trails and compliance records',
    },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 via-blue-50 to-base-100">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-base-900 mb-6 leading-tight">
                Corporate Asset Management Made <span className="text-primary">Simple</span>
              </h1>
              <p className="text-lg text-base-600 mb-8 leading-relaxed">
                AssetVerse is your all-in-one platform for managing physical assets, tracking equipment allocation, and maintaining accountability across your organization.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link 
                  to="/register/hr"
                  className="btn btn-primary btn-lg gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started
                </Link>
                <Link 
                  to="/login"
                  className="btn btn-outline btn-lg"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-base-300">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-3xl font-bold text-primary">{stat.number}</p>
                    <p className="text-sm text-base-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:flex justify-center"
            >
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">📦</div>
                  <p className="text-base-600">Asset Management Hub</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-base-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-base-600">
              Everything you need to manage corporate assets efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="text-primary mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-lg">{feature.title}</h3>
                  <p className="text-base-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 bg-base-200/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-base-900 mb-4">
              Flexible Pricing Plans
            </h2>
            <p className="text-lg text-base-600">
              Choose the perfect plan for your organization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`card ${pkg.popular ? 'ring-2 ring-primary shadow-xl' : 'border border-base-300'} transition-transform hover:scale-105`}
              >
                <div className="card-body">
                  {pkg.popular && (
                    <div className="badge badge-primary absolute -top-3 left-1/2 transform -translate-x-1/2">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-base-900">{pkg.name}</h3>
                  <div className="my-4">
                    <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                    <span className="text-base-600">/month</span>
                  </div>
                  <p className="text-sm text-base-600 mb-6">
                    Up to <strong>{pkg.employeeLimit}</strong> employees
                  </p>
                  <div className="divider my-4"></div>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center gap-2 text-base-600">
                        <CheckCircleIcon className="w-5 h-5 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`btn w-full ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Simplify Asset Management?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of companies that trust AssetVerse for their asset management needs
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register/hr" className="btn btn-light btn-lg">
                Start as HR Manager
              </Link>
              <Link to="/register/employee" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                Register as Employee
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-900 text-base-content py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl text-primary mb-4">AssetVerse</h3>
              <p className="text-base-400">
                Corporate Asset Management System
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-base-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-base-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-base-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-base-700 pt-8 text-center text-base-400">
            <p>&copy; 2024 AssetVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
