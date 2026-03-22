import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const JoinUs = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-center mb-8">Join Our Team</h1>
          <p className="text-lg text-base-600 text-center mb-12">
            Be part of the revolution in asset management. We're always looking for talented individuals to join our mission.
          </p>
          
          <div className="grid gap-6">
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-2xl">Senior Frontend Engineer</h3>
                <p>Remote • Full-time</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary">Apply Now</button>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-2xl">Product Manager</h3>
                <p>New York • Full-time</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary">Apply Now</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinUs;
