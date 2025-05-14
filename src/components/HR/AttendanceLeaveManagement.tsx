
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// Mock attendance data
const mockAttendanceData = [
  { 
    id: "1", 
    employeeId: "001", 
    employeeName: "Jane Doe",
    department: "Human Resources",
    date: "2023-05-14", 
    clockIn: "08:55:00", 
    clockOut: "17:05:00", 
    status: "Present"
  },
  { 
    id: "2", 
    employeeId: "002", 
    employeeName: "Michael Johnson",
    department: "Engineering",
    date: "2023-05-14", 
    clockIn: "09:10:00", 
    clockOut: "17:30:00", 
    status: "Late"
  },
  { 
    id: "3", 
    employeeId: "003", 
    employeeName: "Emily Davis",
    department: "Marketing",
    date: "2023-05-14", 
    clockIn: "", 
    clockOut: "", 
    status: "Absent"
  },
  { 
    id: "4", 
    employeeId: "004", 
    employeeName: "Robert Wilson",
    department: "Finance",
    date: "2023-05-14", 
    clockIn: "08:45:00", 
    clockOut: "16:30:00", 
    status: "Early Departure"
  },
];

// Mock leave data
const mockLeaveData = [
  {
    id: "1",
    employeeId: "001",
    employeeName: "Jane Doe",
    department: "Human Resources",
    leaveType: "Annual Leave",
    startDate: "2023-06-01",
    endDate: "2023-06-05",
    totalDays: 5,
    status: "Approved",
    remainingDays: 15
  },
  {
    id: "2",
    employeeId: "002",
    employeeName: "Michael Johnson",
    department: "Engineering",
    leaveType: "Sick Leave",
    startDate: "2023-05-20",
    endDate: "2023-05-22",
    totalDays: 3,
    status: "Approved",
    remainingDays: 7
  },
  {
    id: "3",
    employeeId: "003",
    employeeName: "Emily Davis",
    department: "Marketing",
    leaveType: "Personal Leave",
    startDate: "2023-07-10",
    endDate: "2023-07-12",
    totalDays: 3,
    status: "Pending",
    remainingDays: 2
  },
  {
    id: "4",
    employeeId: "005",
    employeeName: "Lisa Anderson",
    department: "Support",
    leaveType: "Annual Leave",
    startDate: "2023-08-15",
    endDate: "2023-08-22",
    totalDays: 8,
    status: "Denied",
    remainingDays: 12
  },
];

// Mock attendance alerts
const mockAttendanceAlerts = [
  {
    id: "1",
    employeeId: "002",
    employeeName: "Michael Johnson",
    department: "Engineering",
    alertType: "Late",
    date: "2023-05-14",
    count: 3,
    details: "Late arrival for 3 days this month"
  },
  {
    id: "2",
    employeeId: "004",
    employeeName: "Robert Wilson",
    department: "Finance",
    alertType: "Early Departure",
    date: "2023-05-14",
    count: 2,
    details: "Left early 2 days this week"
  },
  {
    id: "3",
    employeeId: "003",
    employeeName: "Emily Davis",
    department: "Marketing",
    alertType: "Absent",
    date: "2023-05-14",
    count: 1,
    details: "Absent without notice"
  },
];

const AttendanceLeaveManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("attendance");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Get unique departments
  const departments = Array.from(
    new Set([...mockAttendanceData, ...mockLeaveData].map(item => item.department))
  );
  
  // Filter functions
  const filterAttendanceData = () => {
    return mockAttendanceData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !departmentFilter || 
        item.department === departmentFilter;
      const matchesStatus = !statusFilter || 
        item.status === statusFilter;
        
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  };
  
  const filterLeaveData = () => {
    return mockLeaveData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !departmentFilter || 
        item.department === departmentFilter;
      const matchesStatus = !statusFilter || 
        item.status === statusFilter;
        
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  };
  
  const filterAttendanceAlerts = () => {
    return mockAttendanceAlerts.filter(item => {
      const matchesSearch = !searchTerm || 
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !departmentFilter || 
        item.department === departmentFilter;
      const matchesAlertType = !statusFilter || 
        item.alertType === statusFilter;
        
      return matchesSearch && matchesDepartment && matchesAlertType;
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Early Departure":
        return "bg-orange-100 text-orange-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Denied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Attendance & Leave Management</h1>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="attendance" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Attendance Alerts
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Leave Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterAttendanceData().map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.employeeName}</TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.clockIn || "N/A"}</TableCell>
                        <TableCell>{record.clockOut || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Alert Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Alert Types</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                    <SelectItem value="Early Departure">Early Departure</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterAttendanceAlerts().map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.employeeName}</TableCell>
                        <TableCell>{alert.department}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(alert.alertType)}>
                            {alert.alertType}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(alert.date).toLocaleDateString()}</TableCell>
                        <TableCell>{alert.count}</TableCell>
                        <TableCell>{alert.details}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Leave Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterLeaveData().map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.employeeName}</TableCell>
                        <TableCell>{leave.department}</TableCell>
                        <TableCell>{leave.leaveType}</TableCell>
                        <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{leave.totalDays}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(leave.status)}>
                            {leave.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{leave.remainingDays}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">Approve</Button>
                            <Button variant="ghost" size="sm" className="text-red-500">Deny</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceLeaveManagement;
