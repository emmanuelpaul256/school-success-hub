import { useState } from 'react';
import { demos, staff } from '@/data/mockData';
import { ScheduleDemoDialog } from '@/components/demos/ScheduleDemoDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addWeeks,
  addMonths,
  subWeeks,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Video, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type ViewMode = 'week' | 'month';

const Demos = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDemo, setSelectedDemo] = useState<typeof demos[0] | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const getDateRange = () => {
    if (viewMode === 'week') {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
    return {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    };
  };

  const { start, end } = getDateRange();
  const days = eachDayOfInterval({ start, end });

  const navigatePrev = () => {
    setCurrentDate(viewMode === 'week' ? subWeeks(currentDate, 1) : subMonths(currentDate, 1));
  };

  const navigateNext = () => {
    setCurrentDate(viewMode === 'week' ? addWeeks(currentDate, 1) : addMonths(currentDate, 1));
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const getDemosForDay = (day: Date) => {
    return demos.filter(demo => isSameDay(demo.scheduledAt, day));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-warning-muted border-warning/30 text-warning';
      case 'completed': return 'bg-success-muted border-success/30 text-success';
      case 'missed': return 'bg-destructive-muted border-destructive/30 text-destructive';
      case 'cancelled': return 'bg-muted border-muted-foreground/30 text-muted-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Demo Schedule</h1>
          <p className="text-muted-foreground">
            Manage and track all scheduled demos
          </p>
        </div>
        <Button onClick={() => setScheduleOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Demo
        </Button>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={navigateToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {viewMode === 'week'
              ? `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')
            }
          </h2>
        </div>

        <Select value={viewMode} onValueChange={(val) => setViewMode(val as ViewMode)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Grid */}
      <Card className="card-elevated overflow-hidden">
        <div className={cn(
          'grid',
          viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'
        )}>
          {/* Day headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground border-b bg-muted/30"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const dayDemos = getDemosForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'min-h-[100px] border-b border-r p-2 transition-colors hover:bg-muted/30',
                  viewMode === 'month' && 'min-h-[80px]'
                )}
              >
                <div className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium mb-1',
                  isCurrentDay && 'bg-primary text-primary-foreground'
                )}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayDemos.slice(0, viewMode === 'week' ? 3 : 2).map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => setSelectedDemo(demo)}
                      className={cn(
                        'w-full text-left px-2 py-1 rounded text-xs font-medium truncate border transition-colors hover:opacity-80',
                        getStatusColor(demo.status)
                      )}
                    >
                      <span className="hidden sm:inline">
                        {format(demo.scheduledAt, 'HH:mm')} -
                      </span>{' '}
                      {demo.schoolName}
                    </button>
                  ))}
                  {dayDemos.length > (viewMode === 'week' ? 3 : 2) && (
                    <p className="text-xs text-muted-foreground px-2">
                      +{dayDemos.length - (viewMode === 'week' ? 3 : 2)} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Demo Details Sheet */}
      <Sheet open={!!selectedDemo} onOpenChange={() => setSelectedDemo(null)}>
        <SheetContent className="bg-card">
          {selectedDemo && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedDemo.schoolName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <Badge variant={selectedDemo.status === 'completed' ? 'success' : selectedDemo.status === 'scheduled' ? 'warning' : 'error'}>
                    {selectedDemo.status.charAt(0).toUpperCase() + selectedDemo.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{format(selectedDemo.scheduledAt, 'EEEE, MMMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">{format(selectedDemo.scheduledAt, 'h:mm a')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedDemo.assignedStaff}</p>
                      <p className="text-sm text-muted-foreground">Assigned Staff</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={selectedDemo.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      Join Meeting
                    </a>
                  </div>

                  {selectedDemo.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedDemo.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <Video className="mr-2 h-4 w-4" />
                    Join Demo
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Reschedule
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <ScheduleDemoDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </div>
  );
};

export default Demos;
