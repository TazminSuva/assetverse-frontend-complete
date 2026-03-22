import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { assetAPI, requestAPI } from '../../api';
import toast from 'react-hot-toast';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Package2Icon, Users2Icon, FileTextIcon, TrendingUpIcon } from 'lucide-react';

const HRDashboard = () => {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    pendingRequests: 0,
    assignedAssets: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [assetsRes, requestsRes] = await Promise.all([
        assetAPI.getAssets(1, 100),
        requestAPI.getRequests(),
      ]);

      setAssets(assetsRes.data.assets || []);
      setRequests(requestsRes.data.requests || []);

      // Calculate stats
      const returnableCount = assetsRes.data.assets?.filter(a => a.productType === 'Returnable').length || 0;
      const nonReturnableCount = assetsRes.data.assets?.filter(a => a.productType === 'Non-returnable').length || 0;
      const pendingCount = requestsRes.data.requests?.filter(r => r.requestStatus === 'pending').length || 0;

      setStats({
        totalAssets: assetsRes.data.assets?.length || 0,
        pendingRequests: pendingCount,
        assignedAssets: nonReturnableCount,
        returnableAssets: returnableCount,
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const assetTypeData = [
    { name: 'Returnable', value: stats.returnableAssets || 0 },
    { name: 'Non-returnable', value: stats.assignedAssets || 0 },
  ];

  const topAssets = assets
    .slice(0, 5)
    .map(a => ({
      name: a.productName,
      quantity: a.productQuantity,
      available: a.availableQuantity,
    }));

  const requestStatusData = [
    { status: 'Pending', count: requests.filter(r => r.requestStatus === 'pending').length },
    { status: 'Approved', count: requests.filter(r => r.requestStatus === 'approved').length },
    { status: 'Rejected', count: requests.filter(r => r.requestStatus === 'rejected').length },
  ];

  const COLORS = ['#0ea5e9', '#22c55e', '#ef4444'];

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-base-900 mb-2">
              Dashboard
            </h1>
            <p className="text-base-600">
              Welcome back, <span className="font-semibold">{user?.name}</span>!
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: 'Total Assets',
                value: stats.totalAssets,
                icon: <Package2Icon className="w-6 h-6" />,
                color: 'text-primary',
              },
              {
                title: 'Pending Requests',
                value: stats.pendingRequests,
                icon: <FileTextIcon className="w-6 h-6" />,
                color: 'text-warning',
              },
              {
                title: 'Assigned Assets',
                value: stats.assignedAssets,
                icon: <TrendingUpIcon className="w-6 h-6" />,
                color: 'text-success',
              },
              {
                title: 'Package Limit',
                value: user?.packageLimit || 5,
                icon: <Users2Icon className="w-6 h-6" />,
                color: 'text-info',
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow"
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Asset Type Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-base-900">Asset Type Distribution</h2>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assetTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assetTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Request Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-base-900">Request Status Overview</h2>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={requestStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Top Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-base-900 mb-4">Top Assets</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="border-b border-base-300">
                      <th>Asset Name</th>
                      <th>Total Quantity</th>
                      <th>Available</th>
                      <th>Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAssets.map((asset, idx) => (
                      <tr key={idx} className="hover:bg-base-200 transition-colors">
                        <td className="font-semibold">{asset.name}</td>
                        <td>{asset.quantity}</td>
                        <td>{asset.available}</td>
                        <td>
                          <progress
                            className="progress progress-primary w-24"
                            value={(asset.quantity - asset.available) / asset.quantity * 100}
                            max="100"
                          ></progress>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 border border-base-300 mt-8"
          >
            <div className="card-body">
              <h2 className="card-title text-base-900 mb-4">Recent Requests</h2>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="border-b border-base-300">
                      <th>Employee</th>
                      <th>Asset</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 5).map((req, idx) => (
                      <tr key={idx} className="hover:bg-base-200 transition-colors">
                        <td>{req.requesterName}</td>
                        <td>{req.assetName}</td>
                        <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            req.requestStatus === 'pending' ? 'badge-warning' :
                            req.requestStatus === 'approved' ? 'badge-success' :
                            'badge-error'
                          }`}>
                            {req.requestStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
