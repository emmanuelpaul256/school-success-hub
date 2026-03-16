import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { leadsService } from '@/services';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const EditLead = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch lead from API
  const { data: leadRaw, isLoading: loadingLead } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res: any = await leadsService.getLead(id!);
      return res?.data || res;
    },
    enabled: !!id,
  });

  // Fetch sales users from API (returns { data: { users: [...] } })
  const { data: staffResponse } = useQuery({
    queryKey: ['salesUsers'],
    queryFn: async () => {
      const res: any = await leadsService.getSalesUsers();
      return res?.data?.users ?? [];
    },
    placeholderData: [],
  });

  const staff = Array.isArray(staffResponse) ? staffResponse : [];

  // Transform lead data from backend format
  const lead = useMemo(() => {
    if (!leadRaw) return null;
    const data = leadRaw.data || leadRaw;
    return {
      id: data.id,
      institution_name: data.institution_name,
      firstname: data.firstname,
      secondname: data.secondname,
      workemail: data.workemail,
      phonenumber: data.phonenumber,
      jobtitle: data.jobtitle,
      country: data.country,
      size_of_institution: data.size_of_institution,
      assigned_staff: data.assigned_staff, // may be null, an id, or an object
    };
  }, [leadRaw]);

  const form = useForm({
    defaultValues: {
      institution_name: '',
      firstname: '',
      secondname: '',
      workemail: '',
      phonenumber: '',
      jobtitle: '',
      country: '',
      size_of_institution: '',
      assigned_staff: 'none',
    },
  });

  // Update form when lead data is fetched
  useEffect(() => {
    if (lead) {
      // Normalize assigned_staff to an ID string or 'none'
      let assignedVal: any = 'none';
      if (lead.assigned_staff) {
        // assigned_staff could be an object { id, ... } or an id string/number
        if (typeof lead.assigned_staff === 'object') assignedVal = String(lead.assigned_staff.id ?? lead.assigned_staff.value ?? 'none');
        else assignedVal = String(lead.assigned_staff);
      }

      form.reset({
        institution_name: lead.institution_name ?? '',
        firstname: lead.firstname ?? '',
        secondname: lead.secondname ?? '',
        workemail: lead.workemail ?? '',
        phonenumber: lead.phonenumber ?? '',
        jobtitle: lead.jobtitle ?? '',
        country: lead.country ?? '',
        size_of_institution: lead.size_of_institution ?? '',
        assigned_staff: assignedVal,
      });
    }
  }, [lead, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = {
        institution_name: values.institution_name,
        firstname: values.firstname,
        secondname: values.secondname,
        workemail: values.workemail,
        phonenumber: values.phonenumber,
        jobtitle: values.jobtitle,
        country: values.country,
        size_of_institution: values.size_of_institution,
        assigned_staff: values.assigned_staff === 'none' ? null : values.assigned_staff,
      };
      return leadsService.updateLead(id!, payload);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Lead updated successfully',
      });
      navigate(`/leads/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to update lead',
        variant: 'destructive',
      });
      console.error('Update error:', error);
    },
  });

  if (loadingLead) return <div className="p-6">Loading lead...</div>;

  if (!lead) return <div className="p-6">Lead not found</div>;

  const onSubmit = (values: any) => {
    updateMutation.mutate(values);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Lead</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <div />
            <Button variant="outline" asChild>
              <Link to={`/leads/${id}`}>Back</Link>
            </Button>
          </div>
          <FormField
            control={form.control}
            name="institution_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workemail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phonenumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size_of_institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Students</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigned_staff"
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
                    <SelectItem value="none">Unassigned</SelectItem>
                    {staff.map((s: any) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.full_name || s.name || `${s.firstname || ''} ${s.secondname || ''}`.trim()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditLead;
