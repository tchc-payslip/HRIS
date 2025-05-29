
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, Download, Plus } from "lucide-react";
import ColumnSelectionDialog from "./ColumnSelectionDialog";
import RowActionMenu from "./RowActionMenu";
import EmployeeHRCard from "./EmployeeHRCard";
import { fetchEmployees, Employee } from "@/services/employeeService";
import { useToast } from "@/hooks/use-toast";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([
    "employee_id",
    "employee_name",
    "title", 
    "department", 
    "contract_start_date_cv", 
    "email"
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isHRCardOpen, setIsHRCardOpen] = useState(false);
  const { toast } = useToast();
  
  // Define available columns
  const availableColumns = [
    { id: "employee_id", label: "Employee ID" },
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
  const handleViewDetails = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsHRCardOpen(true);
  };

  const handleEdit = (employeeId: string) => {
    toast({ description: `Edit employee ${employeeId}` });
  };

  const handleDelete = (employeeId: string) => {
    toast({ description: `Delete employee ${employeeId}` });
  };

  const handleFunction2 = (employeeId: string) => {
    toast({ description: `Function 2 for employee ${employeeId}` });
  };

  const handleFunction3 = (employeeId: string) => {
    toast({ description: `Function 3 for employee ${employeeId}` });
  };

  const handleAddEmployee = () => {
    toast({ description: "Add employee functionality coming soon" });
  };
  
  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3 shrink-0">
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
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1">
            <div className="px-6">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 border-b">
                  <TableRow>
                    <TableHead className="w-[80px] bg-white">Actions</TableHead>
                    {availableColumns.filter(col => selectedColumns.includes(col.id)).map(column => (
                      <TableHead key={column.id} className="bg-white">{column.label}</TableHead>
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
                            onViewDetails={() => handleViewDetails(employee.id)}
                            onEdit={() => handleEdit(employee.id)}
                            onDelete={() => handleDelete(employee.id)}
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
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Floating Add Employee Button */}
      <Button
        onClick={handleAddEmployee}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        size="icon"
        title="Add employee"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* HR Card Dialog */}
      {selectedEmployeeId && (
        <EmployeeHRCard
          employeeId={selectedEmployeeId}
          isOpen={isHRCardOpen}
          onClose={() => {
            setIsHRCardOpen(false);
            setSelectedEmployeeId(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
