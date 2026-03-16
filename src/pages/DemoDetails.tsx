import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, User, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isToday } from 'date-fns';
import api from '@/services/apiClient';

const DemoDetails = () => {
  const { id } = useParams();

  const { data: demo, isLoading, error } = useQuery({
    queryKey: ['demo', id],
    queryFn: async () => {
      try {
        const res: any = await api.get(`/leads/demos/${id}/`);
        console.log('Demo details response:', res);
        // API returns data directly or wrapped in data property
        const d = res?.data || res;
        if (!d || !d.id) {
          console.warn('No valid demo data found in response:', res);
          return null;
        }
        return { 
          ...d,
          lead_name: d.lead_name || d.schoolName,
          assigned_staff_name: d.assigned_staff_name || d.assignedStaff || 'Unassigned',
          demo_status: d.demo_status || d.status,
          demo_type: d.demo_type || 'online',
          meeting_link: d.meeting_link || d.meetingLink,
          place: d.place || d.location,
          notes: d.notes || '',
          scheduledAt: new Date(d.scheduledAt)
        };
      } catch (err) {
        console.error('Error fetching demo details:', err);
        throw err;
      }
    },
    enabled: !!id,
  });

  const getDemoInfo = (demo: any) => {
    return {
      notes: demo.notes || '',
      type: demo.demo_type || 'online',
      meetingLink: demo.meeting_link || '',
      location: demo.place || '',
      address: '',
    };
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading demo...</p>
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Demo not found</h1>
        <p className="text-muted-foreground mt-2">
          {error ? `Error: ${error.message}` : 'No demo matching that id was found.'}
        </p>
        <div className="mt-4">
          <Link to="/demos">
            <Button variant="ghost">Back to Demos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{demo.lead_name}</h1>
          <p className="text-sm text-muted-foreground">Demo details</p>
        </div>
        <div>
          <Badge variant={demo.demo_status === 'completed' ? 'success' : demo.demo_status === 'scheduled' ? 'warning' : 'default'}>
            {demo.demo_status.charAt(0).toUpperCase() + demo.demo_status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {format(demo.scheduledAt, 'EEEE, MMMM d, yyyy')}{' '}
              {isToday(demo.scheduledAt) && <span className="text-sm text-muted-foreground">(Today)</span>}
            </p>
            <p className="text-sm text-muted-foreground">{format(demo.scheduledAt, 'h:mm a')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{demo.assigned_staff_name}</p>
            <p className="text-sm text-muted-foreground">Assigned Staff</p>
          </div>
        </div>

        {(() => {
          const demoInfo = getDemoInfo(demo);
          return (
            <>
              {(demo.demo_type === 'online' || demo.demo_type === 'hybrid') && demoInfo.meetingLink && (
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <a href={demoInfo.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                    Join Meeting
                  </a>
                </div>
              )}

              {(demo.demo_type === 'physical' || demo.demo_type === 'hybrid') && demoInfo.location && (
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{demoInfo.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
              )}

              {demoInfo.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Notes</p>
                  <p className="text-sm text-muted-foreground">{demoInfo.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {demoInfo.meetingLink && (
                  <a href={demoInfo.meetingLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full">
                      <Video className="mr-2 h-4 w-4" />
                      Join Demo
                    </Button>
                  </a>
                )}
                <Link to="/demos">
                  <Button variant="outline" className={demoInfo.meetingLink ? '' : 'w-full'}>Back</Button>
                </Link>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default DemoDetails;
