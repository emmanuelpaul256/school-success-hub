import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { leadsService, demosService, otherService } from '@/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getStatusLabel, getStatusVariant } from '@/lib/leadUtils';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Users,
  MessageSquare,
  Clock,
  Link as LinkIcon,
  Edit,
} from 'lucide-react';
import { useState } from 'react';
import { ScheduleDemoDialog } from '@/components/demos/ScheduleDemoDialog';

// Transform backend API response to component format
const transformLeadData = (backendLead: any) => {
  if (!backendLead) return null;
  
  // Handle different response structures
  const lead = backendLead.data || backendLead;
  
  return {
    id: lead.id,
    schoolName: lead.institution_name,
    contactPerson: `${lead.firstname || ''} ${lead.secondname || ''}`.trim(),
    email: lead.workemail,
    phone: lead.phonenumber,
    role: lead.jobtitle,
    country: lead.country,
    studentCount: lead.size_of_institution ? parseInt(lead.size_of_institution?.split('-')[0] || '0') : 0,
    painPoint: 'Not specified',
    status: lead.status,
    assignedStaff: lead.assigned_staff || 'Unassigned',
    lastActivity: lead.last_activity ? new Date(lead.last_activity) : new Date(),
    createdAt: lead.created_at ? new Date(lead.created_at) : new Date(),
    notes: [],
  };
};

const LeadDetails = () => {
  // keep existing hook available but use react-hot-toast for inline notifications here
  const { toast: _oldToast } = useToast();
  const { id } = useParams<{ id: string }>();

  const location = useLocation();
  const isCompact = new URLSearchParams(location.search).get('compact') === 'true';
  
  const { data: leadRaw, isLoading: loadingLead, error: leadError } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res: any = await leadsService.getLead(id!);
      // Handle both wrapped and unwrapped response structures
      const leadData = res?.data || res;
      console.log('API Response:', res);
      console.log('Extracted lead data:', leadData);
      return leadData;
    },
    enabled: !!id,
  });

  const lead = transformLeadData(leadRaw);

  // Fetch sales users to resolve assigned_staff id -> display name
  const { data: salesUsersResp } = useQuery({
    queryKey: ['salesUsers'],
    queryFn: async () => {
      const res: any = await leadsService.getSalesUsers();
      return res?.data?.users ?? [];
    },
    placeholderData: [],
  });

  const salesUsers = salesUsersResp ?? [];

  const assignedStaffName = (() => {
    if (!lead) return 'Unassigned';
    const val = lead.assignedStaff;
    if (!val) return 'Unassigned';
    // If backend already provided an object
    if (typeof val === 'object') return val.full_name || val.name || `${val.firstname || ''} ${val.secondname || ''}`.trim() || 'Unassigned';
    // If it's an id, try to find the user
    const asId = String(val);
    const found = salesUsers.find((u: any) => String(u.id) === asId);
    if (found) return found.full_name || found.name || `${found.firstname || ''} ${found.secondname || ''}`.trim();
    // Fallback to the raw value
    return String(val);
  })();
  
  if (leadError) {
    console.error('Lead fetch error:', leadError);
  }

  const { data: demosResp } = useQuery({
    queryKey: ['demos', { leadId: id }],
    queryFn: async () => {
      const res: any = await demosService.getDemos({ leadId: id });
      return res?.data?.demos ?? [];
    },
    enabled: !!id,
  });

  const { data: activitiesResp } = useQuery({
    queryKey: ['activities', { leadId: id }],
    queryFn: async () => {
      const res: any = await otherService.getActivities();
      const all = res?.data?.activities ?? [];
      return all.filter((a: any) => a.entityId === id && a.entityType === 'lead');
    },
    enabled: !!id,
  });

  const leadDemos = (demosResp || []).map((d: any) => ({
    ...d,
    scheduledAt: typeof d.scheduledAt === 'string' ? new Date(d.scheduledAt) : (d.scheduledAt instanceof Date ? d.scheduledAt : new Date()),
  }));
  
  const leadActivities = (activitiesResp || []).map((a: any) => ({
    ...a,
    timestamp: typeof a.timestamp === 'string' ? new Date(a.timestamp) : (a.timestamp instanceof Date ? a.timestamp : new Date()),
  }));
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (loadingLead) {
    return <div className="p-6">Loading lead...</div>;
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Lead Not Found</h1>
        <p className="text-muted-foreground">The lead you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/leads">Back to Leads</Link>
        </Button>
      </div>
    );
  }

  const handleConvert = async () => {
    try {
      await leadsService.patchLeadStatus(id!, 'converted');
      toast.success('Lead converted to customer!');
    } catch (err) {
      toast.error('Failed to convert lead');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await leadsService.patchLeadStatus(id!, newStatus as any);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleMarkLost = async () => {
    try {
      await leadsService.patchLeadStatus(id!, 'lost');
      toast.success(`${lead.schoolName} has been marked as lost.`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/leads">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{lead.schoolName}</h1>
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
              <span>{lead.contactPerson}</span>
              <span>•</span>
              <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                {lead.email}
              </a>
              <span>•</span>
              <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                {lead.phone}
              </a>
            </div>
          </div>
        </div>
        {lead.status !== 'converted' && (
          <Button variant="outline" asChild>
            <Link to={`/leads/${lead.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        )}
      </div>

      {/* Lead Summary Card */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(lead.status)} className="text-sm px-3 py-1">
                      {getStatusLabel(lead.status)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Assigned to {assignedStaffName}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lead.status !== 'converted' && (
                      <>
                        <Button onClick={() => setScheduleOpen(true)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Demo
                        </Button>
                        <Button variant="outline" className="text-success border-success hover:bg-success/10" onClick={handleConvert}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Converted
                        </Button>
                        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={handleMarkLost}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Mark as Lost
                        </Button>
                      </>
                    )}
                    {lead.status === 'converted' && (
                      <div className="text-sm text-muted-foreground py-2">Converted</div>
                    )}
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-muted-foreground">Created {lead.createdAt ? format(new Date(lead.createdAt), 'PPP') : 'N/A'}</p>
                  <p className="font-medium text-muted-foreground">Last activity {lead.lastActivity ? formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true }) : 'N/A'}</p>
                </div>
              </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{lead.contactPerson}</p>
                <p className="text-sm text-muted-foreground">{lead.role}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex-1">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href={`tel:${lead.phone}`} className="text-primary hover:underline flex-1">
                  {lead.phone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* School Information */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">School Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{lead.country}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of Students</p>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{lead.studentCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Key Pain Point</p>
              <p className="text-sm bg-muted p-3 rounded-lg">{lead.painPoint}</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {leadActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No activities recorded yet
              </p>
            ) : (
              <div className="space-y-4">
                {leadActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                  <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.staffName} • {activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Information */}
        {!isCompact && (
          <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Demo Information</CardTitle>
          </CardHeader>
          <CardContent>
            {leadDemos.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">No demos scheduled</p>
                <Button size="sm" onClick={() => setScheduleOpen(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Demo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leadDemos.map((demo) => (
                  <div key={demo.id} className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={demo.status === 'completed' ? 'success' : 'warning'}>
                        {demo.status.charAt(0).toUpperCase() + demo.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {demo.scheduledAt ? format(new Date(demo.scheduledAt), 'PPP p') : 'N/A'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{demo.assignedStaff}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <a href={demo.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                          {demo.meetingLink}
                        </a>
                      </div>
                      {demo.notes && (
                        <div className="flex items-start gap-2 mt-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{demo.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          </Card>
        )}
      </div>

      {/* Notes Section */}
      {!isCompact && (
        <Card className="card-elevated">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Notes</CardTitle>
          <Button size="sm" variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </CardHeader>
        <CardContent>
          {lead.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes added yet
            </p>
          ) : (
            <ul className="space-y-3">
              {lead.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-foreground">{note}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        </Card>
      )}
      <ScheduleDemoDialog open={scheduleOpen} onOpenChange={setScheduleOpen} defaultLeadId={lead.id} />
    </div>
  );
};

export default LeadDetails;
