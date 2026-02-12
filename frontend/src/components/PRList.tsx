import { MoreHorizontal, Clock, CheckCircle, PlayCircle } from 'lucide-react';

interface PR {
  id: number;
  title: string;
  repo: string;
  status: 'in_progress' | 'on_hold' | 'done';
  duration: string;
}

const PRList = ({ prs }: { prs: PR[] }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress':
        return {
          icon: PlayCircle,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          label: 'In progress',
        };
      case 'on_hold':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          label: 'On hold',
        };
      case 'done':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          label: 'Done',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          label: 'Unknown',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Current Tasks</h2>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>Week</option>
          <option>Month</option>
          <option>All time</option>
        </select>
      </div>

      <div className="divide-y divide-gray-100">
        {prs.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No pull requests found. Configure your GitHub token in Settings.
          </div>
        ) : (
          prs.map((pr) => {
            const statusConfig = getStatusConfig(pr.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={pr.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                    <StatusIcon className={statusConfig.color} size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{pr.title}</div>
                    <div className="text-sm text-gray-500">{pr.repo}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    {pr.duration}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PRList;
