import { Activity } from '@/types';

interface ActivityFeedProps {
  activities: Activity[];
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    call: '📞',
    email: '📧',
    meeting: '📅',
    note: '📝',
    task: '✅',
    other: '📌',
  };
  return icons[type] || '📌';
}

function getActivityLabel(type: string): string {
  const labels: Record<string, string> = {
    call: 'Call',
    email: 'Email',
    meeting: 'Meeting',
    note: 'Note',
    task: 'Task',
    other: 'Other',
  };
  return labels[type] || 'Activity';
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No activities recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
        >
          <div className="text-2xl">{getActivityIcon(activity.type)}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {getActivityLabel(activity.type)}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(activity.created_at).toLocaleString()}
              </span>
            </div>
            {activity.description && (
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
