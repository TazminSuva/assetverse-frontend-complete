import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { assetAPI } from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';

const AddAsset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    productImage: '',
    productType: 'Non-returnable',
    productQuantity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productQuantity' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.productQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.productQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setLoading(true);

    try {
      await assetAPI.addAsset({
        productName: formData.productName,
        productImage: formData.productImage || 'https://via.placeholder.com/200',
        productType: formData.productType,
        productQuantity: formData.productQuantity,
      });

      toast.success('Asset added successfully!');
      navigate('/hr/assets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-base-100">
      <Navbar />

      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/hr/assets')}
              className="btn btn-ghost btn-sm gap-2 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Assets
            </button>
            <h1 className="text-4xl font-bold text-base-900">Add New Asset</h1>
            <p className="text-base-600 mt-2">Create a new asset for your company inventory</p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-base-100 shadow-2xl border border-base-300"
          >
            <form onSubmit={handleSubmit} className="card-body space-y-6">
              {/* Product Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Product Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dell Laptop, Office Chair"
                  className="input input-bordered focus:input-primary transition-colors"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Product Image */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Product Image URL</span>
                  <span className="label-text-alt">Optional</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered focus:input-primary transition-colors"
                  name="productImage"
                  value={formData.productImage}
                  onChange={handleChange}
                />
                {formData.productImage && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={formData.productImage}
                      alt="Preview"
                      className="max-w-xs rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        toast.error('Image URL is invalid');
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Product Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Asset Type *</span>
                </label>
                <select
                  className="select select-bordered focus:select-primary transition-colors"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                >
                  <option value="Non-returnable">Non-returnable</option>
                  <option value="Returnable">Returnable</option>
                </select>
                <label className="label">
                  <span className="label-text-alt text-base-600">
                    {formData.productType === 'Returnable'
                      ? 'Employees can return this asset'
                      : 'Asset is permanent assignment'
                    }
                  </span>
                </label>
              </div>

              {/* Quantity */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Quantity *</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="input input-bordered focus:input-primary transition-colors"
                  name="productQuantity"
                  value={formData.productQuantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              {/* Info Box */}
              <div className="alert alert-info bg-blue-50 border border-blue-200">
                <div className="flex gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div>
                    <p className="font-semibold text-blue-900">Asset Information</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Make sure you have the correct asset details before adding. You can edit or delete assets later from the asset list.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-base-300">
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={() => navigate('/hr/assets')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Add Asset'
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 card bg-base-100 border border-base-300"
          >
            <div className="card-body">
              <h3 className="card-title text-base-900">Tips for Adding Assets</h3>
              <ul className="list-disc list-inside space-y-2 text-base-600 text-sm">
                <li>Use clear, descriptive names for assets (e.g., "Dell Laptop 15-inch")</li>
                <li>Add product images for better visibility (use ImgBB or similar services)</li>
                <li>Mark returnable items appropriately for return tracking</li>
                <li>Set accurate quantities to avoid over-allocation</li>
                <li>You can always edit asset details later</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;
