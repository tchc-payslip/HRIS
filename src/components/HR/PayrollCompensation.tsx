
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, DollarSign } from "lucide-react";

// Mock timesheet data
const mockTimesheetData = [
  {
    id: "1",
    employeeId: "001",
    employeeName: "Jane Doe",
    department: "Human Resources",
    period: "May 1-15, 2023",
    regularHours: 80,
    overtimeHours: 5,
    leaveHours: 0,
    totalHours: 85,
    status: "Approved"
  },
  {
    id: "2",
    employeeId: "002",
    employeeName: "Michael Johnson",
    department: "Engineering",
    period: "May 1-15, 2023",
    regularHours: 75,
    overtimeHours: 8,
    leaveHours: 5,
    totalHours: 88,
    status: "Pending"
  },
  {
    id: "3",
    employeeId: "003",
    employeeName: "Emily Davis",
    department: "Marketing",
    period: "May 1-15, 2023",
    regularHours: 72,
    overtimeHours: 0,
    leaveHours: 8,
    totalHours: 80,
    status: "Approved"
  },
  {
    id: "4",
    employeeId: "004",
    employeeName: "Robert Wilson",
    department: "Finance",
    period: "May 1-15, 2023",
    regularHours: 80,
    overtimeHours: 2,
    leaveHours: 0,
    totalHours: 82,
    status: "Approved"
  },
];

// Mock payroll data
const mockPayrollData = [
  {
    id: "1",
    employeeId: "001",
    employeeName: "Jane Doe",
    department: "Human Resources",
    position: "HR Manager",
    baseSalary: 85000,
    overtimePay: 750,
    bonus: 2000,
    deductions: 2500,
    netPay: 7104.17,
    payPeriod: "May 2023"
  },
  {
    id: "2",
    employeeId: "002",
    employeeName: "Michael Johnson",
    department: "Engineering",
    position: "Software Developer",
    baseSalary: 95000,
    overtimePay: 950,
    bonus: 0,
    deductions: 2800,
    netPay: 7345.83,
    payPeriod: "May 2023"
  },
  {
    id: "3",
    employeeId: "003",
    employeeName: "Emily Davis",
    department: "Marketing",
    position: "Marketing Specialist",
    baseSalary: 65000,
    overtimePay: 0,
    bonus: 1000,
    deductions: 1950,
    netPay: 5337.50,
    payPeriod: "May 2023"
  },
  {
    id: "4",
    employeeId: "004",
    employeeName: "Robert Wilson",
    department: "Finance",
    position: "Financial Analyst",
    baseSalary: 75000,
    overtimePay: 300,
    bonus: 500,
    deductions: 2250,
    netPay: 6129.17,
    payPeriod: "May 2023"
  },
];

const PayrollCompensation = () => {
  const [activeTab, setActiveTab] = useState("timesheets");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Get unique departments
  const departments = Array.from(
    new Set([...mockTimesheetData, ...mockPayrollData].map(item => item.department))
  );
  
  // Filter functions
  const filterTimesheetData = () => {
    return mockTimesheetData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !departmentFilter || 
        item.department === departmentFilter;
      const matchesStatus = !statusFilter || 
        item.status === statusFilter;
        
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  };
  
  const filterPayrollData = () => {
    return mockPayrollData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !departmentFilter || 
        item.department === departmentFilter;
        
      return matchesSearch && matchesDepartment;
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Payroll & Compensation</h1>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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
        
        {activeTab === "timesheets" && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="May 2023" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="may2023">May 2023</SelectItem>
            <SelectItem value="apr2023">April 2023</SelectItem>
            <SelectItem value="mar2023">March 2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="timesheets" className="flex items-center">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Timesheets
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Payroll Calculation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timesheets">
          <Card>
            <CardHeader>
              <CardTitle>Department Timesheets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Regular Hours</TableHead>
                      <TableHead>Overtime Hours</TableHead>
                      <TableHead>Leave Hours</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterTimesheetData().map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell>{timesheet.employeeName}</TableCell>
                        <TableCell>{timesheet.department}</TableCell>
                        <TableCell>{timesheet.period}</TableCell>
                        <TableCell>{timesheet.regularHours}</TableCell>
                        <TableCell>{timesheet.overtimeHours}</TableCell>
                        <TableCell>{timesheet.leaveHours}</TableCell>
                        <TableCell>{timesheet.totalHours}</TableCell>
                        <TableCell>
                          <Badge className={
                            timesheet.status === "Approved" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }>
                            {timesheet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Approve</Button>
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
        
        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Overtime Pay</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterPayrollData().map((payroll) => (
                      <TableRow key={payroll.id}>
                        <TableCell>{payroll.employeeName}</TableCell>
                        <TableCell>{payroll.department}</TableCell>
                        <TableCell>{payroll.position}</TableCell>
                        <TableCell>${payroll.baseSalary.toLocaleString()}</TableCell>
                        <TableCell>${payroll.overtimePay.toLocaleString()}</TableCell>
                        <TableCell>${payroll.bonus.toLocaleString()}</TableCell>
                        <TableCell>${payroll.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${payroll.netPay.toLocaleString()}</TableCell>
                        <TableCell>{payroll.payPeriod}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
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

export default PayrollCompensation;
