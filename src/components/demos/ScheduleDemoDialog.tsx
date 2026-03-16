import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/apiClient';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

const scheduleDemoSchema = z.object({
  leadId: z.string().min(1, 'Please select a lead'),
  assignedStaffId: z.string().min(1, 'Please assign a staff member'),
  meetingType: z.enum(['physical', 'online', 'hybrid']),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string().min(1, 'Please enter a time'),
  meetingLink: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((val, ctx) => {
  if ((val.meetingType === 'online' || val.meetingType === 'hybrid') && !val.meetingLink) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Meeting link is required for online or hybrid demos', path: ['meetingLink'] });
  }
  if ((val.meetingType === 'physical' || val.meetingType === 'hybrid') && (!val.location || !val.address)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Location and address are required for physical or hybrid demos', path: ['location'] });
  }
});

type ScheduleDemoForm = z.infer<typeof scheduleDemoSchema>;

interface ScheduleDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ScheduleDemoDialogPropsExtended extends ScheduleDemoDialogProps {
  defaultLeadId?: string;
}

export const ScheduleDemoDialog = ({ open, onOpenChange, defaultLeadId }: ScheduleDemoDialogPropsExtended) => {
  const { toast } = useToast();
  
  // Fetch leads from API
  const { data: leadsResponse } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await api.get('/leads/');
      console.log('Leads response:', res);
      return Array.isArray(res?.data?.leads) ? res.data.leads : Array.isArray(res?.data) ? res.data : [];
    },
  });

  // Fetch sales staff from API
  const { data: staffResponse } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const res = await api.get('/leads/users/sales/');
      console.log('Sales users response:', res);
      return Array.isArray(res?.data?.users) ? res.data.users : Array.isArray(res?.data) ? res.data : [];
    },
  });

  const leads = Array.isArray(leadsResponse) ? leadsResponse : [];
  const staff = Array.isArray(staffResponse) ? staffResponse : [];
  
  // Transform leads to match dropdown format
  const transformedLeads = leads.map((lead: any) => ({
    id: lead.id,
    schoolName: lead.schoolName,
  }));

  // Transform staff to match dropdown format
  const transformedStaff = staff.map((s: any) => ({
    id: s.id,
    name: s.full_name || s.name,
    email: s.email,
  }));

  const selectedLead = defaultLeadId ? transformedLeads.find(l => l.id === defaultLeadId) : null;
  
  const form = useForm<ScheduleDemoForm>({
    resolver: zodResolver(scheduleDemoSchema),
    defaultValues: {
      leadId: defaultLeadId || '',
      assignedStaffId: '',
      meetingType: 'online',
      time: '10:00',
      meetingLink: '',
      location: '',
      address: '',
      notes: '',
    },
  });
  const meetingType = form.watch('meetingType');

  const onSubmit = async (data: ScheduleDemoForm) => {
    try {
      const selectedLead = transformedLeads.find(l => l.id === data.leadId);

      const demoPayload = {
        lead: data.leadId,
        assigned_staff: data.assignedStaffId,
        demo_type: data.meetingType,
        date: format(data.date, 'yyyy-MM-dd'),
        time: data.time,
        meeting_link: data.meetingLink || null,
        place: data.location || null,
        notes: data.notes || null,
      };

      console.log('Submitting demo:', demoPayload);
      
      // Call API to create demo
      const res = await api.post('/leads/demo-schedules/', demoPayload);
      console.log('Demo created:', res);

      toast({
        title: 'Success',
        description: `Demo with ${selectedLead?.schoolName} scheduled for ${format(data.date, 'PPP')} at ${data.time}`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling demo:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule demo. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle>Schedule Demo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {defaultLeadId && selectedLead ? (
              <FormItem>
                <FormLabel>Lead / School</FormLabel>
                <div className="w-full px-3 py-2 border border-input rounded-md bg-muted/50 text-sm">
                  {selectedLead.schoolName}
                </div>
              </FormItem>
            ) : (
              <FormField
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead / School</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a lead" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card">
                        {transformedLeads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.schoolName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="assignedStaffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Staff</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card">
                      {transformedStaff.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="meetingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card">
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(meetingType === 'online' || meetingType === 'hybrid') && (
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://meet.google.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(meetingType === 'physical' || meetingType === 'hybrid') && (
              <>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Main Campus - Building A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street, City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any notes for this demo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Demo</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
