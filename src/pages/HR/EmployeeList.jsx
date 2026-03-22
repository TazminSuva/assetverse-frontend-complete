import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { hrAPI } from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { TrashIcon, UserIcon, MailIcon, CalendarIcon } from 'lucide-react';

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeId, setRemoveId] = useState(null);

  // Mock data - In production, fetch from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await hrAPI.getEmployees();
      // Need to convert affiliationDate from ISO string back to Date object
      const data = response.data.employees.map(emp => ({
        ...emp,
        affiliationDate: new Date(emp.affiliationDate)
      }));
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      // TODO: Implement API call to remove employee
      setEmployees(employees.filter(emp => emp._id !== id));
      setRemoveId(null);
      toast.success('Employee removed from team');
    } catch (error) {
      toast.error('Failed to remove employee');
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
            <h1 className="text-4xl font-bold text-base-900">Team Members</h1>
            <p className="text-base-600 mt-2">Manage your company's affiliated employees</p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-base-300 mb-8"
          >
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base-600">Total Employees</p>
                  <p className="text-4xl font-bold text-primary">{employees.length}</p>
                </div>
                <div>
                  <p className="text-base-600">Package Limit</p>
                  <p className="text-4xl font-bold text-primary">{user?.packageLimit || 5}</p>
                </div>
                <div>
                  <p className="text-base-600">Remaining Slots</p>
                  <p className={`text-4xl font-bold ${(user?.packageLimit || 5) - employees.length > 0 ? 'text-success' : 'text-error'}`}>
                    {(user?.packageLimit || 5) - employees.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Employees Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : employees.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body text-center py-16">
                <p className="text-5xl mb-4">👥</p>
                <p className="text-base-600">No employees affiliated yet</p>
                <p className="text-sm text-base-500 mt-2">Employees will appear here after their first asset request</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee, idx) => (
                <motion.div
                  key={employee._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow"
                >
                  <div className="card-body">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-white rounded-full w-16">
                          <span className="text-2xl">
                            {employee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="card-title text-base-900 text-center justify-center">
                      {employee.name}
                    </h3>

                    {/* Details */}
                    <div className="space-y-3 my-4">
                      <div className="flex items-center gap-2 text-base-600 text-sm">
                        <MailIcon className="w-4 h-4" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-base-600 text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Joined {employee.affiliationDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-base-600 text-sm">
                        <UserIcon className="w-4 h-4" />
                        <span>{employee.assetsCount} assets assigned</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="card-actions">
                      <button
                        onClick={() => setRemoveId(employee._id)}
                        className="btn btn-outline btn-error w-full gap-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove from Team
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-blue-50 border border-blue-200 mt-8"
          >
            <div className="card-body">
              <h3 className="card-title text-blue-900">How Employee Affiliation Works</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm">
                <li>Employees are automatically affiliated when you approve their first asset request</li>
                <li>You can manage affiliations and remove employees from your team</li>
                <li>Removing an employee will return all their assets to inventory</li>
                <li>Upgrade your package to add more employee slots</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Remove Modal */}
      {removeId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Remove Employee?</h3>
            <p className="text-base-600 mb-6">
              This employee will be removed from your team. All assigned assets will be returned to inventory.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setRemoveId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleRemove(removeId)}
              >
                Remove
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setRemoveId(null)}></div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
