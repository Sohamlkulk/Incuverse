import { useState } from 'react';
import { LogIn, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onAdminClick: () => void;
}

export const Login = ({ onAdminClick }: LoginProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const success = isSignup ? await signup(email, password) : await login(email, password);

    if (!success) {
      setError(isSignup ? 'Email already exists' : 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isSignup ? 'Sign up to start shopping' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isSignup ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onAdminClick}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Admin Portal
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Admin Credentials:</p>
          <p className="font-mono text-xs mt-1">admin@gmail.com / Admin@123</p>
        </div>
      </div>
    </div>
  );
};
