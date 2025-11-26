import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Globe, Plus, CreditCard, Sparkles, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, portfoliosRes, userRes] = await Promise.all([
        api.get('/resume'),
        api.get('/portfolio'),
        api.get('/user/me')
      ]);
      setResumes(resumesRes.data.resumes);
      setPortfolios(portfoliosRes.data.portfolios);
      updateUser(userRes.data.user);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (e, resumeId, resumeName) => {
    e.preventDefault(); // Prevent navigation to resume
    e.stopPropagation();
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resumeName}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      await api.delete(`/resume/${resumeId}`);
      toast.success('Resume deleted successfully');
      // Remove from local state
      setResumes(resumes.filter(r => r._id !== resumeId));
    } catch (error) {
      toast.error('Failed to delete resume');
      console.error('Delete error:', error);
    }
  };

  const handleDeletePortfolio = async (e, portfolioId, portfolioName) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${portfolioName}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      await api.delete(`/portfolio/${portfolioId}`);
      toast.success('Portfolio deleted successfully');
      setPortfolios(portfolios.filter(p => p._id !== portfolioId));
    } catch (error) {
      toast.error('Failed to delete portfolio');
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12 max-w-7xl">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Create professional resumes and portfolios with AI</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/80">Subscription</h3>
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold capitalize">{user?.subscription}</p>
            {user?.subscription === 'free' && (
              <Link to="/pricing" className="text-sm text-white/80 hover:text-white mt-2 inline-block">
                Upgrade →
              </Link>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Resume Credits</h3>
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{user?.credits?.resumeGenerations || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Portfolio Credits</h3>
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{user?.credits?.portfolios || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Total Resumes</h3>
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{resumes.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link to="/resume/new" className="bg-indigo-600 text-white p-8 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-3">
            <Plus className="w-6 h-6" />
            <span className="text-xl font-semibold">Create New Resume</span>
          </Link>
          <Link to="/portfolio/new" className="bg-purple-600 text-white p-8 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-3">
            <Plus className="w-6 h-6" />
            <span className="text-xl font-semibold">Create Portfolio</span>
          </Link>
        </div>

        {/* Recent Resumes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Resumes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.length === 0 ? (
              <p className="text-gray-500 col-span-3">No resumes yet. Create your first one!</p>
            ) : (
              resumes.map((resume) => {
                const resumeName = resume.personalInfo?.fullName 
                  ? `${resume.personalInfo.fullName}'s Resume` 
                  : resume.title || 'Untitled Resume';
                
                return (
                  <div key={resume._id} className="relative group">
                    <Link
                      to={`/resume/${resume._id}`}
                      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
                    >
                      <FileText className="w-8 h-8 text-indigo-600 mb-2" />
                      <h3 className="font-semibold">{resumeName}</h3>
                      <p className="text-sm text-gray-500">
                        Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                      {resume.template && (
                        <p className="text-xs text-indigo-600 mt-1 capitalize">
                          {resume.template === 'classic' ? 'ATS-Friendly' : resume.template} Template
                        </p>
                      )}
                    </Link>
                    <button
                      onClick={(e) => handleDeleteResume(e, resume._id, resumeName)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Delete resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Portfolios */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Portfolios</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.length === 0 ? (
              <p className="text-gray-500 col-span-3">No portfolios yet. Create your first one!</p>
            ) : (
              portfolios.map((portfolio) => {
                const portfolioName = portfolio.subdomain || 'Untitled';
                
                return (
                  <div key={portfolio._id} className="relative group">
                    <Link
                      to={`/portfolio/${portfolio._id}`}
                      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
                    >
                      <Globe className="w-8 h-8 text-purple-600 mb-2" />
                      <h3 className="font-semibold">{portfolioName}</h3>
                      <p className="text-sm text-gray-500">{portfolio.views} views</p>
                    </Link>
                    <button
                      onClick={(e) => handleDeletePortfolio(e, portfolio._id, portfolioName)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Delete portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
