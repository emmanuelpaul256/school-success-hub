export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'demo_scheduled' 
  | 'negotiation' 
  | 'converted' 
  | 'lost';

export type OnboardingStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'completed';

export type SubscriptionStatus = 
  | 'active' 
  | 'trial' 
  | 'expired' 
  | 'cancelled';

export interface Lead {
  id: string;
  schoolName: string;
  contactPerson: string;
  email: string;
  phone: string;
  role: string;
  country: string;
  studentCount: number;
  painPoint: string;
  status: LeadStatus;
  assignedStaff: string;
  assignedStaffId: string;
  lastActivity: Date;
  createdAt: Date;
  notes: string[];
}

export interface Demo {
  id: string;
  leadId: string;
  schoolName: string;
  scheduledAt: Date;
  meetingLink: string;
  assignedStaff: string;
  assignedStaffId: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  notes: string;
}

export interface School {
  id: string;
  name: string;
  planType: 'starter' | 'professional' | 'enterprise';
  subscriptionStatus: SubscriptionStatus;
  onboardingStatus: OnboardingStatus;
  onboardingProgress: number;
  studentCount: number;
  teacherCount: number;
  createdAt: Date;
  assignedStaff: string;
}

export interface Activity {
  id: string;
  type: 'lead_added' | 'status_changed' | 'note_added' | 'demo_scheduled' | 'demo_completed' | 'school_onboarded';
  description: string;
  staffName: string;
  timestamp: Date;
  entityId: string;
  entityType: 'lead' | 'school' | 'demo';
}

export interface Notification {
  id: string;
  type: 'new_lead' | 'demo_reminder' | 'follow_up_overdue' | 'onboarding_overdue' | 'subscription_expiring';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  link: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'manager';
  avatar?: string;
}

export interface KPIData {
  totalLeads: number;
  conversionRate: number;
  schoolsOnboarding: number;
  upcomingDemosToday: number;
  leadsTrend: number;
  conversionTrend: number;
  onboardingTrend: number;
  demosTrend: number;
}
