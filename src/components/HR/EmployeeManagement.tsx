
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus } from "lucide-react";
import ColumnSelectionDialog from "./ColumnSelectionDialog";
import RowActionMenu from "./RowActionMenu";
import { fetchEmployees, Employee } from "@/services/employeeService";
import { useToast } from "@/hooks/use-toast";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([
    "employee_name",
    "title", 
    "department", 
    "contract_start_date_cv", 
    "email"
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const { toast } = useToast();
  
  // Define available columns
  const availableColumns = [
    { id: "employee_name", label: "Name" },
    { id: "title", label: "Job Title" },
    { id: "department", label: "Department" },
    { id: "contract_start_date_cv", label: "Hire Date" },
    { id: "email", label: "Email" },
    { id: "phone_number", label: "Phone" },
    { id: "employmentType", label: "Employment Type" },
    { id: "nationality", label: "Nationality" },
  ];
  
  // Load employees from Supabase
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to load employees:", error);
        toast({
          title: "Error",
          description: "Failed to load employee data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEmployees();
  }, [toast]);
  
  const handleColumnToggle = (columnId: string) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(id => id !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };
  
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === "" || 
      Object.values(employee).some(value => 
        value && 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDepartment = filterDepartment === "all" || 
      employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  const departments = Array.from(new Set(employees.map(emp => emp.department || ""))).filter(Boolean);

  // Placeholder functions
  const handleEdit = (employeeId: string) => {
    toast({ description: `Edit employee ${employeeId}` });
  };

  const handleDelete = (employeeId: string) => {
    toast({ description: `Delete employee ${employeeId}` });
  };

  const handleFunction1 = (employeeId: string) => {
    toast({ description: `Function 1 for employee ${employeeId}` });
  };

  const handleFunction2 = (employeeId: string) => {
    toast({ description: `Function 2 for employee ${employeeId}` });
  };

  const handleFunction3 = (employeeId: string) => {
    toast({ description: `Function 3 for employee ${employeeId}` });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Employee Management</h1>
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
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => dept && (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <ColumnSelectionDialog
                columns={availableColumns}
                selectedColumns={selectedColumns}
                onColumnToggle={handleColumnToggle}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Actions</TableHead>
                  {availableColumns.filter(col => selectedColumns.includes(col.id)).map(column => (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell 
                      colSpan={selectedColumns.length + 1}
                      className="text-center py-6 text-gray-500"
                    >
                      Loading employee data...
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0 ? (
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
                      <TableCell>
                        <RowActionMenu
                          onEdit={() => handleEdit(employee.id)}
                          onDelete={() => handleDelete(employee.id)}
                          onFunction1={() => handleFunction1(employee.id)}
                          onFunction2={() => handleFunction2(employee.id)}
                          onFunction3={() => handleFunction3(employee.id)}
                        />
                      </TableCell>
                      {availableColumns.filter(col => selectedColumns.includes(col.id)).map(column => {
                        const key = column.id as keyof Employee;
                        const value = employee[key];
                        return (
                          <TableCell key={`${employee.id}-${column.id}`}>
                            {column.id === 'contract_start_date_cv' && value 
                              ? new Date(value as string).toLocaleDateString() 
                              : String(value || '-')}
                          </TableCell>
                        );
                      })}
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
