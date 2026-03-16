import { useQuery } from '@tanstack/react-query';
import { otherService } from '@/services';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  UserPlus, 
  RefreshCw, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  School,
  Activity as ActivityIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const activityIcons = {
  lead_added: UserPlus,
  status_changed: RefreshCw,
  status_change: RefreshCw,
  note_added: MessageSquare,
  demo_scheduled: Calendar,
  demo_completed: CheckCircle,
  school_onboarded: School,
};

const activityColors = {
  lead_added: 'bg-info/10 text-info',
  status_changed: 'bg-primary/10 text-primary',
  status_change: 'bg-primary/10 text-primary',
  note_added: 'bg-muted text-muted-foreground',
  demo_scheduled: 'bg-warning/10 text-warning',
  demo_completed: 'bg-success/10 text-success',
  school_onboarded: 'bg-success/10 text-success',
};

export const RecentActivity = () => {
  const { data: activityResp, isLoading } = useQuery({
    queryKey: ['activities', 'recent'],
    queryFn: async () => {
      const res: any = await otherService.getActivities({ limit: 20 });
      return res?.data?.activities ?? [];
    },
  });

  const activities = activityResp || [];
  const recentActivities = activities
    .map((a: any) => ({
      ...a,
      timestamp: typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp,
    }))
    .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 8);

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      
      <div className="space-y-1">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading activities...</p>
        ) : recentActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activities</p>
        ) : (
          recentActivities.map((activity: any, index: number) => {
          const Icon = activityIcons[activity.type] || ActivityIcon;
          const colorClass = activityColors[activity.type] || 'bg-muted text-muted-foreground';
          const content = (
            <div
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

          return (
            <Link key={activity.id} to={`/activity`} className="block">
              {content}
            </Link>
          );
        })
        )}
      </div>
    </div>
  );
};
