import { motion } from 'framer-motion';
import { BriefcaseIcon, ClockIcon, Package2Icon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { employeeAPI } from '../../api';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [assetsRes, affiliationsRes] = await Promise.all([
        employeeAPI.getMyAssets(),
        employeeAPI.getMyAffiliations(),
      ]);

      setAssets(assetsRes.data.assets || []);
      setAffiliations(affiliationsRes.data.affiliations || []);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'My Assets',
      value: assets.length,
      icon: <Package2Icon className="w-6 h-6" />,
      color: 'text-primary',
      link: '/employee/my-assets',
    },
    {
      title: 'Assigned Companies',
      value: affiliations.length,
      icon: <BriefcaseIcon className="w-6 h-6" />,
      color: 'text-success',
      link: '/employee/my-team',
    },
    {
      title: 'Pending Returns',
      value: assets.filter(a => a.assetType === 'Returnable' && a.status === 'assigned').length,
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'text-warning',
      link: '/employee/my-assets',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-base-900 mb-2">
              Welcome, {user?.name}! 👋
            </h1>
            <p className="text-base-600">
              Manage your assets and company affiliations
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => stat.link ? window.location.href = stat.link : null}
              >
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-base-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} opacity-20 text-4xl`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-base-300 mb-8"
          >
            <div className="card-body">
              <h2 className="card-title text-base-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/employee/request-asset"
                  className="btn btn-primary gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Request Asset
                </Link>
                <Link
                  to="/employee/my-assets"
                  className="btn btn-outline gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Assets
                </Link>
                <Link
                  to="/employee/my-team"
                  className="btn btn-outline gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 8.048M7.5 9.5H8m8 0h.5m-4-3.5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  My Team
                </Link>
              </div>
            </div>
          </motion.div>

          {/* My Companies Section */}
          {affiliations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-base-100 border border-base-300 mb-8"
            >
              <div className="card-body">
                <h2 className="card-title text-base-900 mb-4">My Companies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {affiliations.map((affiliation, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="card bg-base-200 border border-base-300"
                    >
                      <div className="card-body">
                        <div className="flex items-center gap-3 mb-3">
                          {affiliation.companyLogo && (
                            <img
                              src={affiliation.companyLogo}
                              alt={affiliation.companyName}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-base-900">
                              {affiliation.companyName}
                            </h3>
                            <p className="text-xs text-base-600">
                              Since {new Date(affiliation.affiliationDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="badge badge-success">Active</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-blue-50 border border-blue-200 mb-8"
            >
              <div className="card-body text-center py-12">
                <p className="text-5xl mb-4">🏢</p>
                <h3 className="card-title justify-center text-blue-900">No Company Affiliation Yet</h3>
                <p className="text-blue-800 mt-2">
                  Request an asset from a company to get affiliated!
                </p>
                <Link
                  to="/employee/request-asset"
                  className="btn btn-primary mt-4"
                >
                  Request Your First Asset
                </Link>
              </div>
            </motion.div>
          )}

          {/* Recent Assets */}
          {assets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-base-900 mb-4">Recent Assets</h2>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr className="border-b border-base-300">
                        <th>Asset</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.slice(0, 5).map((asset, idx) => (
                        <tr key={idx} className="hover:bg-base-200">
                          <td className="font-semibold">{asset.assetName}</td>
                          <td>{asset.companyName}</td>
                          <td>
                            <span className={`badge ${
                              asset.assetType === 'Returnable'
                                ? 'badge-info'
                                : 'badge-warning'
                            }`}>
                              {asset.assetType}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              asset.status === 'assigned'
                                ? 'badge-success'
                                : 'badge-ghost'
                            }`}>
                              {asset.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Link to="/employee/my-assets" className="btn btn-ghost btn-sm">
                    View All Assets →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-amber-50 border border-amber-200 mt-8"
          >
            <div className="card-body">
              <h3 className="card-title text-amber-900">💡 Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-amber-800 text-sm">
                <li>Request assets from your company through the request portal</li>
                <li>Track all your assigned assets in one place</li>
                <li>Return returnable assets when no longer needed</li>
                <li>View team members and company information</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
