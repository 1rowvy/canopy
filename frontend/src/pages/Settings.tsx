import { useState, useEffect } from 'react';
import { Check, AlertCircle, Key, Trash2 } from 'lucide-react';
import { SaveGitHubToken, GetGitHubToken, DeleteGitHubToken } from '../../wailsjs/go/main/App';

const Settings = () => {
  const [token, setToken] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const exists = await GetGitHubToken();
      setHasToken(exists);
    } catch (err) {
      console.error('Failed to check token:', err);
    }
  };

  const handleSave = async () => {
    if (!token.trim()) {
      setMessage({ type: 'error', text: 'Token cannot be empty' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await SaveGitHubToken(token);
      setMessage({ type: 'success', text: 'Token saved successfully! Refresh the dashboard to load data.' });
      setHasToken(true);
      setToken('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save token' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove your GitHub token?')) {
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await DeleteGitHubToken();
      setMessage({ type: 'success', text: 'Token removed successfully' });
      setHasToken(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove token' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* GitHub Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Key className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">GitHub Configuration</h2>
            <p className="text-sm text-gray-600">
              {hasToken ? 'Token is configured' : 'No token configured'}
            </p>
          </div>
        </div>

        {hasToken && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-green-900">GitHub token is configured</p>
              <p className="text-sm text-green-700">You can now access your repositories and pull requests.</p>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-red-50 border-red-200 text-red-900'
            } border rounded-lg p-4 mb-4 flex items-start gap-3`}
          >
            {message.type === 'success' ? (
              <Check className="flex-shrink-0 mt-0.5" size={20} />
            ) : (
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Access Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Create a token at{' '}
              <a
                href="https://github.com/settings/tokens/new"
                className="text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/settings/tokens/new
              </a>
              . Required scopes: <code className="bg-gray-100 px-1 py-0.5 rounded">repo</code>,{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded">read:user</code>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Token'}
            </button>

            {hasToken && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 size={16} />
                Remove Token
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How to get started</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Visit GitHub Settings → Developer settings → Personal access tokens</li>
          <li>Click "Generate new token (classic)"</li>
          <li>Select scopes: <code className="bg-blue-100 px-1 py-0.5 rounded">repo</code>, <code className="bg-blue-100 px-1 py-0.5 rounded">read:user</code></li>
          <li>Copy the generated token and paste it above</li>
          <li>Click "Save Token" and return to the Dashboard</li>
        </ol>
      </div>
    </div>
  );
};

export default Settings;
