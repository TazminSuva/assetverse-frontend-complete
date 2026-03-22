import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon, CreditCardIcon } from 'lucide-react';

const UpgradePackage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const packages = [
    {
      name: 'Basic',
      price: 5,
      employeeLimit: 5,
      features: ['Asset Tracking', 'Employee Management', 'Basic Support'],
      current: user?.subscription === 'basic',
    },
    {
      name: 'Standard',
      price: 8,
      employeeLimit: 10,
      features: ['All Basic features', 'Advanced Analytics', 'Priority Support'],
      current: user?.subscription === 'standard',
      recommended: true,
    },
    {
      name: 'Premium',
      price: 15,
      employeeLimit: 20,
      features: ['All Standard features', 'Custom Branding', '24/7 Support'],
      current: user?.subscription === 'premium',
    },
  ];

  const handleUpgrade = async (pkg) => {
    if (pkg.employeeLimit <= (user?.packageLimit || 5)) {
      toast.error('Select a plan with more employee slots');
      return;
    }

    setSelectedPackage(pkg);
    setLoading(true);

    try {
      // TODO: Implement Stripe payment
      // For now, just show mock payment
      toast.success('Opening payment portal...');
      
      // In production, initialize Stripe
      // const stripe = new Stripe(STRIPE_KEY);
      // const response = await fetch('/api/payments/create-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ packageName: pkg.name })
      // });
      // const { sessionId } = await response.json();
      // await stripe.redirectToCheckout({ sessionId });

      // Mock success
      setTimeout(() => {
        toast.success('Package upgraded successfully!');
        // Update user context
        setLoading(false);
        setSelectedPackage(null);
      }, 2000);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const currentPkg = packages.find(p => p.current);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <Navbar />

      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-base-900 mb-4">
              Upgrade Your Plan
            </h1>
            <p className="text-lg text-base-600">
              Scale your asset management with more employee slots
            </p>
          </motion.div>

          {/* Current Plan Info */}
          {currentPkg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-base-300 mb-12"
            >
              <div className="card-body">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <p className="text-base-600 text-sm">Current Plan</p>
                    <h3 className="text-3xl font-bold text-primary">{currentPkg.name}</h3>
                    <p className="text-base-600 mt-1">
                      {user?.currentEmployees || 0} / {user?.packageLimit || 5} employees used
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base-600 text-sm">Monthly Cost</p>
                    <p className="text-3xl font-bold">${currentPkg.price}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`card ${
                  pkg.recommended
                    ? 'ring-2 ring-primary shadow-2xl'
                    : 'border border-base-300'
                } hover:shadow-lg transition-all`}
              >
                {pkg.recommended && (
                  <div className="badge badge-primary absolute -top-3 left-1/2 -translate-x-1/2">
                    RECOMMENDED
                  </div>
                )}

                <div className="card-body">
                  {/* Package Name */}
                  <h3 className="text-2xl font-bold text-base-900">{pkg.name}</h3>

                  {/* Price */}
                  <div className="my-4">
                    <span className="text-5xl font-bold text-primary">${pkg.price}</span>
                    <span className="text-base-600">/month</span>
                  </div>

                  {/* Employee Limit */}
                  <div className="alert alert-info bg-blue-50 border-blue-200 mb-6">
                    <p className="text-sm">
                      <strong>Up to {pkg.employeeLimit} employees</strong>
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-success" />
                        <span className="text-base-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {pkg.current ? (
                    <button className="btn btn-disabled w-full">
                      Current Plan
                    </button>
                  ) : pkg.employeeLimit <= (user?.packageLimit || 5) ? (
                    <button className="btn btn-disabled w-full">
                      Already Have This
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(pkg)}
                      disabled={loading}
                      className="btn btn-primary w-full gap-2"
                    >
                      {loading && selectedPackage?.name === pkg.name ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <CreditCardIcon className="w-5 h-5" />
                          Upgrade Now
                        </>
                      )}
                    </button>
                  )}

                  {/* Savings Badge */}
                  {pkg.name === 'Premium' && (
                    <div className="mt-4 text-center">
                      <span className="badge badge-success">Save 25% vs Monthly</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-base-900 mb-6">Frequently Asked Questions</h2>

              <div className="space-y-6">
                {[
                  {
                    q: 'Can I change or cancel my plan anytime?',
                    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                  },
                  {
                    q: 'How does billing work?',
                    a: 'You will be billed monthly on the date you subscribed. You can manage your billing in the account settings.',
                  },
                  {
                    q: 'What if I exceed my employee limit?',
                    a: 'If you reach your package limit, you\'ll need to upgrade to add more employees. HR will be notified before hitting the limit.',
                  },
                  {
                    q: 'Is there a refund policy?',
                    a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-base-300 pb-4 last:border-0">
                    <details className="group">
                      <summary className="flex cursor-pointer items-center gap-2 font-semibold text-base-900 hover:text-primary">
                        <span className="group-open:hidden">→</span>
                        <span className="hidden group-open:inline">↓</span>
                        {item.q}
                      </summary>
                      <p className="mt-3 text-base-600 ml-6">{item.a}</p>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-r from-accent/10 to-primary/10 border border-base-300 mt-8"
          >
            <div className="card-body text-center">
              <h3 className="card-title justify-center text-base-900">Need Help?</h3>
              <p className="text-base-600">
                Have questions about our pricing plans? Our support team is here to help.
              </p>
              <div className="card-actions justify-center mt-4">
                <button className="btn btn-primary gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Sales
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePackage;
