import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold">
              Tax Tracker
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-gray-300">
                Profile
              </Link>
              
              {user.role === 'business' && (
                <>
                  <Link to="/financial-reports" className="hover:text-gray-300">
                    My Reports
                  </Link>
                  <Link to="/submit-report" className="hover:text-gray-300">
                    Submit Report
                  </Link>
                  <Link to="/tax-management" className="hover:text-gray-300">
                    Tax Management
                  </Link>
                </>
              )}

              {user.role === 'government' && (
                <>
                  <Link to="/reports" className="hover:text-gray-300">
                    All Reports
                  </Link>
                  <Link to="/businesses" className="hover:text-gray-300">
                    Businesses
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}; 