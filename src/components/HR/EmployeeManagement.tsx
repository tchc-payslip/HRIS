import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus, ChevronUp, ChevronDown } from "lucide-react";
import ColumnSelectionDialog from "./ColumnSelectionDialog";
import RowActionMenu from "./RowActionMenu";
import EmployeeHRCard from "./EmployeeHRCard";
import { fetchEmployees, Employee } from "@/services/employeeService";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";

type SortField = keyof Employee | 'employee_id';
type SortDirection = 'asc' | 'desc';
type SearchField = 'employee_name' | 'employee_id' | 'phone_number' | 'email';

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
  const [searchField, setSearchField] = useState<SearchField>("employee_name");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isHRCardOpen, setIsHRCardOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { toast } = useToast();
  
  // Define available columns with all the new ones
  const availableColumns = [
    { id: "employee_id", label: "Employee ID" },
    { id: "employee_name", label: "Name" },
    { id: "title", label: "Job Title" },
    { id: "department", label: "Department" },
    { id: "sub_department", label: "Sub Department" },
    { id: "duty", label: "Duty" },
    { id: "contract_type", label: "Contract Type" },
    { id: "contract_start_date_cv", label: "Hire Date" },
    { id: "seniority_date_cv", label: "Seniority Date" },
    { id: "email", label: "Email" },
    { id: "phone_number", label: "Phone" },
    { id: "gender", label: "Gender" },
    { id: "date_of_birth_cv", label: "Date of Birth" },
    { id: "marital_status", label: "Marital Status" },
    { id: "national_id", label: "National ID" },
    { id: "permanent_address", label: "Permanent Address" },
    { id: "highest_education", label: "Highest Education" },
    { id: "education_institution", label: "Education Institution" },
    { id: "major", label: "Major" },
    { id: "nationality", label: "Nationality" },
  ];

  const searchFieldOptions = [
    { value: "employee_name", label: "Name" },
    { value: "employee_id", label: "Employee ID" },
    { value: "phone_number", label: "Phone" },
    { value: "email", label: "Email" }
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };
  
  const filteredAndSortedEmployees = React.useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = searchTerm === "" || (() => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchField) {
          case 'employee_name':
            return employee.employee_name?.toLowerCase().includes(searchValue);
          case 'employee_id':
            return employee.employee_id?.toString().includes(searchValue);
          case 'phone_number':
            return employee.phone_number?.toLowerCase().includes(searchValue);
          case 'email':
            return employee.email?.toLowerCase().includes(searchValue);
          default:
            return false;
        }
      })();
      
      const matchesDepartment = filterDepartment === "all" || 
        employee.department === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });

    // Sort employees
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        // Convert to string for comparison
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        
        const result = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? result : -result;
      });
    }

    return filtered;
  }, [employees, searchTerm, searchField, filterDepartment, sortField, sortDirection]);
  
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

  const formatCellValue = (column: any, value: any) => {
    if (column.id === 'contract_start_date_cv' || column.id === 'seniority_date_cv' || column.id === 'date_of_birth_cv') {
      return value ? new Date(value as string).toLocaleDateString() : '-';
    }
    return String(value || '-');
  };
  
  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3 shrink-0">
          <div className="flex flex-col gap-4">
            {/* Search Bar Row */}
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Select value={searchField} onValueChange={(value: SearchField) => setSearchField(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {searchFieldOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder={`Search by ${searchFieldOptions.find(opt => opt.value === searchField)?.label}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {/* Filter and Action Buttons Row */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
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
              
              <div className="flex flex-col md:flex-row gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>

                <ColumnSelectionDialog
                  columns={availableColumns}
                  selectedColumns={selectedColumns}
                  onColumnToggle={handleColumnToggle}
                />

                <Button 
                  onClick={handleAddEmployee} 
                  data-action="add-employee"
                  className="bg-gray-700 hover:bg-gray-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <DataTable
            data={filteredAndSortedEmployees}
            columns={[
              {
                id: "employee_id",
                label: "Employee ID",
                accessor: "employee_id",
                minWidth: 120
              },
              ...availableColumns
                .filter(col => selectedColumns.includes(col.id) && col.id !== 'employee_id')
                .map(col => ({
                  id: col.id,
                  label: col.label,
                  accessor: col.id as keyof Employee,
                  minWidth: 150,
                  format: (value: any) => formatCellValue({ id: col.id }, value)
                }))
            ]}
            loading={loading}
            stickyFirstColumn
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            renderFirstColumn={(employee) => (
              <RowActionMenu
                onViewDetails={() => handleViewDetails(employee.id)}
                onEdit={() => handleEdit(employee.id)}
                onDelete={() => handleDelete(employee.id)}
                onFunction2={() => handleFunction2(employee.id)}
                onFunction3={() => handleFunction3(employee.id)}
              />
            )}
            emptyMessage="No employees found"
            loadingMessage="Loading employee data..."
          />
        </CardContent>
      </Card>

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
