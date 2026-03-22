import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-center mb-8">About Us</h1>
          
          <div className="prose prose-lg max-w-none text-base-600">
            <p className="lead text-xl mb-6">
              AssetVerse was founded with a simple mission: to make corporate asset management as seamless and efficient as possible.
            </p>
            
            <h2 className="text-3xl font-semibold mb-4 text-base-900 mt-12">Our Vision</h2>
            <p className="mb-6">
              We believe that companies shouldn't have to struggle with tracking laptops, phones, and other essential equipment. Our platform brings HR managers and employees together in one intuitive space.
            </p>
            
            <h2 className="text-3xl font-semibold mb-4 text-base-900 mt-12">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>Transparency:</strong> Clear visibility into asset assignment and availability.</li>
              <li><strong>Simplicity:</strong> Tools that anyone can use without extensive training.</li>
              <li><strong>Reliability:</strong> A robust platform you can count on 24/7.</li>
              <li><strong>Security:</strong> Keeping your company data safe and protected.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
