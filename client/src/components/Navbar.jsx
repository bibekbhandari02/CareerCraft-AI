import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerCraft AI</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm lg:text-base whitespace-nowrap">
                Dashboard
              </Link>
              <Link to="/analytics" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm lg:text-base whitespace-nowrap">
                Analytics
              </Link>
              <Link to="/templates" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm lg:text-base whitespace-nowrap">
                Templates
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm lg:text-base whitespace-nowrap">
                Pricing
              </Link>
              
              {/* User Info */}
              <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 pl-3 lg:pl-4 xl:pl-6 border-l border-gray-200">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className="bg-indigo-100 p-1.5 lg:p-2 rounded-full">
                    <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-indigo-600" />
                  </div>
                  <div className="text-xs lg:text-sm">
                    <div className="font-medium text-gray-900 max-w-[80px] lg:max-w-none truncate">{user.name}</div>
                    <div className="text-[10px] lg:text-xs text-gray-500 capitalize">{user.subscription}</div>
                  </div>
                </div>
                
                {/* Credits Badge */}
                <div className="bg-green-50 border border-green-200 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full">
                  <span className="text-[10px] lg:text-xs font-semibold text-green-700 whitespace-nowrap">
                    {user.credits?.resumeGenerations || 0} Credits
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
              <Link to="/templates" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm lg:text-base">
                Templates
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm lg:text-base">
                Pricing
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm lg:text-base">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 lg:px-5 py-1.5 lg:py-2 rounded-lg hover:bg-indigo-700 font-medium transition shadow-sm text-sm lg:text-base whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.subscription} Plan</div>
                  <div className="text-xs text-green-600 mt-1">
                    {user.credits?.resumeGenerations || 0} Credits
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  to="/templates"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Templates
                </Link>
                <Link
                  to="/pricing"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/templates"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Templates
                </Link>
                <Link
                  to="/pricing"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
