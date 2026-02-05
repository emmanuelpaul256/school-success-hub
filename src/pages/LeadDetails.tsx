import { useParams, Link } from 'react-router-dom';
import { leads, demos, activities } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getStatusLabel, getStatusVariant } from '@/lib/leadUtils';
import { formatDistanceToNow, format } from 'date-fns';
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

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const lead = leads.find(l => l.id === id);

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

  const leadDemos = demos.filter(d => d.leadId === lead.id);
  const leadActivities = activities.filter(a => a.entityId === lead.id && a.entityType === 'lead');

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/leads">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{lead.schoolName}</h1>
          <p className="text-muted-foreground">Lead Details</p>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
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
                  Assigned to {lead.assignedStaff}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Demo
                </Button>
                <Button variant="outline" className="text-success border-success hover:bg-success/10">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Converted
                </Button>
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark as Lost
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Created {formatDistanceToNow(lead.createdAt, { addSuffix: true })}</p>
              <p>Last activity {formatDistanceToNow(lead.lastActivity, { addSuffix: true })}</p>
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
            <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
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
                        {activity.staffName} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Information */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Demo Information</CardTitle>
          </CardHeader>
          <CardContent>
            {leadDemos.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">No demos scheduled</p>
                <Button size="sm">
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
                        {format(demo.scheduledAt, 'PPP p')}
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
      </div>

      {/* Notes Section */}
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
            <ul className="space-y-2">
              {lead.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadDetails;
