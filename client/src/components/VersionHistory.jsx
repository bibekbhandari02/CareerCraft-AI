import { useState, useEffect } from 'react';
import { History, RotateCcw, Trash2, X, Clock, Save } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function VersionHistory({ resumeId, currentData, onRestore, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [resumeId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/versions/resume/${resumeId}`);
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Failed to fetch versions:', error);
      toast.error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!versionName.trim()) {
      toast.error('Please enter a version name');
      return;
    }

    try {
      setSaving(true);
      await api.post(`/versions/resume/${resumeId}`, {
        data: currentData,
        versionName: versionName.trim(),
        changeDescription: `Saved as: ${versionName.trim()}`
      });
      
      toast.success('Version saved successfully!');
      setVersionName('');
      setShowSaveDialog(false);
      fetchVersions();
    } catch (error) {
      toast.error('Failed to save version');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (versionNumber) => {
    if (!confirm('Are you sure you want to restore this version? Current changes will be lost.')) {
      return;
    }

    try {
      const { data } = await api.post(`/versions/resume/${resumeId}/restore/${versionNumber}`);
      toast.success('Version restored successfully!');
      onRestore(data.resume);
      onClose();
    } catch (error) {
      toast.error('Failed to restore version');
      console.error(error);
    }
  };

  const handleDelete = async (versionNumber) => {
    if (!confirm('Are you sure you want to delete this version?')) {
      return;
    }

    try {
      await api.delete(`/versions/resume/${resumeId}/version/${versionNumber}`);
      toast.success('Version deleted');
      fetchVersions();
    } catch (error) {
      toast.error('Failed to delete version');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Version History</h2>
              <p className="text-sm text-indigo-100">Save and restore previous versions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Save New Version Button */}
        <div className="p-4 border-b bg-gray-50">
          {!showSaveDialog ? (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Current Version
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="Enter version name (e.g., 'Before applying to Google')"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveVersion}
                  disabled={saving}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setVersionName('');
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading versions...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No saved versions yet</p>
              <p className="text-sm text-gray-500">Save your first version to track changes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => (
                <div
                  key={version._id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {version.versionName}
                        </h3>
                        {version.isAutoSave && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Auto-save
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(version.createdAt)}
                      </div>
                      {version.changeDescription && (
                        <p className="text-sm text-gray-600 mt-1">
                          {version.changeDescription}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleRestore(version.versionNumber)}
                        className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200"
                        title="Restore this version"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      {!version.isAutoSave && (
                        <button
                          onClick={() => handleDelete(version.versionNumber)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Delete this version"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Save versions before major changes or job applications
          </p>
        </div>
      </div>
    </div>
  );
}
