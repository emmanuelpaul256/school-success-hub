import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useState } from 'react';
import { getStatusLabel } from '@/lib/leadUtils';
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle } from 'lucide-react';

const Analytics = () => {
  const [period, setPeriod] = useState('6months');

  const { data: analyticsData, isLoading } = useQuery<any>({
    queryKey: ['analytics', period],
    queryFn: async () => {
      const res: any = await dashboardService.getAnalytics({ period });
      const payload = res?.data || {};

      // Map API shape to component shape
      const summary = payload.summary || {};
      const trend = payload.trendData || { labels: [], leads: [], conversions: [], revenue: [] };

      const leadTrendData = (trend.labels || []).map((label: string, idx: number) => ({
        month: label,
        leads: trend.leads?.[idx] ?? 0,
        conversions: trend.conversions?.[idx] ?? 0,
      }));

      const staffPerformance = (payload.topPerformers || []).map((tp: any) => ({
        name: tp.staffName || tp.staff_name || 'Unknown',
        demos: tp.total ?? 0,
        conversions: tp.leadsConverted ?? tp.conversions ?? 0,
      }));

      const palette = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
      const leadsChartData = (payload.leadsByStatus || []).map((s: any, i: number) => ({
        name: s.status,
        value: s.count,
        fill: palette[i % palette.length],
      }));

      // conversionTimeData and onboardingData are not present in this API; provide sensible defaults
      const conversionTimeData = [];
      const onboardingData = [];

      const metrics = {
        totalLeads: summary.totalLeads ?? 0,
        totalLeadsChange: 0,
        conversionRate: summary.conversion?.rate ?? 0,
        conversionRateChange: summary.conversion?.trend ?? 0,
        avgConversionTime: 0,
        conversionTimeChange: 0,
        onboardingRate: 0,
        onboardingRateChange: 0,
      };

      return { leadTrendData, staffPerformance, leadsChartData, conversionTimeData, onboardingData, metrics };
    },
  });

  const leadTrendData = analyticsData?.leadTrendData || [];
  const staffPerformance = analyticsData?.staffPerformance || [];
  const leadsChartData = analyticsData?.leadsChartData || [];
  const conversionTimeData = analyticsData?.conversionTimeData || [];
  const onboardingData = analyticsData?.onboardingData || [];
  const metrics = analyticsData?.metrics || {};

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and performance metrics for your sales team
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalLeads || 0}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-4 text-sm ${(metrics.totalLeadsChange || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(metrics.totalLeadsChange || 0) >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(metrics.totalLeadsChange || 0)}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.conversionRate || 0}%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-4 text-sm ${(metrics.conversionRateChange || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(metrics.conversionRateChange || 0) >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(metrics.conversionRateChange || 0)}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.avgConversionTime || 0} days</p>
                <p className="text-sm text-muted-foreground">Avg. Conversion Time</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-4 text-sm ${(metrics.conversionTimeChange || 0) <= 0 ? 'text-success' : 'text-destructive'}`}>
              {(metrics.conversionTimeChange || 0) <= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(metrics.conversionTimeChange || 0)} days from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10 text-chart-5">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.onboardingRate || 0}%</p>
                <p className="text-sm text-muted-foreground">Onboarding Rate</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-4 text-sm ${(metrics.onboardingRateChange || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(metrics.onboardingRateChange || 0) >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(metrics.onboardingRateChange || 0)}% from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Generation Over Time */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Lead Generation & Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    name="New Leads"
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--success))' }}
                    name="Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="demos" fill="hsl(var(--primary))" name="Demos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" fill="hsl(var(--success))" name="Conversions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leads by Status */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadsChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {leadsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {leadsChartData.map((s: any) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: s.fill }} />
                  <span>{getStatusLabel((s.name as any) as any) || String(s.name)}</span>
                  <span className="text-muted-foreground ml-2">({s.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo to Conversion Time */}
        {/* <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Demo to Conversion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionTimeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="range" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Onboarding Status */}
        {/* <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Onboarding Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={onboardingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {onboardingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Analytics;
