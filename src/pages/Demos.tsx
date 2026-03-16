import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/apiClient';
import { leadsService, demosService } from '@/services';
import { toast as hotToast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { statusOptions } from '@/lib/constants';
import { ScheduleDemoDialog } from '@/components/demos/ScheduleDemoDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Plus, Clock, User, Video, MapPin, Eye, Search, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import EditDemoDialog from '@/components/demos/EditDemoDialog';

type ViewMode = 'week' | 'month';

const Demos = () => {
  // use react-hot-toast directly for notifications on this page
  const [selectedDemo, setSelectedDemo] = useState<any | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [page, setPage] = useState(1); // server uses 1-based pages
  const pageSize = 10;

  const { data: demosResp, isLoading: loadingDemos, error: demosError } = useQuery({
    queryKey: ['demos', { page, pageSize, searchQuery, statusFilter, staffFilter }],
    queryFn: async () => {
      try {
        const params: any = { page, page_size: pageSize };
        // backend expects 'search', 'status' and 'staffId' as query params
        if (searchQuery) params.search = searchQuery;
        if (statusFilter !== 'all') params.status = statusFilter;
        if (staffFilter !== 'all') params.staffId = staffFilter;
        const res = await api.get('/leads/demos/', params);

        const list: any[] = res?.data?.data ?? res?.data ?? (Array.isArray(res) ? res : []);
        const pagination = res?.data?.pagination ?? res?.pagination ?? { page: page, page_size: list.length, total_count: list.length, total_pages: 1 };

        return { list, pagination };
      } catch (err) {
        console.error('Error fetching demos:', err);
        throw err;
      }
    },
  });

  // Fetch staff list for the staff filter dropdown
  const { data: staffResp } = useQuery({
    queryKey: ['salesUsers'],
    queryFn: async () => {
      const res: any = await leadsService.getSalesUsers();
      return res?.data?.users ?? [];
    },
    placeholderData: [],
  });

  const staffOptionsList = staffResp ?? [];

  const demosData = demosResp?.list ?? [];
  const pagination = demosResp?.pagination ?? { page, page_size: demosData.length, total_count: demosData.length, total_pages: 1 };
  const total = pagination.total_count ?? demosData.length;
  const totalPages = pagination.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
  const gotoPage = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  const queryClient = useQueryClient();

  const handleExportXLSX = async () => {
    try {
      const XLSX = await import('xlsx');

      // Fetch all pages respecting current filters
      const allRows: any[] = [];
      let currentPage = 1;
      const fetchParamsBase: any = { page_size: pageSize };
      if (searchQuery) fetchParamsBase.search = searchQuery;
      if (statusFilter !== 'all') fetchParamsBase.status = statusFilter;
      if (staffFilter !== 'all') fetchParamsBase.staffId = staffFilter;

      // First request to get pagination info
      const firstRes: any = await api.get('/leads/demos/', { ...fetchParamsBase, page: currentPage });
      const firstList: any[] = firstRes?.data?.data ?? firstRes?.data ?? (Array.isArray(firstRes) ? firstRes : []);
      const firstPagination = firstRes?.data?.pagination ?? firstRes?.pagination ?? { page: currentPage, page_size: firstList.length, total_count: firstList.length, total_pages: 1 };
      allRows.push(...firstList);

      const totalPagesToFetch = firstPagination.total_pages ?? 1;

      // Fetch remaining pages (if any)
      for (let p = 2; p <= totalPagesToFetch; p++) {
        const res: any = await api.get('/leads/demos/', { ...fetchParamsBase, page: p });
        const list: any[] = res?.data?.data ?? res?.data ?? (Array.isArray(res) ? res : []);
        allRows.push(...list);
      }

      const wsData = [
        ['School', 'Staff', 'Date', 'Time', 'Type', 'Location', 'Status', 'Meeting Link', 'Notes'],
        ...allRows.map((d: any) => [
          d.lead_name,
          d.assigned_staff_name || 'Unassigned',
          d.date,
          d.time,
          d.demo_type,
          d.place || '',
          d.demo_status || '',
          d.meeting_link || '',
          d.notes || '',
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Demos');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `demos_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      hotToast.success(`Exported ${allRows.length} demos`);
    } catch (err) {
      console.error('Export error', err);
      hotToast.error('Failed to export demos');
    }
  };

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<any | null>(null);

  const openEdit = (demo: any) => {
    setEditingDemo(demo);
    setEditOpen(true);
  };

  const handleUpdateDemo = async (id: any, payload: any) => {
    try {
      // Use the demos API endpoint that matches the backend `/leads/demos/<id>/`
      // Send payload shaped like the example the backend expects (assigned_staff, date, time, meeting_link, place, notes, demo_type, demo_status, ...)
      await api.put(`/leads/demos/${id}/`, payload);
      hotToast.success('Demo updated');
      queryClient.invalidateQueries({ queryKey: ['demos'] });
      setEditOpen(false);
    } catch (err) {
      console.error('Update demo error', err);
      hotToast.error('Failed to update demo');
    }
  };

  const handleDeleteDemo = async (id: any) => {
    try {
      await demosService.deleteDemo(String(id));
      hotToast.success('Demo deleted');
      queryClient.invalidateQueries({ queryKey: ['demos'] });
      setEditOpen(false);
    } catch (err) {
      console.error('Delete demo error', err);
      hotToast.error('Failed to delete demo');
    }
  };

  const handleChangeStatus = async (id: any, status: string) => {
    const allowed = ['scheduled', 'completed', 'missed', 'cancelled'];
    if (!allowed.includes(status)) {
      hotToast.error('Invalid status');
      return;
    }

    try {
      await demosService.updateDemoStatus(String(id), { status });
      hotToast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['demos'] });
    } catch (err: any) {
      console.error('Change status error', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to change status';
      hotToast.error(`Change status error ${String(msg)}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Demo Schedule</h1>
          <p className="text-muted-foreground">
            Manage and track all scheduled demos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportXLSX}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setScheduleOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Demo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search school or staff..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery((e.target as HTMLInputElement).value); setPage(1); }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={staffFilter} onValueChange={(v) => { setStaffFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Staff" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Staff</SelectItem>
              {staffOptionsList.map((s: any) => (
                <SelectItem key={s.id || s} value={s.id || s}>{s.full_name || s.name || s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Display */}
      {demosError && (
        <Card className="card-elevated p-4 border-destructive">
          <p className="text-destructive font-medium">Error loading demos: {String(demosError)}</p>
        </Card>
      )}

      {/* Loading State */}
      {loadingDemos && (
        <Card className="card-elevated p-4">
          <p className="text-muted-foreground">Loading demos...</p>
        </Card>
      )}

      {/* Demos Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>All Demos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>School</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demosData.map((demo: any) => (
                  <TableRow key={demo.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{demo.lead_name}</TableCell>
                    <TableCell>{demo.assigned_staff_name || 'Unassigned'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(`${demo.date}T${demo.time}`), 'MMM d, yyyy')}</p>
                        <p className="text-muted-foreground">{format(new Date(`${demo.date}T${demo.time}`), 'h:mm a')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {demo.demo_type?.charAt(0).toUpperCase() + demo.demo_type?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{demo.place || '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          demo.demo_status === 'scheduled' ? 'warning' :
                          demo.demo_status === 'completed' ? 'success' :
                          demo.demo_status === 'cancelled' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {demo.demo_status?.charAt(0).toUpperCase() + demo.demo_status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedDemo(demo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(demo)}>
                          Edit
                        </Button>
                        <Select value={demo.demo_status} onValueChange={(v) => handleChangeStatus(demo.id, v)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="missed">Missed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {total === 0 && !loadingDemos && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No demos found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary + Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {total === 0
            ? `Showing 0 of 0 demos`
            : `Showing ${Math.min((page - 1) * pageSize + 1, total)} - ${Math.min(page * pageSize, total)} of ${total} demos`}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => gotoPage(page - 1)} disabled={page <= 1}>
            Prev
          </Button>
          <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
          <Button variant="outline" size="sm" onClick={() => gotoPage(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>

      {/* Demo Details Sheet */}
      <Sheet open={!!selectedDemo} onOpenChange={() => setSelectedDemo(null)}>
        <SheetContent className="bg-card">
          {selectedDemo && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedDemo.lead_name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={
                      selectedDemo.demo_status === 'completed' ? 'success' :
                      selectedDemo.demo_status === 'scheduled' ? 'warning' :
                      'error'
                    }
                  >
                    {selectedDemo.demo_status?.charAt(0).toUpperCase() + selectedDemo.demo_status?.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {selectedDemo.demo_type?.charAt(0).toUpperCase() + selectedDemo.demo_type?.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{format(new Date(`${selectedDemo.date}T${selectedDemo.time}`), 'EEEE, MMMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(`${selectedDemo.date}T${selectedDemo.time}`), 'h:mm a')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedDemo.assigned_staff_name || 'Unassigned'}</p>
                      <p className="text-sm text-muted-foreground">Assigned Staff</p>
                    </div>
                  </div>

                  {selectedDemo.meeting_link && (
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={selectedDemo.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}

                  {selectedDemo.place && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedDemo.place}</p>
                        <p className="text-sm text-muted-foreground">Location</p>
                      </div>
                    </div>
                  )}

                  {selectedDemo.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedDemo.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                    <Link to={`/demos/${selectedDemo.id}`} className="flex-1">
                      <Button className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

        <EditDemoDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          demo={editingDemo}
          onSave={handleUpdateDemo}
          onDelete={handleDeleteDemo}
        />

      <ScheduleDemoDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </div>
  );
};

export default Demos;
