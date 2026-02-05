import { Users, TrendingUp, School, Calendar } from 'lucide-react';
import { KPICard, LeadsStatusChart, UpcomingDemos, RecentActivity } from '@/components/dashboard';
import { kpiData } from '@/data/mockData';

const Dashboard = () => {
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
        <KPICard
          title="Total Leads"
          value={kpiData.totalLeads}
          trend={kpiData.leadsTrend}
          icon={Users}
        />
        <KPICard
          title="Conversion Rate"
          value={`${kpiData.conversionRate}%`}
          trend={kpiData.conversionTrend}
          icon={TrendingUp}
        />
        <KPICard
          title="Schools Onboarding"
          value={kpiData.schoolsOnboarding}
          trend={kpiData.onboardingTrend}
          icon={School}
        />
        <KPICard
          title="Demos Today"
          value={kpiData.upcomingDemosToday}
          trend={kpiData.demosTrend}
          icon={Calendar}
        />
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
