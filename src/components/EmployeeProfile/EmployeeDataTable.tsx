
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
  employmentType: string;
}

interface EmployeeDataTableProps {
  employees: Employee[];
  isLoading: boolean;
}

const EmployeeDataTable = ({ employees, isLoading }: EmployeeDataTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading employee data...</p>
      </div>
    );
  }
  
  if (employees.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No employee data available</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge 
                  variant={employee.employmentType === 'Full Time' ? 'default' : 'outline'}
                >
                  {employee.employmentType}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeDataTable;
