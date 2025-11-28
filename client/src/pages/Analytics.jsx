import { useEffect, useState } from 'react';
import { TrendingUp, Eye, Download, FileText, Globe, Mail } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Analytics() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/analytics/dashboard?days=${timeRange}`);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set empty stats on error so UI still shows
      setStats({ total: {}, daily: [] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalStats = stats?.total || {};

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Analytics Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your resume and portfolio performance</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-4 sm:mb-6 flex gap-2 overflow-x-auto pb-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base whitespace-nowrap ${
                timeRange === days
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Last {days} days
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={FileText}
            title="Resumes Created"
            value={totalStats.resume_created || 0}
            color="indigo"
          />
          <StatCard
            icon={Eye}
            title="Resume Views"
            value={totalStats.resume_view || 0}
            color="blue"
          />
          <StatCard
            icon={Download}
            title="Resume Downloads"
            value={totalStats.resume_download || 0}
            color="green"
          />
          <StatCard
            icon={Globe}
            title="Portfolios Created"
            value={totalStats.portfolio_created || 0}
            color="purple"
          />
          <StatCard
            icon={Eye}
            title="Portfolio Views"
            value={totalStats.portfolio_view || 0}
            color="pink"
          />
          <StatCard
            icon={Mail}
            title="Cover Letters"
            value={totalStats.cover_letter_generated || 0}
            color="orange"
          />
        </div>

        {/* AI Usage */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">AI Enhancements Used</h2>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
            {totalStats.ai_enhancement_used || 0}
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            AI-powered improvements to your content
          </p>
        </div>

        {/* Upgrade CTA for Free Users */}
        {user?.subscription === 'free' && (
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl p-6 sm:p-8 text-white text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Want More Detailed Analytics?</h3>
            <p className="text-sm sm:text-base mb-4">Upgrade to Pro for advanced insights and unlimited features</p>
            <a
              href="/pricing"
              className="inline-block bg-white text-indigo-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Upgrade Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 lg:p-6 hover:shadow-lg transition">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1 line-clamp-2">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
