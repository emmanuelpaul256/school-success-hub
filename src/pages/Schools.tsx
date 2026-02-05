import { useState } from 'react';
import { schools, staff } from '@/data/mockData';
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
import { Search, MoreHorizontal, Eye, ArrowUpCircle, MessageSquare, Users, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Schools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || school.planType === planFilter;
    const matchesStatus = statusFilter === 'all' || school.subscriptionStatus === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

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
    switch (plan) {
      case 'enterprise': return <Badge className="bg-chart-5/10 text-chart-5 border-transparent">Enterprise</Badge>;
      case 'professional': return <Badge variant="info">Professional</Badge>;
      case 'starter': return <Badge variant="secondary">Starter</Badge>;
      default: return <Badge>{plan}</Badge>;
    }
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
            <p className="text-2xl font-bold">{schools.length}</p>
            <p className="text-sm text-muted-foreground">Total Schools</p>
          </div>
        </div>
        <div className="card-elevated p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {schools.reduce((acc, s) => acc + s.studentCount, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </div>
        <div className="card-elevated p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <ArrowUpCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {schools.filter(s => s.onboardingStatus === 'in_progress').length}
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
                        {school.assignedStaff}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getPlanBadge(school.planType)}</TableCell>
                <TableCell>{getSubscriptionBadge(school.subscriptionStatus)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      {getOnboardingBadge(school.onboardingStatus)}
                    </div>
                    <Progress value={school.onboardingProgress} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {school.studentCount.toLocaleString()}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {school.teacherCount}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowUpCircle className="mr-2 h-4 w-4" />
                        Start Upgrade
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Support History
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Schools;
