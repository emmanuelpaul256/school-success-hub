import { useParams, useNavigate } from 'react-router-dom';
import { schools } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, AlertCircle, Zap } from 'lucide-react';

const plans = {
  starter: {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for small schools',
    features: [
      'Up to 200 students',
      'Basic reporting',
      'Mobile app access',
      'Email support',
      'Community forum access',
    ],
  },
  professional: {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For growing schools',
    features: [
      'Up to 1000 students',
      'Advanced analytics',
      'Mobile app access',
      'Priority support',
      'Custom integrations',
      'API access',
      'Advanced reporting',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large institutions',
    features: [
      'Unlimited students',
      'Advanced analytics',
      'Mobile app access',
      '24/7 dedicated support',
      'Custom integrations',
      'Full API access',
      'Advanced reporting',
      'Custom features',
      'SLA guarantee',
      'On-premise option',
    ],
  },
};

const SchoolUpgrade = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const school = schools.find(s => s.id === id);

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">School Not Found</h2>
        <Button onClick={() => navigate('/schools')}>Back to Schools</Button>
      </div>
    );
  }

  const currentPlan = school.planType;
  const planOrder = ['starter', 'professional', 'enterprise'];
  const currentPlanIndex = planOrder.indexOf(currentPlan);

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
          <h1 className="text-3xl font-bold tracking-tight">Upgrade Plan</h1>
          <p className="text-muted-foreground">Current Plan: <span className="font-medium capitalize">{school.planType}</span></p>
        </div>
      </div>

      {/* Current Plan Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-semibold capitalize">{school.planType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={school.subscriptionStatus === 'active' ? 'success' : 'warning'}>
                {school.subscriptionStatus === 'active' ? 'Active' : 'Trial'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Users</p>
              <p className="font-semibold">{school.studentCount + school.teacherCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(plans).map(([key, plan]) => {
            const isCurrentPlan = key === currentPlan;
            const isPlanHigher = planOrder.indexOf(key) > currentPlanIndex;
            
            return (
              <Card 
                key={key}
                className={isCurrentPlan ? 'border-primary border-2' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    {isCurrentPlan && (
                      <Badge variant="success" className="ml-2">Current</Badge>
                    )}
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-2xl font-bold">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">{plan.period}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full"
                    disabled={isCurrentPlan}
                    variant={isCurrentPlan ? 'outline' : 'default'}
                  >
                    {isCurrentPlan ? 'Current Plan' : isPlanHigher ? 'Upgrade' : 'Downgrade'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upgrade Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Unlimited Scaling</p>
                <p className="text-sm text-muted-foreground">Grow without worrying about user limits</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Priority Support</p>
                <p className="text-sm text-muted-foreground">Get dedicated support from our team</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Advanced Analytics</p>
                <p className="text-sm text-muted-foreground">Deep insights into your school's performance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Custom Integrations</p>
                <p className="text-sm text-muted-foreground">Connect with your existing systems</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Sales */}
      <Card className="bg-primary/10">
        <CardHeader>
          <CardTitle className="text-base">Need Enterprise Features?</CardTitle>
          <CardDescription>Our sales team is ready to help you find the perfect plan</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Contact Sales Team</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolUpgrade;
