import { useState } from 'react';
import { Award, TrendingUp, AlertCircle, CheckCircle, Sparkles, X } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function ResumeScore({ resumeData, onClose }) {
  const { user } = useAuthStore();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(user?.subscription !== 'free');

  const calculateScore = async () => {
    try {
      setLoading(true);
      const { data } = await api.post('/ai/score-resume', {
        resumeData,
        useAI: useAI && user?.subscription !== 'free'
      });
      setScore(data.score);
    } catch (error) {
      toast.error('Failed to calculate score');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Resume ATS Score</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!score ? (
            <div className="text-center py-8">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Check Your Resume Score</h3>
              <p className="text-gray-600 mb-6">
                Get instant feedback on your resume's ATS compatibility and content quality
              </p>

              {user?.subscription !== 'free' && (
                <div className="mb-6 flex items-center justify-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAI}
                      onChange={(e) => setUseAI(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Use AI for detailed analysis</span>
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </label>
                </div>
              )}

              <button
                onClick={calculateScore}
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Calculate Score
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className={`${getScoreBg(score.basic.score)} rounded-xl p-6 text-center`}>
                <div className={`text-6xl font-bold ${getScoreColor(score.basic.score)} mb-2`}>
                  {score.basic.score}
                </div>
                <div className="text-xl font-semibold text-gray-700 mb-1">{score.basic.rating}</div>
                {score.basic.ratingMessage && (
                  <div className="text-sm text-gray-600">{score.basic.ratingMessage}</div>
                )}
              </div>

              {/* Contextual Summary */}
              {score.basic.contextualSummary && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">{score.basic.contextualSummary}</p>
                </div>
              )}

              {/* Critical Issues */}
              {score.basic.criticalIssues && score.basic.criticalIssues.length > 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-900">Critical Issues (Must Fix)</h3>
                  </div>
                  <ul className="space-y-2">
                    {score.basic.criticalIssues.map((item, i) => (
                      <li key={i} className="text-sm text-red-800 font-medium">🚨 {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {score.basic.warnings && score.basic.warnings.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Important Warnings</h3>
                  </div>
                  <ul className="space-y-2">
                    {score.basic.warnings.map((item, i) => (
                      <li key={i} className="text-sm text-orange-800">⚠️ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feedback */}
              {score.basic.feedback.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">What's Working Well</h3>
                  </div>
                  <ul className="space-y-2">
                    {score.basic.feedback.map((item, i) => (
                      <li key={i} className="text-sm text-green-800">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {score.basic.suggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Suggestions for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {score.basic.suggestions.map((item, i) => (
                      <li key={i} className="text-sm text-blue-800">💡 {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Analysis (if available) */}
              {score.ai && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-indigo-900">AI Analysis</h3>
                  </div>
                  <p className="text-sm text-indigo-800">{score.ai.summary}</p>
                  
                  {score.ai.topPriorities && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-indigo-900 mb-2">Top Priorities:</h4>
                      <ul className="space-y-1">
                        {score.ai.topPriorities.map((priority, i) => (
                          <li key={i} className="text-sm text-indigo-800">
                            {i + 1}. {priority}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Rescan Button */}
              <button
                onClick={() => setScore(null)}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
              >
                Scan Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
