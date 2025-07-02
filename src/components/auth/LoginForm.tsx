import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';

interface LoginFormProps {
  role: UserRole;
}

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {

  const navigate = useNavigate();
  const { loginAfter, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
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
      await loginAfter(email, password,role);
      
      if (role === 'vendor') {
        console.log(role);
        navigate('/vendor/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">
          {role === 'vendor' ? 'Vendor Login' : 'Customer Login'}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
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
            placeholder="Enter your password"
            fullWidth
            required
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Log In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          {role === 'vendor'
            ? "Don't have a vendor account? "
            : "Don't have an account? "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(role === 'vendor' ? '/vendor/register' : '/register')}
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
