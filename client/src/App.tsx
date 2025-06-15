import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store';
import Login from './components/auth/Login';
import BusinessRegistration from './components/business/BusinessRegistration';
import ProtectedRoute from './components/shared/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/register-business"
              element={
                <ProtectedRoute>
                  <BusinessRegistration />
                </ProtectedRoute>
              }
            />
            {/* Add more routes here */}
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
