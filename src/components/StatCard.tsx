interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  color = 'bg-primary-500',
}: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <span className="text-white text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
