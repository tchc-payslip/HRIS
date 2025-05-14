
import React, { useEffect, useState } from 'react';
import { useTimeAttendanceStore } from '@/store/timeAttendanceStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

const TimeAttendance = () => {
  const { records, currentMonth, isLoading, error, fetchRecords, clockIn, clockOut, requestLeave } = useTimeAttendanceStore();
  const [requestLeaveOpen, setRequestLeaveOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  
  useEffect(() => {
    fetchRecords(currentMonth);
  }, [fetchRecords, currentMonth]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleClockIn = async () => {
    try {
      await clockIn();
      toast({
        title: "Clock-in successful",
        description: `You clocked in at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      toast({
        title: "Clock-in failed",
        description: "Failed to record your clock-in time.",
        variant: "destructive",
      });
    }
  };
  
  const handleClockOut = async () => {
    try {
      await clockOut();
      toast({
        title: "Clock-out successful",
        description: `You clocked out at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      toast({
        title: "Clock-out failed",
        description: "Failed to record your clock-out time.",
        variant: "destructive",
      });
    }
  };
  
  const handleLeaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await requestLeave(leaveForm.startDate, leaveForm.endDate, leaveForm.reason);
      toast({
        title: "Leave request submitted",
        description: "Your leave request has been submitted for approval.",
      });
      setRequestLeaveOpen(false);
      setLeaveForm({
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Failed to submit your leave request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">Late</Badge>;
      case 'leave':
        return <Badge className="bg-blue-500">Leave</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
    };
  });
  
  const todayRecord = records.find(
    (record) => record.date === new Date().toISOString().split('T')[0]
  );
  
  return (
    <div>
      <h1 className="page-title">Time & Attendance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" /> Today's Status
            </CardTitle>
            <CardDescription>Track your working hours for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <h2 className="text-3xl font-bold mb-2">{new Date().toLocaleDateString()}</h2>
              <p className="text-lg text-gray-500 mb-6">{new Date().toLocaleString('en-US', { weekday: 'long' })}</p>
              
              {todayRecord ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Clock In</p>
                      <p className="text-xl font-semibold">{todayRecord.clockIn || 'Not clocked in'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Clock Out</p>
                      <p className="text-xl font-semibold">{todayRecord.clockOut || 'Not clocked out'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div>{getStatusBadge(todayRecord.status)}</div>
                  </div>
                  {todayRecord.status === 'present' && todayRecord.clockIn && !todayRecord.clockOut && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Working Hours</p>
                      <p className="text-xl font-semibold">In Progress</p>
                    </div>
                  )}
                  {todayRecord.status === 'present' && todayRecord.clockIn && todayRecord.clockOut && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Total Hours</p>
                      <p className="text-xl font-semibold">{todayRecord.totalHours} hours</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No attendance recorded for today</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleClockIn}
              disabled={!!(todayRecord?.clockIn && !todayRecord?.clockOut) || todayRecord?.status === 'leave'}
            >
              Clock In
            </Button>
            <Button
              onClick={handleClockOut}
              disabled={!(todayRecord?.clockIn && !todayRecord?.clockOut) || todayRecord?.status === 'leave'}
            >
              Clock Out
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Request Leave
            </CardTitle>
            <CardDescription>Submit time-off requests for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Dialog open={requestLeaveOpen} onOpenChange={setRequestLeaveOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">Request Leave</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Leave</DialogTitle>
                    <DialogDescription>
                      Submit a request for your time off. All requests require approval from your manager.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLeaveRequest}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={leaveForm.startDate}
                          onChange={(e) => setLeaveForm((prev) => ({ ...prev, startDate: e.target.value }))}
                          className="col-span-3"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">
                          End Date
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={leaveForm.endDate}
                          onChange={(e) => setLeaveForm((prev) => ({ ...prev, endDate: e.target.value }))}
                          className="col-span-3"
                          required
                          min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                          Reason
                        </Label>
                        <Textarea
                          id="reason"
                          value={leaveForm.reason}
                          onChange={(e) => setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))}
                          className="col-span-3"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="attendance">
        <TabsList className="mb-6">
          <TabsTrigger value="attendance">Attendance History</TabsTrigger>
          <TabsTrigger value="leaves">Leave History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>View your past attendance records</CardDescription>
              </div>
              <div className="w-48">
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={currentMonth}
                  onChange={(e) => fetchRecords(e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-lg text-gray-500">Loading attendance records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500">No attendance records found for this month</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.clockIn || '-'}</TableCell>
                        <TableCell>{record.clockOut || '-'}</TableCell>
                        <TableCell>{record.totalHours > 0 ? `${record.totalHours} hrs` : '-'}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
              <CardDescription>View your leave requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records
                    .filter((record) => record.status === 'leave')
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>Leave</TableCell>
                        <TableCell>
                          <Badge>Approved</Badge>
                        </TableCell>
                        <TableCell>1 day</TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
                      </TableRow>
                    ))}
                  {records.filter((record) => record.status === 'leave').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No leave records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeAttendance;
