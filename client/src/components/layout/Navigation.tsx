import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../ui/Button';

export const Navigation: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderMenuItems = () => {
    if (!user) return null;

    const commonItems = [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/profile', label: 'Profile' },
    ];

    const businessItems = [
      { to: '/financial-reports', label: 'Financial Reports' },
      { to: '/submit-report', label: 'Submit Report' },
    ];

    const governmentItems = [
      { to: '/businesses', label: 'Businesses' },
      { to: '/reports', label: 'All Reports' },
      { to: '/tax-management', label: 'Tax Management' },
    ];

    const roleSpecificItems = user.role === 'business' ? businessItems : governmentItems;

    return [...commonItems, ...roleSpecificItems];
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Tax Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {renderMenuItems()?.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 