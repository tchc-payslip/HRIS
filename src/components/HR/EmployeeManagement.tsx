
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus } from "lucide-react";

// Mock employee data
const mockEmployees = [
  {
    id: "001",
    name: "Jane Doe",
    job_title: "HR Manager",
    department: "Human Resources",
    hire_date: "2020-06-15",
    email: "jane.doe@company.com",
    phone: "(555) 123-4567",
    status: "Active",
    manager: "John Smith"
  },
  {
    id: "002",
    name: "Michael Johnson",
    job_title: "Software Developer",
    department: "Engineering",
    hire_date: "2021-03-22",
    email: "michael.johnson@company.com",
    phone: "(555) 234-5678",
    status: "Active",
    manager: "Sarah Williams"
  },
  {
    id: "003",
    name: "Emily Davis",
    job_title: "Marketing Specialist",
    department: "Marketing",
    hire_date: "2019-11-05",
    email: "emily.davis@company.com",
    phone: "(555) 345-6789",
    status: "On Leave",
    manager: "David Brown"
  },
  {
    id: "004",
    name: "Robert Wilson",
    job_title: "Financial Analyst",
    department: "Finance",
    hire_date: "2022-01-10",
    email: "robert.wilson@company.com",
    phone: "(555) 456-7890",
    status: "Active",
    manager: "Jennifer Taylor"
  },
  {
    id: "005",
    name: "Lisa Anderson",
    job_title: "Customer Support",
    department: "Support",
    hire_date: "2020-09-18",
    email: "lisa.anderson@company.com",
    phone: "(555) 567-8901",
    status: "Inactive",
    manager: "Mark Thomas"
  },
];

const EmployeeManagement = () => {
  const [selectedColumns, setSelectedColumns] = useState([
    "name", 
    "job_title", 
    "department", 
    "hire_date", 
    "email"
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  
  const availableColumns = [
    { id: "name", label: "Name" },
    { id: "job_title", label: "Job Title" },
    { id: "department", label: "Department" },
    { id: "hire_date", label: "Hire Date" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "status", label: "Status" },
    { id: "manager", label: "Manager" },
  ];
  
  const handleColumnToggle = (columnId: string) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(id => id !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };
  
  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = searchTerm === "" || 
      Object.values(employee).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDepartment = filterDepartment === "" || 
      employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Employee Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
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
              
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Show columns:</span>
            {availableColumns.map(column => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`column-${column.id}`} 
                  checked={selectedColumns.includes(column.id)}
                  onCheckedChange={() => handleColumnToggle(column.id)}
                />
                <label 
                  htmlFor={`column-${column.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {availableColumns.filter(col => selectedColumns.includes(col.id)).map(column => (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  ))}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={selectedColumns.length + 1}
                      className="text-center py-6 text-gray-500"
                    >
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      {availableColumns.filter(col => selectedColumns.includes(col.id)).map(column => {
                        const value = employee[column.id as keyof typeof employee];
                        return (
                          <TableCell key={`${employee.id}-${column.id}`}>
                            {column.id === 'hire_date' 
                              ? new Date(value).toLocaleDateString() 
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
