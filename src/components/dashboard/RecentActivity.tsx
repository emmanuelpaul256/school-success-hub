import { activities } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { 
  UserPlus, 
  RefreshCw, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  School 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const activityIcons = {
  lead_added: UserPlus,
  status_changed: RefreshCw,
  note_added: MessageSquare,
  demo_scheduled: Calendar,
  demo_completed: CheckCircle,
  school_onboarded: School,
};

const activityColors = {
  lead_added: 'bg-info/10 text-info',
  status_changed: 'bg-primary/10 text-primary',
  note_added: 'bg-muted text-muted-foreground',
  demo_scheduled: 'bg-warning/10 text-warning',
  demo_completed: 'bg-success/10 text-success',
  school_onboarded: 'bg-success/10 text-success',
};

export const RecentActivity = () => {
  const recentActivities = activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 8);

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      
      <div className="space-y-1">
        {recentActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                colorClass
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.staffName}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
