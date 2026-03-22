import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <p className="text-4xl font-bold text-base-900 mb-2">
              Page Not Found
            </p>
            <p className="text-lg text-base-600 mb-8">
              Sorry, the page you're looking for doesn't exist.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/" className="btn btn-primary btn-lg">
              Go to Home
            </Link>
            <button className="btn btn-outline btn-lg" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>

          {/* Illustration */}
          <div className="mt-16 text-6xl">
            🔍
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
