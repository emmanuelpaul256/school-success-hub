import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { otherService } from '@/services';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { data: notificationsResp = [] } = useQuery({
    queryKey: ['header', 'notifications', 'unread'],
    queryFn: async () => {
      const res: any = await otherService.getUnreadNotifications();
      return res?.data?.notifications ?? [];
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    staleTime: 2000,
  });

  const notifications = notificationsResp || [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>


      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card">
            <DropdownMenuLabel className="font-semibold">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem key={notification.id} asChild>
                  <div
                    className={cn(
                      'flex flex-col items-start gap-1 p-3',
                      !notification.is_read && 'bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-2 w-2 rounded-full bg-info" />
                      <span className="font-medium text-sm flex-1">
                        {notification.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.body}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/notifications"
                className="w-full text-center text-sm font-medium text-primary cursor-pointer justify-center"
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
