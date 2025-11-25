import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sparkles, Eye, Save, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

export default function PortfolioBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm();

  useEffect(() => {
    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get(`/portfolio/${id}`);
      Object.keys(data.portfolio).forEach(key => {
        setValue(key, data.portfolio[key]);
      });
    } catch (error) {
      toast.error('Failed to load portfolio');
    }
  };

  const generateWithAI = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/ai/portfolio-content', { userData: {} });
      toast.success('Portfolio content generated!');
      // Parse and populate form
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/portfolio/${id}`, data);
        toast.success('Portfolio updated!');
      } else {
        const response = await api.post('/portfolio', data);
        toast.success('Portfolio created!');
        navigate(`/portfolio/${response.data.portfolio._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold">Portfolio Builder</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={generateWithAI}
                disabled={generating}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Subdomain */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Portfolio URL</h2>
              <div className="flex items-center gap-2">
                <input
                  {...register('subdomain')}
                  placeholder="your-name"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <span className="text-gray-600">.resumeai.com</span>
              </div>
            </section>

            {/* Hero Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
              <div className="space-y-4">
                <input
                  {...register('content.hero.title')}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  {...register('content.hero.subtitle')}
                  placeholder="Your Title (e.g., Full Stack Developer)"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  {...register('content.hero.description')}
                  rows="3"
                  placeholder="Brief introduction..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <textarea
                {...register('content.about')}
                rows="5"
                placeholder="Tell your story..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </section>

            {/* Theme Colors */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Theme Colors</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Primary</label>
                  <input
                    {...register('colors.primary')}
                    type="color"
                    className="w-full h-10 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Secondary</label>
                  <input
                    {...register('colors.secondary')}
                    type="color"
                    className="w-full h-10 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Accent</label>
                  <input
                    {...register('colors.accent')}
                    type="color"
                    className="w-full h-10 rounded"
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Portfolio'}
              </button>
              <button
                type="button"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
