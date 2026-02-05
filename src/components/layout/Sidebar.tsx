import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  School,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  GraduationCap,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={cn(
        'nav-item',
        isActive && 'nav-item-active'
      )}
    >
      {icon}
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/leads', icon: <Users className="h-5 w-5" />, label: 'Leads' },
    { to: '/demos', icon: <Calendar className="h-5 w-5" />, label: 'Demos' },
    { to: '/schools', icon: <School className="h-5 w-5" />, label: 'Schools' },
    { to: '/activity', icon: <FileText className="h-5 w-5" />, label: 'Activity' },
    { to: '/analytics', icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics' },
    { to: '/notifications', icon: <Bell className="h-5 w-5" />, label: 'Notifications' },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-sidebar-accent-foreground">
            EduConnect
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <NavItem
          to="/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          collapsed={collapsed}
        />
        
        {/* User profile */}
        <div className={cn(
          'flex items-center rounded-lg p-2 mt-2',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-sidebar-muted truncate capitalize">
                {currentUser.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background text-foreground shadow-md hover:bg-muted"
      >
        <ChevronLeft className={cn(
          'h-4 w-4 transition-transform',
          collapsed && 'rotate-180'
        )} />
      </Button>
    </aside>
  );
};
