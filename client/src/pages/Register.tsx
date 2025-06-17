import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { register } from '../store/slices/authSlice';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'business'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className='bg-black'
              required
            />
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className='bg-black'
              required
            />
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className='bg-black'
              required
            />
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'business', label: 'Business Owner' },
                { value: 'government', label: 'Government Worker' }
              ]}
              className='bg-black'
            />
          </div>

          <div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 