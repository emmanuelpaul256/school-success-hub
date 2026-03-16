import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { schoolsService } from '@/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Eye, Users, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Schools = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(50);

  const { data: schoolsResp, isLoading } = useQuery({
    queryKey: ['schools', { searchQuery, planFilter, statusFilter, page, limit }],
    queryFn: async () => {
      const params: any = { page, limit };
      if (searchQuery) params.search = searchQuery;
      if (planFilter !== 'all') params.planType = planFilter;
      if (statusFilter !== 'all') params.subscriptionStatus = statusFilter;
      const res: any = await schoolsService.getSchools(params);
      return res?.data ?? { schools: [], pagination: {}, summary: {} };
    },
  });

  const filteredSchools = schoolsResp?.schools ?? [];
  const pagination = schoolsResp?.pagination ?? { page: page, limit: limit, total: filteredSchools.length, totalPages: 1 };
  const summary = schoolsResp?.summary ?? { totalSchools: filteredSchools.length, totalStudents: filteredSchools.reduce((acc: number, s: any) => acc + (s.studentCount ?? s.student_count ?? 0), 0), activeSubscriptions: 0, onboardingInProgress: filteredSchools.filter((s: any) => (s.onboardingStatus ?? s.onboarding_status) === 'in_progress').length };

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'trial': return <Badge variant="warning">Trial</Badge>;
      case 'expired': return <Badge variant="error">Expired</Badge>;
      case 'cancelled': return <Badge variant="secondary">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getOnboardingBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'not_started': return <Badge variant="secondary">Not Started</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    const p = String(plan || '').toLowerCase();
    if (p.includes('enterprise')) return <Badge className="bg-chart-5/10 text-chart-5 border-transparent">Enterprise</Badge>;
    if (p.includes('professional')) return <Badge variant="info">Professional</Badge>;
    if (p.includes('starter')) return <Badge variant="secondary">Starter</Badge>;
    return <Badge>{plan}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schools</h1>
          <p className="text-muted-foreground">
            Manage your active customer accounts
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-elevated p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{summary.totalSchools ?? filteredSchools.length}</p>
            <p className="text-sm text-muted-foreground">Total Schools</p>
          </div>
        </div>
        <div className="card-elevated p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {(summary.totalStudents ?? filteredSchools.reduce((acc: number, s: any) => acc + (s.studentCount || 0), 0)).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </div>
        <div className="card-elevated p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            {/* <ArrowUpCircle className="h-6 w-6" /> */}
          </div>
          <div>
            <p className="text-2xl font-bold">
              {summary.onboardingInProgress ?? filteredSchools.filter((s: any) => s.onboardingStatus === 'in_progress').length}
            </p>
            <p className="text-sm text-muted-foreground">Onboarding</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Plan Type" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead className="hidden md:table-cell">Onboarding</TableHead>
              <TableHead className="hidden lg:table-cell">Students</TableHead>
              <TableHead className="hidden lg:table-cell">Teachers</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchools.map((school) => (
              <TableRow key={school.id} className="table-row-hover">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {school.assignedStaff ?? school.assigned_staff ?? '—'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getPlanBadge(school.planType ?? school.subscription_info?.plan_name)}</TableCell>
                <TableCell>{getSubscriptionBadge(school.subscriptionStatus ?? school.subscription_info?.status ?? (school.is_subscription_active ? 'active' : 'inactive'))}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      {getOnboardingBadge(school.onboardingStatus ?? school.onboarding_status ?? 'not_started')}
                    </div>
                    <Progress value={school.onboardingProgress ?? school.onboarding_progress ?? 0} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {(school.studentCount ?? school.student_count ?? 0).toLocaleString()}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {school.teacherCount ?? school.teacher_count ?? 0}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card">
                      <DropdownMenuItem onClick={() => navigate(`/schools/${school.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Summary + Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {pagination.total === 0
            ? `Showing 0 of 0 schools`
            : `Showing ${pagination.page * pagination.limit + 1} - ${Math.min((pagination.page + 1) * pagination.limit, pagination.total)} of ${pagination.total} schools`}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, (pagination.page || 0) - 1))} disabled={(pagination.page || 0) === 0}>
            Prev
          </Button>
          <div className="text-sm text-muted-foreground">Page {(pagination.page || 0) + 1} of {pagination.totalPages || 1}</div>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min((pagination.totalPages || 1) - 1, (pagination.page || 0) + 1))} disabled={(pagination.page || 0) >= ((pagination.totalPages || 1) - 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Schools;
