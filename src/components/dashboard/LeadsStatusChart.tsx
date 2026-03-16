import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';

const statusColors: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#8b5cf6',
  demo_scheduled: '#f59e0b',
  negotiated: '#10b981',
  converted: '#06b6d4',
  lost: '#ef4444',
};

export const LeadsStatusChart = () => {
  const { data: chartDataRaw, isLoading } = useQuery({
    queryKey: ['dashboard', 'leadsStatus'],
    queryFn: async () => {
      const res: any = await dashboardService.getLeadsStatus();
      return res?.data?.chartData || [];
    },
  });

  const chartData = (chartDataRaw || []).map((item: any) => ({
    name: item.status,
    value: item.count,
    fill: statusColors[item.status] || '#6b7280',
  }));

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
      <div className="h-[280px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value: number) => [`${value} leads`, '']}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
