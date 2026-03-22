import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { employeeAPI } from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Users2Icon, CakeIcon, MailIcon, BriefcaseIcon } from 'lucide-react';

const MyTeam = () => {
  const [affiliations, setAffiliations] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock team members - In production, fetch from API
  const mockTeamMembers = {
    'Tech Corp': [
      { name: 'Alice Johnson', email: 'alice@techcorp.com', dateOfBirth: '1990-05-15', role: 'Senior Developer' },
      { name: 'Bob Smith', email: 'bob@techcorp.com', dateOfBirth: '1992-03-20', role: 'Product Manager' },
      { name: 'Carol Davis', email: 'carol@techcorp.com', dateOfBirth: '1991-07-10', role: 'Designer' },
    ],
    'Design Studio': [
      { name: 'David Wilson', email: 'david@design.com', dateOfBirth: '1989-09-25', role: 'Lead Designer' },
      { name: 'Emma Brown', email: 'emma@design.com', dateOfBirth: '1993-11-30', role: 'UX Designer' },
    ],
  };

  useEffect(() => {
    fetchAffiliations();
  }, []);

  const fetchAffiliations = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getMyAffiliations();
      const aff = response.data.affiliations || [];
      setAffiliations(aff);
      if (aff.length > 0) {
        setSelectedCompany(aff[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthBirthdays = (teamMembers) => {
    const currentMonth = new Date().getMonth();
    return teamMembers.filter(member => {
      const birthDate = new Date(member.dateOfBirth);
      return birthDate.getMonth() === currentMonth;
    });
  };

  const teamMembers = selectedCompany
    ? mockTeamMembers[selectedCompany.companyName] || []
    : [];

  const birthdaysThisMonth = getCurrentMonthBirthdays(teamMembers);

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
            <h1 className="text-4xl font-bold text-base-900">My Team</h1>
            <p className="text-base-600 mt-2">View and connect with your team members</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : affiliations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body text-center py-16">
                <p className="text-5xl mb-4">👥</p>
                <p className="text-base-600">No company affiliation yet</p>
                <p className="text-sm text-base-500 mt-2">
                  Request an asset to get affiliated with a company and see team members.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Company Tabs */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="card bg-base-100 border border-base-300 sticky top-8">
                  <div className="card-body">
                    <h3 className="card-title text-base-900 text-lg">My Companies</h3>
                    <div className="space-y-2 mt-4">
                      {affiliations.map((aff) => (
                        <button
                          key={aff._id}
                          onClick={() => setSelectedCompany(aff)}
                          className={`btn btn-block btn-sm justify-start ${
                            selectedCompany?._id === aff._id
                              ? 'btn-primary'
                              : 'btn-outline'
                          }`}
                        >
                          <div className="flex items-center gap-2 w-full">
                            {aff.companyLogo && (
                              <img
                                src={aff.companyLogo}
                                alt={aff.companyName}
                                className="w-6 h-6 rounded object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                            <span className="truncate">{aff.companyName}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Team Members */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3 space-y-8"
              >
                {selectedCompany && (
                  <>
                    {/* Company Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-base-300"
                    >
                      <div className="card-body">
                        <div className="flex items-center gap-4">
                          {selectedCompany.companyLogo && (
                            <img
                              src={selectedCompany.companyLogo}
                              alt={selectedCompany.companyName}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <div>
                            <h2 className="text-2xl font-bold text-base-900">
                              {selectedCompany.companyName}
                            </h2>
                            <p className="text-base-600">
                              Joined {new Date(selectedCompany.affiliationDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Birthdays This Month */}
                    {birthdaysThisMonth.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card bg-amber-50 border border-amber-200"
                      >
                        <div className="card-body">
                          <h3 className="card-title text-amber-900 gap-2 text-lg">
                            <CakeIcon className="w-5 h-5" />
                            Upcoming Birthdays
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {birthdaysThisMonth.map((member, idx) => (
                              <div key={idx} className="bg-white rounded-lg p-3 border border-amber-200">
                                <p className="font-semibold text-amber-900">{member.name}</p>
                                <p className="text-sm text-amber-700">
                                  🎂 {new Date(member.dateOfBirth).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Team Members List */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card bg-base-100 border border-base-300"
                    >
                      <div className="card-body">
                        <h3 className="card-title text-base-900 gap-2 text-lg">
                          <Users2Icon className="w-5 h-5" />
                          Team Members ({teamMembers.length})
                        </h3>

                        {teamMembers.length === 0 ? (
                          <p className="text-base-600 mt-4">No team members yet</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {teamMembers.map((member, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card bg-base-200 border border-base-300"
                              >
                                <div className="card-body">
                                  {/* Avatar */}
                                  <div className="avatar placeholder mb-3">
                                    <div className="bg-primary text-white rounded-full w-12">
                                      <span className="text-lg">
                                        {member.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Info */}
                                  <h4 className="font-semibold text-base-900">
                                    {member.name}
                                  </h4>

                                  <div className="space-y-2 text-sm mt-2">
                                    <div className="flex items-center gap-2 text-base-600">
                                      <BriefcaseIcon className="w-4 h-4" />
                                      {member.role}
                                    </div>

                                    <div className="flex items-center gap-2 text-base-600">
                                      <MailIcon className="w-4 h-4" />
                                      <a
                                        href={`mailto:${member.email}`}
                                        className="link link-primary text-xs"
                                      >
                                        {member.email}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
