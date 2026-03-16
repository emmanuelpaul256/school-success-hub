import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { schoolsService } from '@/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Users, BookOpen, Calendar, Mail, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const SchoolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['school', id],
    queryFn: async () => {
      const res: any = await schoolsService.getSchoolDetails(id!);
      return res?.data;
    },
    enabled: !!id,
  });

  const school = response?.school;
  const onboardingStepsData = response?.onboardingSteps;
  const stats = response?.stats;

  const [isEditing, setIsEditing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    initialSetup: onboardingStepsData?.initialSetup || false,
    staffTraining: onboardingStepsData?.staffTraining || false,
    dataMigration: onboardingStepsData?.dataMigration || false,
    goLive: onboardingStepsData?.goLive || false,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync completedSteps when data changes
  useEffect(() => {
    if (onboardingStepsData) {
      setCompletedSteps({
        initialSetup: onboardingStepsData.initialSetup || false,
        staffTraining: onboardingStepsData.staffTraining || false,
        dataMigration: onboardingStepsData.dataMigration || false,
        goLive: onboardingStepsData.goLive || false,
      });
    }
  }, [onboardingStepsData]);

  const updateOnboardingMutation = useMutation({
    mutationFn: async (steps: typeof completedSteps) => {
      const res = await schoolsService.patchOnboarding(id!, {
        completedSteps: steps,
      });
      return res?.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading school details...</div>;
  }

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">School Not Found</h2>
        <p className="text-muted-foreground">The school you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/schools')}>Back to Schools</Button>
      </div>
    );
  }

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

  const calculateProgress = (steps: typeof completedSteps) => {
    const completed = Object.values(steps).filter(Boolean).length;
    return (completed / 4) * 100;
  };

  const handleStepChange = (step: keyof typeof completedSteps) => {
    setCompletedSteps(prev => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      await updateOnboardingMutation.mutateAsync(completedSteps);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/schools')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
          <p className="text-muted-foreground">School Management Details</p>
        </div>
      </div>

      {/* Main Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Plan Type</CardTitle>
          </CardHeader>
          <CardContent>
            {getPlanBadge(school.planType)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getSubscriptionBadge(school.subscriptionStatus)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.activeUsers || '-'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Onboarding Status</CardTitle>
            <CardDescription>Implementation progress tracking</CardDescription>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Progress
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{getOnboardingBadge(school.onboardingStatus)}</div>
              <p className="text-sm text-muted-foreground">Current stage</p>
            </div>
            <p className="text-2xl font-bold">{school.onboardingProgress || 0}%</p>
          </div>
          <Progress value={school.onboardingProgress || 0} className="h-2" />
          
          <div className="space-y-3 pt-4 border-t">
            {isEditing ? (
              <>
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="initial-setup"
                    checked={completedSteps.initialSetup}
                    onCheckedChange={() => handleStepChange('initialSetup')}
                  />
                  <label htmlFor="initial-setup" className="text-sm cursor-pointer">
                    Initial Setup Complete
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="staff-training"
                    checked={completedSteps.staffTraining}
                    onCheckedChange={() => handleStepChange('staffTraining')}
                  />
                  <label htmlFor="staff-training" className="text-sm cursor-pointer">
                    Staff Training Complete
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="data-migration"
                    checked={completedSteps.dataMigration}
                    onCheckedChange={() => handleStepChange('dataMigration')}
                  />
                  <label htmlFor="data-migration" className="text-sm cursor-pointer">
                    Data Migration Complete
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="go-live"
                    checked={completedSteps.goLive}
                    onCheckedChange={() => handleStepChange('goLive')}
                  />
                  <label htmlFor="go-live" className="text-sm cursor-pointer">
                    Go-Live Ready
                  </label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    size="sm"
                    onClick={handleSaveProgress}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Progress'}
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {completedSteps.initialSetup ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-sm">Initial Setup Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  {completedSteps.staffTraining ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-sm">Staff Training Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  {completedSteps.dataMigration ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-sm">Data Migration Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  {completedSteps.goLive ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-sm">Go-Live Ready</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="font-medium">{stats?.totalUsers || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Plan Type</p>
                <p className="font-medium">{school?.planType || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate(`/schools/${school.id}/support`)}
            >
              <Mail className="mr-2 h-4 w-4" />
              View Support History
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate(`/schools/${school.id}/upgrade`)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              View Upgrade Options
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolDetails;
