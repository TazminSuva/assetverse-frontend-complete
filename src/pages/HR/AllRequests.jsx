import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { requestAPI } from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckIcon, XIcon, FilterIcon } from 'lucide-react';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getRequests();
      setRequests(response.data.requests || []);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await requestAPI.approveRequest(approveModal._id);
      fetchRequests();
      setApproveModal(null);
      toast.success('Request approved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async () => {
    try {
      await requestAPI.rejectRequest(rejectModal._id);
      fetchRequests();
      setRejectModal(null);
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const filteredRequests = requests.filter(req =>
    filterStatus === 'all' ? true : req.requestStatus === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-ghost';
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
            <h1 className="text-4xl font-bold text-base-900">Asset Requests</h1>
            <p className="text-base-600 mt-2">Review and manage employee asset requests</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Requests', value: requests.length, color: 'text-primary' },
              { label: 'Pending', value: requests.filter(r => r.requestStatus === 'pending').length, color: 'text-warning' },
              { label: 'Approved', value: requests.filter(r => r.requestStatus === 'approved').length, color: 'text-success' },
              { label: 'Rejected', value: requests.filter(r => r.requestStatus === 'rejected').length, color: 'text-error' },
            ].map((stat, idx) => (
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

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 border border-base-300 mb-6"
          >
            <div className="card-body">
              <div className="flex gap-2 items-center flex-wrap">
                <FilterIcon className="w-5 h-5 text-base-600" />
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-success' : 'btn-outline'}`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilterStatus('rejected')}
                  className={`btn btn-sm ${filterStatus === 'rejected' ? 'btn-error' : 'btn-outline'}`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </motion.div>

          {/* Requests Table */}
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
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-base-600">No requests found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead className="bg-base-200">
                      <tr>
                        <th>Employee</th>
                        <th>Asset</th>
                        <th>Type</th>
                        <th>Request Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request._id} className="hover:bg-base-200 transition-colors">
                          <td>
                            <div>
                              <p className="font-semibold">{request.requesterName}</p>
                              <p className="text-xs text-base-600">{request.requesterEmail}</p>
                            </div>
                          </td>
                          <td className="font-semibold">{request.assetName}</td>
                          <td>
                            <span className={`badge ${
                              request.assetType === 'Returnable'
                                ? 'badge-info'
                                : 'badge-warning'
                            }`}>
                              {request.assetType}
                            </span>
                          </td>
                          <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${getStatusColor(request.requestStatus)}`}>
                              {request.requestStatus}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {request.requestStatus === 'pending' && (
                                <>
                                  <button
                                    onClick={() => setApproveModal(request)}
                                    className="btn btn-success btn-sm gap-1"
                                  >
                                    <CheckIcon className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setRejectModal(request)}
                                    className="btn btn-error btn-sm gap-1"
                                  >
                                    <XIcon className="w-4 h-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Approve Request?</h3>
            <div className="space-y-2 text-base-600 mb-6">
              <p><strong>Employee:</strong> {approveModal.requesterName}</p>
              <p><strong>Asset:</strong> {approveModal.assetName}</p>
              <p><strong>Note:</strong> {approveModal.note || 'No note provided'}</p>
            </div>
            <p className="text-sm text-warning mb-6">
              This action will assign the asset to the employee and deduct from inventory.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setApproveModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setApproveModal(null)}></div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Reject Request?</h3>
            <div className="space-y-2 text-base-600 mb-6">
              <p><strong>Employee:</strong> {rejectModal.requesterName}</p>
              <p><strong>Asset:</strong> {rejectModal.assetName}</p>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setRejectModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setRejectModal(null)}></div>
        </div>
      )}
    </div>
  );
};

export default AllRequests;
