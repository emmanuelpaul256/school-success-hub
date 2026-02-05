import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export const KPICard = ({ 
  title, 
  value, 
  trend, 
  trendLabel = 'vs last month',
  icon: Icon,
  iconColor = 'text-primary'
}: KPICardProps) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="kpi-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive && (
                <TrendingUp className="h-4 w-4 text-success" />
              )}
              {isNegative && (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                'text-sm font-medium',
                isPositive && 'text-success',
                isNegative && 'text-destructive',
                !isPositive && !isNegative && 'text-muted-foreground'
              )}>
                {isPositive && '+'}{trend}%
              </span>
              <span className="text-sm text-muted-foreground">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10',
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
