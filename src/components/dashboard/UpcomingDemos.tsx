import { Calendar, Clock, Video, User } from 'lucide-react';
import { demos } from '@/data/mockData';
import { format, isToday, isThisWeek, isFuture } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const UpcomingDemos = () => {
  const upcomingDemos = demos
    .filter(demo => demo.status === 'scheduled' && isFuture(demo.scheduledAt))
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    .slice(0, 5);

  const todayDemos = upcomingDemos.filter(d => isToday(d.scheduledAt));
  const weekDemos = upcomingDemos.filter(d => !isToday(d.scheduledAt) && isThisWeek(d.scheduledAt));

  const DemoItem = ({ demo, highlight = false }: { demo: typeof demos[0], highlight?: boolean }) => (
    <div className={cn(
      'flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50',
      highlight && 'bg-warning-muted border border-warning/20'
    )}>
      <div className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg',
        highlight ? 'bg-warning/20 text-warning' : 'bg-primary/10 text-primary'
      )}>
        <Video className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{demo.schoolName}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{format(demo.scheduledAt, 'h:mm a')}</span>
          <span className="text-muted-foreground/50">•</span>
          <User className="h-3.5 w-3.5" />
          <span className="truncate">{demo.assignedStaff}</span>
        </div>
      </div>
      {highlight && (
        <Badge variant="warning" className="shrink-0">Today</Badge>
      )}
    </div>
  );

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Demos</h3>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      {upcomingDemos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Video className="h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">No upcoming demos</p>
          <p className="text-sm text-muted-foreground">Schedule a demo to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayDemos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Today
              </p>
              {todayDemos.map(demo => (
                <DemoItem key={demo.id} demo={demo} highlight />
              ))}
            </div>
          )}
          
          {weekDemos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                This Week
              </p>
              {weekDemos.map(demo => (
                <DemoItem key={demo.id} demo={demo} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
