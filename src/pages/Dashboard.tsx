import { Users, TrendingUp, School, Calendar } from 'lucide-react';
import { KPICard, LeadsStatusChart, UpcomingDemos, RecentActivity } from '@/components/dashboard';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';

type Kpi = {
  totalLeads?: number;
  conversionRate?: number;
  schoolsOnboarding?: number;
  upcomingDemosToday?: number;
  leadsTrend?: number;
  conversionTrend?: number;
  onboardingTrend?: number;
  demosTrend?: number;
};

const Dashboard = () => {
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ['dashboard', 'kpi'],
    queryFn: async () => {
      const res: any = await dashboardService.getKpi();
      return res?.data ?? {};
    },
  });
  const kpi = kpiData as Kpi | undefined;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your sales and support activities.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <KPICard title="Total Leads" value={isLoading ? '—' : kpi?.totalLeads ?? '—'} trend={kpi?.leadsTrend} icon={Users} />
        <KPICard title="Conversion Rate" value={isLoading || kpi?.conversionRate == null ? '—' : `${kpi?.conversionRate}%`} trend={kpi?.conversionTrend} icon={TrendingUp} />
        <KPICard title="Schools Onboarding" value={isLoading ? '—' : kpi?.schoolsOnboarding ?? '—'} trend={kpi?.onboardingTrend} icon={School} />
        <KPICard title="Demos Today" value={isLoading ? '—' : kpi?.upcomingDemosToday ?? '—'} trend={kpi?.demosTrend} icon={Calendar} />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LeadsStatusChart />
        <UpcomingDemos />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
