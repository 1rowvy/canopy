import { useState, useEffect } from 'react';
import { FolderGit2, GitPullRequest, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import PRList from '../components/PRList';
import ActivityFeed from '../components/ActivityFeed';
import { GetDashboardData } from '../../wailsjs/go/main/App';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await GetDashboardData();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-red-600">
            Make sure you have configured your GitHub token in Settings.
          </p>
        </div>
      </div>
    );
  }

  // Transform PR data for PRList component
  const prs = data?.recent_prs?.slice(0, 5).map((pr: any) => ({
    id: pr.id,
    title: pr.title,
    repo: pr.repo,
    status: pr.state === 'open' ? 'in_progress' : pr.state === 'closed' ? 'done' : 'on_hold',
    duration: `${pr.number}`,
  })) || [];

  // Sample activity data (could be expanded with real data)
  const activities = data?.recent_prs?.slice(0, 3).map((pr: any, idx: number) => ({
    id: idx,
    type: 'pr',
    user: pr.author,
    action: pr.state === 'open' ? 'opened' : 'merged',
    target: pr.title,
    time: new Date(pr.updated_at).toLocaleString(),
  })) || [];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hello, Developer</h1>
          <p className="text-gray-600">Track team progress here. You almost reach a goal!</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FolderGit2}
            title="Repositories"
            value={data?.total_repos || 0}
            subtitle="Total tracked repos"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={GitPullRequest}
            title="Open PRs"
            value={data?.open_prs || 0}
            subtitle="Awaiting review"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={Activity}
            title="CI Success Rate"
            value={`${Math.round(data?.ci_success_rate || 0)}%`}
            subtitle="Last 7 days"
            trend={data?.ci_success_rate > 80 ? 'up' : 'down'}
            trendValue="+2.3%"
            iconColor="text-green-600"
          />
        </div>

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart />
        </div>

        {/* PR List */}
        <PRList prs={prs} />
      </div>

      {/* Right Sidebar - Activity Feed */}
      <div className="w-80 border-l border-gray-200 p-6 overflow-y-auto bg-white">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="https://ui-avatars.com/api/?name=Developer&background=6366f1&color=fff"
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">Developer</h3>
              <p className="text-sm text-gray-500">@developer</p>
            </div>
          </div>
        </div>

        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
