import { useState } from 'react';
import { Search, Filter, Plus, Download, MoreHorizontal, Eye, Edit, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { leads, staff } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { LeadStatus } from '@/types';
import { getStatusLabel, getStatusVariant } from '@/lib/leadUtils';
import { Link } from 'react-router-dom';

const statusOptions: LeadStatus[] = ['new', 'contacted', 'demo_scheduled', 'negotiation', 'converted', 'lost'];

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesStaff = staffFilter === 'all' || lead.assignedStaffId === staffFilter;

    return matchesSearch && matchesStatus && matchesStaff;
  });

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
        <Button>
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
              {staff.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
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
            {filteredLeads.length === 0 ? (
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
              filteredLeads.map((lead) => (
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
                          <Link to={`/leads/${lead.id}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Lead
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        {statusOptions.map(status => (
                          <DropdownMenuItem key={status}>
                            {getStatusLabel(status)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredLeads.length} of {leads.length} leads</p>
      </div>
    </div>
  );
};

export default Leads;
