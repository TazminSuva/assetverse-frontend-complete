import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { assetAPI, requestAPI } from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SendIcon, SearchIcon } from 'lucide-react';

const RequestAsset = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAvailableAssets();
  }, []);

  const fetchAvailableAssets = async () => {
    try {
      setLoading(true);
      const response = await assetAPI.getAvailableAssets();
      setAssets(response.data.assets || []);
    } catch (error) {
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true :
      (filterType === 'returnable' && asset.productType === 'Returnable') ||
      (filterType === 'non-returnable' && asset.productType === 'Non-returnable');
    return matchesSearch && matchesType;
  });

  const handleRequestAsset = async (asset) => {
    setSelectedAsset(asset);
  };

  const submitRequest = async () => {
    if (!selectedAsset) return;

    setSubmitting(true);

    try {
      await requestAPI.createRequest({
        assetId: selectedAsset._id,
        note: note || 'No note provided',
      });

      toast.success('Request submitted successfully! Waiting for approval...');
      setSelectedAsset(null);
      setNote('');
      fetchAvailableAssets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };
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
            <h1 className="text-4xl font-bold text-base-900">Request an Asset</h1>
            <p className="text-base-600 mt-2">Browse and request assets from your company</p>
          </motion.div>
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
                  <p className="text-5xl mb-4">📭</p>
                  <p className="text-base-600">No assets available</p>
                  <p className="text-sm text-base-500 mt-2">
                    All assets are currently assigned. Please try again later.
                  </p>
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
                      {asset.productImage && (
                        <img
                          src={asset.productImage}
                          alt={asset.productName}
                          className="w-full h-48 object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      {!asset.productImage && (
                        <div className="w-full h-48 bg-base-200 flex items-center justify-center">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                    </figure>

                    <div className="card-body">
                      <h2 className="card-title text-base-900 text-lg">{asset.productName}</h2>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-base-600">Company</span>
                          <span className="font-semibold">{asset.companyName}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-base-600">Type</span>
                          <span className={`badge ${
                            asset.productType === 'Returnable'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}>
                            {asset.productType}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-base-600">Available</span>
                          <span className="font-semibold text-success">
                            {asset.availableQuantity} units
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-base-600">Total</span>
                          <span className="font-semibold">{asset.productQuantity} units</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <progress
                        className="progress progress-success w-full mt-4"
                        value={asset.availableQuantity}
                        max={asset.productQuantity}
                      ></progress>

                      <div className="card-actions mt-4">
                        <button
                          onClick={() => handleRequestAsset(asset)}
                          className="btn btn-primary w-full gap-2"
                        >
                          <SendIcon className="w-4 h-4" />
                          Request Asset
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Request Modal */}
      {selectedAsset && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Request Asset</h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-base-600">Asset</p>
                <p className="text-lg font-semibold">{selectedAsset.productName}</p>
              </div>

              <div>
                <p className="text-sm text-base-600">Company</p>
                <p className="text-lg font-semibold">{selectedAsset.companyName}</p>
              </div>

              <div>
                <p className="text-sm text-base-600">Type</p>
                <p className="text-lg font-semibold">{selectedAsset.productType}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Notes (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Add any notes for the HR manager..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>
            </div>

            <div className="alert alert-info bg-blue-50 border-blue-200 mb-6">
              <p className="text-sm text-blue-900">
                💡 Your request will be reviewed by the HR manager. You'll be notified once it's approved or rejected.
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedAsset(null)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={submitRequest}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => !submitting && setSelectedAsset(null)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default RequestAsset;
