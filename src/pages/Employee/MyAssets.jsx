import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { employeeAPI } from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { UndoIcon, PrinterIcon, SearchIcon } from 'lucide-react';

const MyAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [returnId, setReturnId] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getMyAssets();
      setAssets(response.data.assets || []);
    } catch (error) {
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await employeeAPI.returnAsset(id);
      fetchAssets();
      setReturnId(null);
      toast.success('Asset returned successfully');
    } catch (error) {
      toast.error('Failed to return asset');
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'My Assets Report',
  });

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.assetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true :
      (filterType === 'returnable' && asset.assetType === 'Returnable') ||
      (filterType === 'non-returnable' && asset.assetType === 'Non-returnable');
    return matchesSearch && matchesType;
  });

  const stats = [
    {
      label: 'Total Assets',
      value: assets.length,
      color: 'text-primary',
    },
    {
      label: 'Returnable',
      value: assets.filter(a => a.assetType === 'Returnable').length,
      color: 'text-info',
    },
    {
      label: 'Non-returnable',
      value: assets.filter(a => a.assetType === 'Non-returnable').length,
      color: 'text-warning',
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-base-900">My Assets</h1>
              <p className="text-base-600 mt-2">View and manage your assigned assets</p>
            </div>
            <button
              onClick={handlePrint}
              className="btn btn-outline gap-2"
            >
              <PrinterIcon className="w-5 h-5" />
              Print Report
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card bg-base-100 border border-base-300"
              >
                <div className="card-body">
                  <p className="text-base-600 text-sm">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 border border-base-300 mb-6"
          >
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="form-control">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search assets..."
                      className="input input-bordered flex-1"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-square btn-primary">
                      <SearchIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filter */}
                <select
                  className="select select-bordered"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="returnable">Returnable Only</option>
                  <option value="non-returnable">Non-returnable Only</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Assets Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="loading loading-spinner loading-lg text-primary"></div>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body text-center py-16">
                  <p className="text-5xl mb-4">📦</p>
                  <p className="text-base-600">No assets found</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset, idx) => (
                  <motion.div
                    key={asset._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow"
                  >
                    <figure>
                      {asset.assetImage && (
                        <img
                          src={asset.assetImage}
                          alt={asset.assetName}
                          className="w-full h-48 object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </figure>

                    <div className="card-body">
                      <h2 className="card-title text-base-900">{asset.assetName}</h2>

                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-base-600">Company</p>
                          <p className="font-semibold">{asset.companyName}</p>
                        </div>

                        <div>
                          <p className="text-base-600">Type</p>
                          <span className={`badge ${
                            asset.assetType === 'Returnable'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}>
                            {asset.assetType}
                          </span>
                        </div>

                        <div>
                          <p className="text-base-600">Status</p>
                          <span className={`badge ${
                            asset.status === 'assigned'
                              ? 'badge-success'
                              : 'badge-ghost'
                          }`}>
                            {asset.status}
                          </span>
                        </div>

                        <div>
                          <p className="text-base-600">Assigned Date</p>
                          <p className="font-semibold">
                            {new Date(asset.assignmentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="card-actions mt-4">
                        {asset.assetType === 'Returnable' && asset.status === 'assigned' && (
                          <button
                            onClick={() => setReturnId(asset._id)}
                            className="btn btn-outline btn-sm w-full gap-2"
                          >
                            <UndoIcon className="w-4 h-4" />
                            Return Asset
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Print Section (Hidden) */}
          <div style={{ display: 'none' }}>
            <div ref={printRef} className="p-8 bg-white">
              <h1 className="text-3xl font-bold mb-4">My Assets Report</h1>
              <p className="text-gray-600 mb-8">
                Generated on {new Date().toLocaleDateString()}
              </p>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Asset Name</th>
                    <th className="border border-gray-300 p-2 text-left">Company</th>
                    <th className="border border-gray-300 p-2 text-left">Type</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset._id}>
                      <td className="border border-gray-300 p-2">{asset.assetName}</td>
                      <td className="border border-gray-300 p-2">{asset.companyName}</td>
                      <td className="border border-gray-300 p-2">{asset.assetType}</td>
                      <td className="border border-gray-300 p-2">{asset.status}</td>
                      <td className="border border-gray-300 p-2">
                        {new Date(asset.assignmentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {returnId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Return Asset?</h3>
            <p className="text-base-600 mb-6">
              Are you sure you want to return this asset? It will be returned to the company's inventory.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setReturnId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleReturn(returnId)}
              >
                Return
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setReturnId(null)}></div>
        </div>
      )}
    </div>
  );
};

export default MyAssets;
