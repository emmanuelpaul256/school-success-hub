import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { otherService } from '@/services';
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

// Default notification icon and color
const defaultIcon = UserPlus;
const defaultColor = 'bg-info/10 text-info';

const Notifications = () => {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const { data: notificationsResp = [], isLoading } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const res: any = await otherService.getUnreadNotifications();
      return res?.data?.notifications ?? [];
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    staleTime: 2000,
  });

  const allNotifications = notificationsResp || [];
  const notificationsList = allNotifications.filter(n => !dismissedIds.has(String(n.id)));
  
  const unreadCount = notificationsList.filter(n => !readIds.has(String(n.id)) && !n.is_read).length;

  const markAsRead = async (id: number) => {
    const idStr = String(id);
    setReadIds(prev => new Set(prev).add(idStr));
    try {
      await otherService.markNotificationAsRead(String(id));
    } catch (err) {
      setReadIds(prev => {
        const next = new Set(prev);
        next.delete(idStr);
        return next;
      });
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notificationsList.filter(n => !readIds.has(String(n.id)) && !n.is_read);
    unreadNotifications.forEach(n => setReadIds(prev => new Set(prev).add(String(n.id))));
    try {
      await otherService.markAllNotificationsAsRead();
    } catch (err) {
      setReadIds(new Set());
    }
  };

  const dismissNotification = (id: number) => {
    setDismissedIds(prev => new Set(prev).add(String(id)));
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
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {unreadCount > 0 ? 'Mark all as read' : 'All read'}
        </Button>
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
            const Icon = defaultIcon;
            const colorClass = defaultColor;

            return (
              <div
                key={notification.id}
                className={cn(
                  'card-elevated p-4 flex items-start gap-4 transition-all animate-fade-in',
                  !notification.is_read && 'ring-2 ring-primary/20 bg-primary/5'
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
                        {notification.body}
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
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                    {!notification.is_read ? (
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
