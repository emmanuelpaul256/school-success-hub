import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { leadsService } from '@/services';

const editDemoSchema = z
  .object({
    date: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    demo_type: z.enum(['online', 'physical', 'hybrid']).optional(),
    assigned_staff: z.string().optional().nullable(),
    place: z.string().optional().nullable(),
    meeting_link: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
  .superRefine((val, ctx) => {
    // If demo_type is explicitly set to 'online', meeting_link must be present and a valid URL
    if (val.demo_type === 'online') {
      if (!val.meeting_link || String(val.meeting_link).trim() === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Meeting link is required for online demos', path: ['meeting_link'] });
      } else {
        try {
          new URL(String(val.meeting_link));
        } catch (e) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Meeting link must be a valid URL', path: ['meeting_link'] });
        }
      }
    }

    // If demo_type is explicitly set to 'physical', place must be present
    if (val.demo_type === 'physical') {
      if (!val.place || String(val.place).trim() === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Place is required for physical demos', path: ['place'] });
      }
    }
  });

export type EditDemoForm = z.infer<typeof editDemoSchema>;

interface EditDemoDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  demo: any | null;
  onSave: (id: any, payload: any) => Promise<void>;
  onDelete: (id: any) => Promise<void>;
}

export const EditDemoDialog: React.FC<EditDemoDialogProps> = ({ open, onOpenChange, demo, onSave, onDelete }) => {
  const { data: staffResp } = useQuery({
    queryKey: ['staff', 'for-edit-demo'],
    queryFn: async () => {
      const res: any = await leadsService.getSalesUsers();
      return res?.data?.users ?? [];
    },
    placeholderData: [],
  });

  const staffOptions = staffResp ?? [];

  const form = useForm<EditDemoForm>({
    resolver: zodResolver(editDemoSchema),
    defaultValues: {
      date: undefined as any,
      time: undefined as any,
      demo_type: 'online',
      assigned_staff: 'none',
      place: undefined as any,
      meeting_link: undefined as any,
      notes: undefined as any,
    },
  });

  useEffect(() => {
    if (demo) {
      form.reset({
        date: demo.date ?? undefined,
        time: demo.time ?? undefined,
        demo_type: demo.demo_type ?? 'online',
        assigned_staff: demo.assigned_staff_id ?? demo.assigned_staff ?? 'none',
        place: demo.place ?? undefined,
        meeting_link: demo.meeting_link ?? undefined,
        notes: demo.notes ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  const submit = async (values: EditDemoForm) => {
    if (!demo) return;
    const payload: any = {
      // Only include keys that are defined so editing can be partial
      ...(values.date !== undefined && { date: values.date }),
      ...(values.time !== undefined && { time: values.time }),
      ...(values.demo_type !== undefined && { demo_type: values.demo_type }),
      ...(values.assigned_staff !== undefined && { assigned_staff: values.assigned_staff && values.assigned_staff !== 'none' ? values.assigned_staff : null }),
      ...(values.place !== undefined && { place: values.place || null }),
      ...(values.meeting_link !== undefined && { meeting_link: values.meeting_link || null }),
      ...(values.notes !== undefined && { notes: values.notes || null }),
    };

    await onSave(demo.id, payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] bg-card">
        <DialogHeader>
          <DialogTitle>Edit Demo (Premium)</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Date</label>
              <Input {...form.register('date')} type="date" />
            </div>
            <div>
              <label className="block text-sm mb-1">Time</label>
              <Input {...form.register('time')} type="time" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Type</label>
            <Select onValueChange={(v) => form.setValue('demo_type', v as any)} defaultValue={form.getValues().demo_type}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Assigned Staff</label>
            <Select onValueChange={(v) => form.setValue('assigned_staff', v as any)} defaultValue={form.getValues().assigned_staff || 'none'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="none">Unassigned</SelectItem>
                {staffOptions.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>{s.full_name || s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Location</label>
            <Input {...form.register('place')} />
          </div>

          <div>
            <label className="block text-sm mb-1">Meeting Link</label>
            <Input {...form.register('meeting_link')} />
          </div>

          {/* Duration and Recording Link removed — fields are optional */}

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <Textarea {...form.register('notes')} />
          </div>

          <div className="flex justify-between items-center">
            <Button variant="destructive" type="button" onClick={() => demo && onDelete(demo.id)}>Delete</Button>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDemoDialog;
