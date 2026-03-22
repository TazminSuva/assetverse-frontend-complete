import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getNavLinks = () => {
    if (user?.role === 'hr') {
      return [
        { label: 'Assets', path: '/hr/assets' },
        { label: 'Add Asset', path: '/hr/add-asset' },
        { label: 'Requests', path: '/hr/requests' },
        { label: 'Employees', path: '/hr/employees' },
        { label: 'Upgrade', path: '/hr/upgrade' },
      ];
    }

    if (user?.role === 'employee') {
      return [
        { label: 'My Assets', path: '/employee/my-assets' },
        { label: 'Request Asset', path: '/employee/request-asset' },
        { label: 'My Team', path: '/employee/my-team' },
      ];
    }

    return [];
  };

  return (
    <nav className="navbar bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
          AssetVerse
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-2 flex-1 justify-center">
        {!isAuthenticated && (
          <>
            <Link to="/" className="btn btn-ghost btn-sm">
              Home
            </Link>
            <Link to="/join-us" className="btn btn-ghost btn-sm">
              Join Us
            </Link>
            <Link to="/about-us" className="btn btn-ghost btn-sm">
              About Us
            </Link>
          </>
        )}
        {isAuthenticated && getNavLinks().map((link) => (
          <Link key={link.path} to={link.path} className="btn btn-ghost btn-sm">
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex-none">
        {!isAuthenticated ? (
          <div className="flex gap-2 items-center">
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-primary btn-sm">
                Register
              </button>
              <ul 
                tabIndex={0} 
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
              >
                <li>
                  <Link to="/register/hr">Register as HR</Link>
                </li>
                <li>
                  <Link to="/register/employee">Register as Employee</Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <button 
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
            {isDropdownOpen && (
              <ul 
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
              >
                <li className="menu-title">
                  <span>{user?.name}</span>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="flex-none lg:hidden">
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <ul 
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
            >
              {!isAuthenticated && (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/join-us">Join Us</Link></li>
                  <li><Link to="/about-us">About Us</Link></li>
                </>
              )}
              {isAuthenticated && getNavLinks().map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
