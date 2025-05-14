
import React, { useEffect, useState } from 'react';
import { useShiftsStore } from '@/store/shiftsStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// For the calendar display
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, parse } from 'date-fns';

interface ShiftFormData {
  title: string;
  start: string;
  end: string;
  type: 'regular' | 'overtime' | 'vacation' | 'sick';
  notes: string;
}

const Shifts = () => {
  const { shifts, currentView, selectedDate, isLoading, error, fetchShifts, addShift, updateShift, deleteShift, setCurrentView, setSelectedDate } = useShiftsStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState<ShiftFormData>({
    title: '',
    start: '',
    end: '',
    type: 'regular',
    notes: '',
  });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewEventOpen, setViewEventOpen] = useState(false);
  
  useEffect(() => {
    // Fetch shifts for the current month view
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const fetchStart = startOfWeek(monthStart).toISOString();
    const fetchEnd = endOfWeek(monthEnd).toISOString();
    
    fetchShifts(fetchStart, fetchEnd);
  }, [fetchShifts, currentMonth]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shiftForm.title || !shiftForm.start || !shiftForm.end) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addShift(shiftForm);
      
      toast({
        title: "Shift added",
        description: "Your shift has been added to the schedule.",
      });
      
      setAddShiftOpen(false);
      setShiftForm({
        title: '',
        start: '',
        end: '',
        type: 'regular',
        notes: '',
      });
    } catch (error) {
      toast({
        title: "Failed to add shift",
        description: "An error occurred while adding the shift.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteShift = async () => {
    if (!selectedEvent) return;
    
    try {
      await deleteShift(selectedEvent.id);
      
      toast({
        title: "Shift deleted",
        description: "The shift has been removed from your schedule.",
      });
      
      setViewEventOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast({
        title: "Failed to delete shift",
        description: "An error occurred while deleting the shift.",
        variant: "destructive",
      });
    }
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day.toISOString().split('T')[0]);
    
    // Set default values for the shift form
    const defaultStart = `${day.toISOString().split('T')[0]}T09:00:00`;
    const defaultEnd = `${day.toISOString().split('T')[0]}T17:00:00`;
    
    setShiftForm({
      title: 'Regular Shift',
      start: defaultStart,
      end: defaultEnd,
      type: 'regular',
      notes: '',
    });
    
    setAddShiftOpen(true);
  };
  
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setViewEventOpen(true);
  };
  
  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'regular':
        return 'bg-blue-500';
      case 'overtime':
        return 'bg-purple-500';
      case 'vacation':
        return 'bg-green-500';
      case 'sick':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const formatShiftTime = (isoString: string) => {
    try {
      return format(new Date(isoString), 'h:mm a');
    } catch (error) {
      return '';
    }
  };
  
  // Simple calendar helpers
  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    
    return (
      <div className="flex justify-between items-center py-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
          Prev
        </Button>
        <div className="font-semibold">{format(currentMonth, dateFormat)}</div>
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Next
        </Button>
      </div>
    );
  };
  
  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    const startDate = startOfWeek(currentMonth);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="w-full py-2 text-center text-xs font-medium text-gray-500">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7">{days}</div>;
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "yyyy-MM-dd");
        const dayShifts = shifts.filter(
          (shift) => shift.start.includes(formattedDate)
        );
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-1 border ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-50 text-gray-400"
                : "bg-white"
            } ${
              isSameDay(day, new Date()) ? "border-blue-500 border-2" : "border-gray-200"
            }`}
            onClick={() => handleDayClick(cloneDay)}
          >
            <div className="flex justify-between items-start p-1">
              <span
                className={`text-sm font-medium ${
                  !isSameMonth(day, monthStart) ? "text-gray-400" : ""
                }`}
              >
                {format(day, "d")}
              </span>
            </div>
            <div className="overflow-y-auto max-h-[80px]">
              {dayShifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`mb-1 px-1 py-0.5 rounded text-white text-xs ${getShiftTypeColor(
                    shift.type
                  )}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(shift);
                  }}
                >
                  {shift.title} ({formatShiftTime(shift.start)})
                </div>
              ))}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    
    return <div>{rows}</div>;
  };
  
  return (
    <div>
      <h1 className="page-title">Shifts Schedule</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            View and manage your work schedule and shifts
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={addShiftOpen} onOpenChange={setAddShiftOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shift</DialogTitle>
                <DialogDescription>
                  Create a new shift in your schedule. Fill out the details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddShift}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={shiftForm.title}
                      onChange={(e) => setShiftForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start" className="text-right">
                      Start Time
                    </Label>
                    <Input
                      id="start"
                      type="datetime-local"
                      value={shiftForm.start}
                      onChange={(e) => setShiftForm((prev) => ({ ...prev, start: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end" className="text-right">
                      End Time
                    </Label>
                    <Input
                      id="end"
                      type="datetime-local"
                      value={shiftForm.end}
                      onChange={(e) => setShiftForm((prev) => ({ ...prev, end: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Shift Type
                    </Label>
                    <Select
                      value={shiftForm.type}
                      onValueChange={(value: 'regular' | 'overtime' | 'vacation' | 'sick') =>
                        setShiftForm((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="overtime">Overtime</SelectItem>
                        <SelectItem value="vacation">Vacation</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={shiftForm.notes}
                      onChange={(e) => setShiftForm((prev) => ({ ...prev, notes: e.target.value }))}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Shift</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Dialog open={viewEventOpen} onOpenChange={setViewEventOpen}>
        {selectedEvent && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${getShiftTypeColor(selectedEvent.type)}`}></span>
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)} shift details
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{format(new Date(selectedEvent.start), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Time</p>
                  <p>{format(new Date(selectedEvent.start), "h:mm a")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Time</p>
                  <p>{format(new Date(selectedEvent.end), "h:mm a")}</p>
                </div>
              </div>
              
              {selectedEvent.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p>{selectedEvent.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="space-x-3">
              <Button variant="destructive" onClick={handleDeleteShift}>
                Delete Shift
              </Button>
              <Button onClick={() => setViewEventOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Monthly Schedule</CardTitle>
          <CardDescription>
            View your scheduled shifts for {format(currentMonth, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">Loading shifts...</p>
            </div>
          ) : (
            <div className="calendar">
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shift Legend</CardTitle>
            <CardDescription>Types of shifts in your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <p>Regular Shift - Standard working hours</p>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <p>Overtime - Additional hours beyond regular schedule</p>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <p>Vacation - Approved time off for vacation</p>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <p>Sick Leave - Time off due to illness</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Shifts</CardTitle>
            <CardDescription>Your next scheduled shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500">Loading upcoming shifts...</p>
              ) : shifts.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming shifts</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new shift to your schedule.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setAddShiftOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add New Shift
                    </Button>
                  </div>
                </div>
              ) : (
                shifts
                  .filter((shift) => new Date(shift.start) >= new Date())
                  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                  .slice(0, 5)
                  .map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(shift);
                        setViewEventOpen(true);
                      }}
                    >
                      <div className={`w-1 self-stretch rounded-full mr-3 ${getShiftTypeColor(shift.type)}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{shift.title}</h4>
                          <span className="text-sm text-gray-500">
                            {format(new Date(shift.start), "MMM d")}
                          </span>
                        </div>
                        <div className="text-sm mt-1">
                          {formatShiftTime(shift.start)} - {formatShiftTime(shift.end)}
                        </div>
                        {shift.notes && <p className="text-sm text-gray-500 mt-1">{shift.notes}</p>}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shifts;
