import { LeadStatus } from '@/types';

export const getStatusLabel = (status: LeadStatus): string => {
  const labels: Record<LeadStatus, string> = {
    new: 'New',
    contacted: 'Contacted',
    demo_scheduled: 'Demo Scheduled',
    negotiation: 'Negotiation',
    converted: 'Converted',
    lost: 'Lost',
  };
  return labels[status];
};

export const getStatusVariant = (status: LeadStatus): 'new' | 'contacted' | 'demo_scheduled' | 'negotiation' | 'converted' | 'lost' => {
  return status;
};
