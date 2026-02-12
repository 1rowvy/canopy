import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  iconColor?: string;
}

const StatCard = ({ icon: Icon, title, value, subtitle, trend, trendValue, iconColor = 'text-blue-600' }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-opacity-10 ${iconColor}`}>
          <Icon className={iconColor} size={24} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-900 mb-1">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
};

export default StatCard;
