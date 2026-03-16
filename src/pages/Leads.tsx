import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Plus, Download, MoreHorizontal, Eye, Edit, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { statusOptions } from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leadsService } from '@/services';
import { formatDistanceToNow } from 'date-fns';
import { LeadStatus } from '@/types';
import { getStatusLabel, getStatusVariant } from '@/lib/leadUtils';
import { Link } from 'react-router-dom';
import AddLeadDialog from '@/components/leads/AddLeadDialog';

// statusOptions moved to shared constants

const Leads = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const handleDownloadCSV = () => {
    try {
      const headers = ['School Name', 'Contact Person', 'Email', 'Phone', 'Status', 'Assigned Staff', 'Country', 'Student Count', 'Last Activity'];
      const rows = paginatedLeads.map(lead => [
        lead.schoolName,
        lead.contactPerson,
        lead.email,
        lead.phone,
        getStatusLabel(lead.status),
        lead.assignedStaff,
        lead.country,
        lead.studentCount.toString(),
        lead.lastActivity.toISOString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Success',
        description: `Downloaded ${paginatedLeads.length} leads as CSV.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download leads. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadXLSX = async () => {
    try {
      const XLSX = await import('xlsx');
      const wsData = [
        ['School Name', 'Contact Person', 'Email', 'Phone', 'Status', 'Assigned Staff', 'Country', 'Student Count', 'Last Activity'],
        ...paginatedLeads.map(lead => [
          lead.schoolName,
          lead.contactPerson,
          lead.email,
          lead.phone,
          getStatusLabel(lead.status),
          lead.assignedStaff,
          lead.country,
          lead.studentCount,
          lead.lastActivity?.toISOString?.() ?? '',
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: 'Success', description: `Downloaded ${paginatedLeads.length} leads as XLSX.` });
    } catch (err) {
      console.error('XLSX export error', err);
      toast({ title: 'Error', description: 'Failed to export XLSX', variant: 'destructive' });
    }
  };

  const queryClient = useQueryClient();

  const { data: staffResp } = useQuery({
    queryKey: ['salesUsers'],
    queryFn: async () => {
      const res: any = await leadsService.getSalesUsers();
      return res?.data?.users ?? [];
    },
    placeholderData: [],
  });

  const staffList = staffResp ?? [];

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await leadsService.patchLeadStatus(leadId, newStatus);
      toast({ title: 'Success', description: `Status updated.` });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  type LeadsData = { leads: any[]; pagination: { total: number } };
  const { data: leadsResp, isLoading } = useQuery<LeadsData>({
    queryKey: ['leads', { page, searchQuery, statusFilter, staffFilter }],
    queryFn: async () => {
      const params: any = { page, limit: pageSize };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (staffFilter !== 'all') params.staffId = staffFilter;
      const res: any = await leadsService.getLeads(params);
      return res?.data ?? { leads: [], pagination: { total: 0 } };
    },
    placeholderData: (previousData) => previousData ?? { leads: [], pagination: { total: 0 } },
  });

  const paginatedLeads = leadsResp?.leads ?? [];
  const total = leadsResp?.pagination?.total ?? paginatedLeads.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const gotoPage = (p: number) => setPage(Math.max(0, Math.min(totalPages - 1, p)));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage and track your sales prospects
          </p>
        </div>
        <Button onClick={() => setAddLeadOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as LeadStatus | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Assigned Staff" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Staff</SelectItem>
              {staffList.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.full_name || s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleDownloadXLSX}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Assigned Staff</TableHead>
              <TableHead className="hidden lg:table-cell">Country</TableHead>
              <TableHead className="hidden sm:table-cell">Last Activity</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No leads found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => (
                <TableRow key={lead.id} className="table-row-hover">
                  <TableCell>
                    <Link 
                      to={`/leads/${lead.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {lead.schoolName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.contactPerson}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(lead.status)}>
                      {getStatusLabel(lead.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {lead.assignedStaff}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {lead.country}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDistanceToNow(lead.lastActivity, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuItem asChild>
                          <Link to={`/leads/${lead.id}?compact=true`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>

                        {lead.status !== 'converted' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to={`/leads/${lead.id}/edit`} className="flex items-center cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Lead
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            {statusOptions.map(status => (
                              <DropdownMenuItem key={status} onClick={() => handleStatusChange(lead.id, status)}>
                                {getStatusLabel(status)}
                              </DropdownMenuItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary + Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {total === 0
            ? `Showing 0 of 0 leads`
            : `Showing ${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, total)} of ${total} leads`}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => gotoPage(page - 1)} disabled={page === 0}>
            Prev
          </Button>
          <div className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</div>
          <Button variant="outline" size="sm" onClick={() => gotoPage(page + 1)} disabled={page >= totalPages - 1}>
            Next
          </Button>
        </div>
      </div>
      <AddLeadDialog open={addLeadOpen} onOpenChange={setAddLeadOpen} />
    </div>
  );
};

export default Leads;
