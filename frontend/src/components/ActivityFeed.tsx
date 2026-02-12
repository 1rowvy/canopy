import { GitPullRequest, GitCommit, CheckCircle2, XCircle } from 'lucide-react';

interface Activity {
  id: number;
  type: 'pr' | 'commit' | 'ci_success' | 'ci_failure';
  user: string;
  action: string;
  target: string;
  time: string;
}

const ActivityFeed = ({ activities }: { activities: Activity[] }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pr':
        return <GitPullRequest className="text-purple-600" size={18} />;
      case 'commit':
        return <GitCommit className="text-blue-600" size={18} />;
      case 'ci_success':
        return <CheckCircle2 className="text-green-600" size={18} />;
      case 'ci_failure':
        return <XCircle className="text-red-600" size={18} />;
      default:
        return <GitCommit className="text-gray-600" size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-6">Activity</h2>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>
                  {' '}
                  <span className="text-gray-600">{activity.action}</span>
                  {' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
