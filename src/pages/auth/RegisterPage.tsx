import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, isLoading } = useAuthStore();

  const [role, setRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      await login(email,password); 
      setOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      const success = await verifyOtp(email,password,otp, role); 

      if (success) {
        if (role === 'vendor') {
          navigate('/vendor/profile/setup');
        } else {
          navigate('/customer/profile/setup');
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-center space-x-4 mb-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  role === 'customer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setRole('customer')}
              >
                Customer
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  role === 'vendor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setRole('vendor')}
              >
                Vendor
              </button>
            </div>
            <p className="text-center text-sm text-gray-600">
              Register as a {role === 'customer' ? 'customer to book services' : 'vendor to offer services'}
            </p>
          </CardHeader>

          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  fullWidth
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password"
                  fullWidth
                  required
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  Send OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    We've sent a 6-digit OTP to your email address. Please check your inbox and enter it below.
                  </p>
                </div>
                <Input
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  fullWidth
                  required
                  maxLength={6}
                  pattern="[0-9]*"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  Verify OTP
                </Button>
                <button
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 w-full text-center"
                  onClick={() => setOtpSent(false)}
                >
                  Change Email
                </button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
