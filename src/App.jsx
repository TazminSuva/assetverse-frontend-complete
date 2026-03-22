import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterHR from './pages/RegisterHR';
import RegisterEmployee from './pages/RegisterEmployee';
import NotFound from './pages/NotFound';
import JoinUs from './pages/JoinUs';
import About from './pages/About';

// HR Dashboard Pages
import HRDashboard from './pages/HR/HRDashboard';
import AssetList from './pages/HR/AssetList';
import AddAsset from './pages/HR/AddAsset';
import AllRequests from './pages/HR/AllRequests';
import EmployeeList from './pages/HR/EmployeeList';
import UpgradePackage from './pages/HR/UpgradePackage';

// Employee Dashboard Pages
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import MyAssets from './pages/Employee/MyAssets';
import RequestAsset from './pages/Employee/RequestAsset';
import MyTeam from './pages/Employee/MyTeam';

// Shared Pages
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/hr" element={<RegisterHR />} />
        <Route path="/register/employee" element={<RegisterEmployee />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/about-us" element={<About />} />

        {/* HR Routes */}
        <Route 
          path="/hr/dashboard" 
          element={<PrivateRoute requiredRole="hr"><HRDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/hr/assets" 
          element={<PrivateRoute requiredRole="hr"><AssetList /></PrivateRoute>} 
        />
        <Route 
          path="/hr/add-asset" 
          element={<PrivateRoute requiredRole="hr"><AddAsset /></PrivateRoute>} 
        />
        <Route 
          path="/hr/requests" 
          element={<PrivateRoute requiredRole="hr"><AllRequests /></PrivateRoute>} 
        />
        <Route 
          path="/hr/employees" 
          element={<PrivateRoute requiredRole="hr"><EmployeeList /></PrivateRoute>} 
        />
        <Route 
          path="/hr/upgrade" 
          element={<PrivateRoute requiredRole="hr"><UpgradePackage /></PrivateRoute>} 
        />

        {/* Employee Routes */}
        <Route 
          path="/employee/dashboard" 
          element={<PrivateRoute requiredRole="employee"><EmployeeDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/employee/my-assets" 
          element={<PrivateRoute requiredRole="employee"><MyAssets /></PrivateRoute>} 
        />
        <Route 
          path="/employee/request-asset" 
          element={<PrivateRoute requiredRole="employee"><RequestAsset /></PrivateRoute>} 
        />
        <Route 
          path="/employee/my-team" 
          element={<PrivateRoute requiredRole="employee"><MyTeam /></PrivateRoute>} 
        />

        {/* Shared Routes */}
        <Route 
          path="/profile" 
          element={<PrivateRoute><Profile /></PrivateRoute>} 
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
