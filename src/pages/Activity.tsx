import { useState } from 'react';
import { activities, staff } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Search,
  UserPlus,
  RefreshCw,
  MessageSquare,
  Calendar,
  CheckCircle,
  School,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const activityConfig = {
  lead_added: {
    icon: UserPlus,
    color: 'bg-info/10 text-info',
    label: 'Lead Added',
  },
  status_changed: {
    icon: RefreshCw,
    color: 'bg-primary/10 text-primary',
    label: 'Status Changed',
  },
  note_added: {
    icon: MessageSquare,
    color: 'bg-muted text-muted-foreground',
    label: 'Note Added',
  },
  demo_scheduled: {
    icon: Calendar,
    color: 'bg-warning/10 text-warning',
    label: 'Demo Scheduled',
  },
  demo_completed: {
    icon: CheckCircle,
    color: 'bg-success/10 text-success',
    label: 'Demo Completed',
  },
  school_onboarded: {
    icon: School,
    color: 'bg-success/10 text-success',
    label: 'School Onboarded',
  },
};

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const filteredActivities = sortedActivities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesStaff = staffFilter === 'all' || activity.staffName === staffFilter;
    return matchesSearch && matchesType && matchesStaff;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = format(activity.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">
          Track all actions and changes across leads, demos, and schools
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Activities</SelectItem>
              {Object.entries(activityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Staff" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Staff</SelectItem>
              {staff.map(s => (
                <SelectItem key={s.id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card-elevated p-6">
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">No activities found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, dayActivities]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 sticky top-0 bg-card py-2">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h3>
                <div className="relative pl-6 border-l-2 border-border space-y-6">
                  {dayActivities.map((activity) => {
                    const config = activityConfig[activity.type];
                    const Icon = config.icon;

                    return (
                      <div
                        key={activity.id}
                        className="relative flex gap-4 animate-fade-in"
                      >
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            'absolute -left-[25px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-card',
                            config.color.replace('/10', '')
                          )}
                        />

                        {/* Content */}
                        <div
                          className={cn(
                            'flex items-start gap-4 p-4 rounded-lg flex-1 transition-colors hover:bg-muted/50'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                              config.color
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>{activity.staffName}</span>
                              <span className="text-muted-foreground/50">•</span>
                              <span>{format(activity.timestamp, 'h:mm a')}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
