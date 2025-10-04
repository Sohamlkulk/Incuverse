import { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  onClose: () => void;
}

export const AdminLogin = ({ onClose }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);

    if (!success) {
      setError('Invalid admin credentials');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email);

    if (!user?.isAdmin) {
      setError('This account does not have admin privileges');
      const { logout } = useAuth();
      logout();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-2">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="admin@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 text-red-200 px-4 py-3 rounded-lg text-sm border border-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login as Admin
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-gray-400 text-sm text-center">
            Only authorized administrators can access this portal
          </p>
        </div>
      </div>
    </div>
  );
};
