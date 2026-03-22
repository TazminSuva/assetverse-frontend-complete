import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CameraIcon, SaveIcon, EditIcon, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profileImage: user?.profileImage || '',
  });

  const [displayedForm, setDisplayedForm] = useState(formData);

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      profileImage: user?.profileImage || '',
    });
    setDisplayedForm({
      name: user?.name || '',
      profileImage: user?.profileImage || '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisplayedForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!displayedForm.name) {
      toast.error('Name cannot be empty');
      return;
    }

    setLoading(true);

    try {
      await userAPI.updateProfile({
        name: displayedForm.name,
        profileImage: displayedForm.profileImage,
      });

      updateUser({
        name: displayedForm.name,
        profileImage: displayedForm.profileImage,
      });

      setEditing(false);
      setFormData(displayedForm);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayedForm(formData);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold text-base-900">My Profile</h1>
              <p className="text-base-600 mt-2">Manage your account information</p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary gap-2"
              >
                <EditIcon className="w-5 h-5" />
                Edit Profile
              </button>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card bg-base-100 border border-base-300 sticky top-8">
                <div className="card-body items-center text-center">
                  {/* Profile Image */}
                  <div className="avatar placeholder mb-4">
                    <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-24">
                      {displayedForm.profileImage ? (
                        <img
                          src={displayedForm.profileImage}
                          alt="Profile"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ) : (
                        <span className="text-3xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="badge badge-primary text-white capitalize">
                    {user?.role}
                  </div>

                  {/* Email */}
                  <p className="text-base-600 text-sm mt-4 break-all">{user?.email}</p>

                  {/* Info */}
                  <div className="divider my-4"></div>

                  {user?.role === 'hr' && (
                    <>
                      <p className="text-sm text-base-600">Company</p>
                      <p className="font-semibold text-base-900">{user?.companyName || 'N/A'}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                  <h2 className="card-title text-base-900 mb-6">
                    {editing ? 'Edit Profile' : 'Profile Information'}
                  </h2>

                  <div className="space-y-6">
                    {/* Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Full Name</span>
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          className="input input-bordered focus:input-primary"
                          name="name"
                          value={displayedForm.name}
                          onChange={handleChange}
                        />
                      ) : (
                        <input
                          type="text"
                          className="input input-bordered bg-base-200"
                          value={displayedForm.name}
                          disabled
                        />
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email Address</span>
                        <span className="label-text-alt text-warning">Read-only</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered bg-base-200"
                        value={user?.email}
                        disabled
                      />
                    </div>

                    {/* Role */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Role</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered bg-base-200 capitalize"
                        value={user?.role}
                        disabled
                      />
                    </div>

                    {/* Profile Image URL */}
                    {editing && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Profile Image URL</span>
                          <span className="label-text-alt">Optional</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          className="input input-bordered focus:input-primary"
                          name="profileImage"
                          value={displayedForm.profileImage}
                          onChange={handleChange}
                        />
                        {displayedForm.profileImage && (
                          <div className="mt-3 flex justify-center">
                            <img
                              src={displayedForm.profileImage}
                              alt="Preview"
                              className="w-24 h-24 rounded-lg object-cover shadow-md"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* HR Specific Info */}
                    {user?.role === 'hr' && (
                      <>
                        <div className="divider my-4">Company Information</div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Company Name</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered bg-base-200"
                            value={user?.companyName || 'N/A'}
                            disabled
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Package</span>
                            </label>
                            <input
                              type="text"
                              className="input input-bordered bg-base-200 capitalize"
                              value={user?.subscription || 'Basic'}
                              disabled
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Employee Limit</span>
                            </label>
                            <input
                              type="text"
                              className="input input-bordered bg-base-200"
                              value={`${user?.currentEmployees || 0}/${user?.packageLimit || 5}`}
                              disabled
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions mt-8 justify-end gap-2">
                    {editing && (
                      <>
                        <button
                          onClick={handleCancel}
                          className="btn btn-outline gap-2"
                          disabled={loading}
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="btn btn-primary gap-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            <>
                              <SaveIcon className="w-5 h-5" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-blue-50 border border-blue-200"
            >
              <div className="card-body">
                <h3 className="card-title text-blue-900">Account Information</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm mt-3">
                  <li>Your email address cannot be changed</li>
                  <li>For security, contact support to change your password</li>
                  <li>Profile updates are saved immediately</li>
                </ul>
              </div>
            </motion.div>

            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-amber-50 border border-amber-200"
            >
              <div className="card-body">
                <h3 className="card-title text-amber-900">Security & Privacy</h3>
                <ul className="list-disc list-inside space-y-2 text-amber-800 text-sm mt-3">
                  <li>Keep your password secure and confidential</li>
                  <li>Enable two-factor authentication for better security</li>
                  <li>Review active sessions regularly</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
