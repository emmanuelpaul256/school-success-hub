import { useParams, useNavigate } from 'react-router-dom';
import { schools } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertCircle, MessageSquare, CheckCircle2, Clock } from 'lucide-react';

// Mock support tickets
const mockSupportTickets = {
  '1': [
    {
      id: 'TK-001',
      title: 'Staff dashboard not loading',
      description: 'Teachers unable to access the staff dashboard',
      status: 'resolved',
      priority: 'high',
      createdAt: new Date(2025, 0, 15),
      resolvedAt: new Date(2025, 0, 16),
      assignedTo: 'Sarah Johnson',
    },
    {
      id: 'TK-002',
      title: 'Questions about user management',
      description: 'How to add new teachers to the system',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date(2025, 0, 20),
      resolvedAt: new Date(2025, 0, 21),
      assignedTo: 'Michael Chen',
    },
    {
      id: 'TK-003',
      title: 'Data export for compliance',
      description: 'Need to export student records for audit',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date(2025, 1, 10),
      resolvedAt: null,
      assignedTo: 'Sarah Johnson',
    },
  ],
  '2': [
    {
      id: 'TK-004',
      title: 'Custom API integration setup',
      description: 'Setting up custom API integration with existing SIS',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date(2024, 11, 1),
      resolvedAt: null,
      assignedTo: 'Michael Chen',
    },
    {
      id: 'TK-005',
      title: 'Database backup configuration',
      description: 'Configuring automated backups',
      status: 'resolved',
      priority: 'medium',
      createdAt: new Date(2024, 10, 15),
      resolvedAt: new Date(2024, 10, 20),
      assignedTo: 'David Kim',
    },
  ],
  '3': [
    {
      id: 'TK-006',
      title: 'Getting started guide',
      description: 'Questions about initial setup',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date(2025, 1, 1),
      resolvedAt: new Date(2025, 1, 2),
      assignedTo: 'Emily Rodriguez',
    },
  ],
  '4': [
    {
      id: 'TK-007',
      title: 'Mobile app sync issues',
      description: 'Student data not syncing to mobile app',
      status: 'resolved',
      priority: 'high',
      createdAt: new Date(2024, 9, 1),
      resolvedAt: new Date(2024, 9, 3),
      assignedTo: 'Sarah Johnson',
    },
    {
      id: 'TK-008',
      title: 'Parent portal access',
      description: 'Setting up parent access to student grades',
      status: 'resolved',
      priority: 'medium',
      createdAt: new Date(2024, 8, 20),
      resolvedAt: new Date(2024, 8, 25),
      assignedTo: 'Michael Chen',
    },
  ],
};

const SchoolSupport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const school = schools.find(s => s.id === id);
  const tickets = mockSupportTickets[id as keyof typeof mockSupportTickets] || [];

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">School Not Found</h2>
        <Button onClick={() => navigate('/schools')}>Back to Schools</Button>
      </div>
    );
  }

  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const activeCount = tickets.filter(t => t.status === 'in_progress').length;
  const avgResolutionTime = Math.round(
    tickets
      .filter(t => t.resolvedAt)
      .reduce((sum, t) => sum + (t.resolvedAt!.getTime() - t.createdAt.getTime()), 0) / 
    (tickets.filter(t => t.resolvedAt).length * 24 * 60 * 60 * 1000)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`/schools/${school.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support History</h1>
          <p className="text-muted-foreground">{school.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tickets.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{resolvedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgResolutionTime} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>Complete support ticket history</CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No support tickets yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-sm font-semibold text-muted-foreground">
                          {ticket.id}
                        </p>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      
                      <div className="flex flex-wrap gap-4 pt-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                        </div>
                        {ticket.resolvedAt && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span>Resolved: {ticket.resolvedAt.toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>Assigned: {ticket.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Ticket */}
      <Card className="bg-primary/10">
        <CardHeader>
          <CardTitle className="text-base">Need Support?</CardTitle>
          <CardDescription>Open a new support ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Create New Ticket</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolSupport;
