import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/layout/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FinancialReports from './pages/FinancialReports';
import SubmitReport from './pages/SubmitReport';
import BusinessDashboard from './pages/BusinessDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import TaxManagement from './pages/TaxManagement';
import AllReports from './pages/AllReports';
import Businesses from './pages/Businesses';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const RoleBasedRoute: React.FC<{ children: React.ReactNode; allowedRole: string }> = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return user?.role === allowedRole ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {user?.role === 'business' ? <BusinessDashboard /> : <GovernmentDashboard />}
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/financial-reports"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="business">
                  <FinancialReports />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-report"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="business">
                  <SubmitReport />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/tax-management"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="business">
                  <TaxManagement />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="government">
                  <AllReports />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/businesses"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="government">
                  <Businesses />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
