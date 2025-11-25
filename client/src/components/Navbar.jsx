import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user ? '/dashboard' : '/'} className="text-2xl font-bold text-indigo-600">
          ResumeAI
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
              Dashboard
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-indigo-600">
              Pricing
            </Link>
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="text-sm">{user.name}</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                {user.subscription}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/templates" className="text-gray-700 hover:text-indigo-600">
              Templates
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-indigo-600">
              Pricing
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
