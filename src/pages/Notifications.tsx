import { useState } from 'react';
import { notifications } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Bell,
  UserPlus,
  Calendar,
  Clock,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const notificationIcons = {
  new_lead: UserPlus,
  demo_reminder: Calendar,
  follow_up_overdue: Clock,
  onboarding_overdue: AlertTriangle,
  subscription_expiring: CreditCard,
};

const notificationColors = {
  new_lead: 'bg-info/10 text-info',
  demo_reminder: 'bg-warning/10 text-warning',
  follow_up_overdue: 'bg-destructive/10 text-destructive',
  onboarding_overdue: 'bg-warning/10 text-warning',
  subscription_expiring: 'bg-chart-5/10 text-chart-5',
};

const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState(notifications);
  
  const unreadCount = notificationsList.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationsList(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="error">High</Badge>;
      case 'medium': return <Badge variant="warning">Medium</Badge>;
      default: return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on important activities and reminders
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notificationsList.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground">
              You have no notifications at this time.
            </p>
          </div>
        ) : (
          notificationsList.map((notification) => {
            const Icon = notificationIcons[notification.type];
            const colorClass = notificationColors[notification.type];

            return (
              <div
                key={notification.id}
                className={cn(
                  'card-elevated p-4 flex items-start gap-4 transition-all animate-fade-in',
                  !notification.read && 'ring-2 ring-primary/20 bg-primary/5'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    colorClass
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {notification.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    {getPriorityBadge(notification.priority)}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </span>
                    {!notification.read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                        Read
                      </span>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                      <Link to={notification.link}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
