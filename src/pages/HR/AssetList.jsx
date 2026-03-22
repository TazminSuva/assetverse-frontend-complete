import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { assetAPI } from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, PlusIcon, SearchIcon } from 'lucide-react';

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssets();
  }, [currentPage]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await assetAPI.getAssets(currentPage, itemsPerPage);
      setAssets(response.data.assets || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await assetAPI.deleteAsset(id);
      setAssets(assets.filter(a => a._id !== id));
      setDeleteId(null);
      toast.success('Asset deleted successfully');
    } catch (error) {
      toast.error('Failed to delete asset');
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset._id);
    setEditForm(asset);
  };

  const handleSaveEdit = async () => {
    try {
      await assetAPI.updateAsset(editingId, editForm);
      fetchAssets();
      setEditingId(null);
      toast.success('Asset updated successfully');
    } catch (error) {
      toast.error('Failed to update asset');
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
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-base-900">Assets</h1>
              <p className="text-base-600 mt-2">Manage company assets and inventory</p>
            </div>
            <Link
              to="/hr/add-asset"
              className="btn btn-primary gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Asset
            </Link>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 border border-base-300 mb-6"
          >
            <div className="card-body">
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="input input-bordered flex-1"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <button className="btn btn-square btn-primary">
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assets Table */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-base-100 border border-base-300 overflow-hidden"
          >
            <div className="card-body p-0">
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-base-600 mb-4">No assets found</p>
                  <Link to="/hr/add-asset" className="btn btn-primary btn-sm">
                    Create First Asset
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead className="bg-base-200">
                      <tr>
                        <th>Product Name</th>
                        <th>Type</th>
                        <th>Total Qty</th>
                        <th>Available</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr key={asset._id} className="hover:bg-base-200 transition-colors">
                          <td>
                            <div className="flex items-center gap-3">
                              {asset.productImage && (
                                <div className="avatar">
                                  <div className="mask mask-squircle w-12 h-12">
                                    <img
                                      src={asset.productImage}
                                      alt={asset.productName}
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  </div>
                                </div>
                              )}
                              <span className="font-semibold">{asset.productName}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              asset.productType === 'Returnable'
                                ? 'badge-info'
                                : 'badge-warning'
                            }`}>
                              {asset.productType}
                            </span>
                          </td>
                          <td>{asset.productQuantity}</td>
                          <td>
                            <span className={`font-semibold ${
                              asset.availableQuantity > 0
                                ? 'text-success'
                                : 'text-error'
                            }`}>
                              {asset.availableQuantity}
                            </span>
                          </td>
                          <td>{new Date(asset.dateAdded).toLocaleDateString()}</td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(asset)}
                                className="btn btn-ghost btn-sm"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(asset._id)}
                                className="btn btn-ghost btn-sm text-error"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination.pages > 1 && (
                <div className="card-body pt-4 border-t border-base-300">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-base-600">
                      Page {pagination.page} of {pagination.pages}
                    </p>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                        disabled={currentPage === pagination.pages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Delete Modal */}
          {deleteId && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Delete Asset?</h3>
                <p className="text-base-600 mb-6">
                  Are you sure you want to delete this asset? This action cannot be undone.
                </p>
                <div className="modal-action">
                  <button
                    className="btn btn-outline"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(deleteId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="modal-backdrop" onClick={() => setDeleteId(null)}></div>
            </div>
          )}

          {/* Edit Modal */}
          {editingId && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Edit Asset</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="input input-bordered w-full"
                    value={editForm.productName || ''}
                    onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                  />
                  <select
                    className="select select-bordered w-full"
                    value={editForm.productType || ''}
                    onChange={(e) => setEditForm({ ...editForm, productType: e.target.value })}
                  >
                    <option>Select Type</option>
                    <option>Returnable</option>
                    <option>Non-returnable</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="input input-bordered w-full"
                    value={editForm.productQuantity || ''}
                    onChange={(e) => setEditForm({ ...editForm, productQuantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="modal-action mt-6">
                  <button
                    className="btn btn-outline"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              <div className="modal-backdrop" onClick={() => setEditingId(null)}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetList;
