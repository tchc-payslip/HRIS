import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, AlertTriangle, Clock, Search, CalendarRange, Plus, Download, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import { ShiftData } from "@/integrations/supabase/client";

// Update interfaces for the database tables
interface ShiftPlanRecord {
  tenant_id: number;
  employee_id: number;
  month: string;
  shifts: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

interface EmployeeInfo {
  id: string;
  employee_id: number;
  employee_name: string;
  department: string;
  tenant_id: number;
}

interface ShiftPlanData {
  id: string;
  employee_id: number;
  employee_name: string;
  department: string;
  [key: string]: string | number; // For dynamic date columns
}

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

// Update the getDates function to get full month
const getDatesInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates = [];
  
  for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
};

interface ShiftPlanColumn {
  id: string;
  label: string | JSX.Element;
  accessor: keyof ShiftPlanData;
  minWidth: number;
  maxWidth: number;
  format?: (value: any, employee: ShiftPlanData) => JSX.Element;
  isSunday?: boolean;
}

// Helper function to get shift color
const getShiftColor = (shift: string | number): string => {
  const colorMap: { [key: string]: string } = {
    '1': 'bg-blue-400',
    '2': 'bg-blue-600',
    '3': 'bg-gray-500',
    '4': 'bg-yellow-400', // HC
    '0': '',
    '5': ''
  };
  return colorMap[shift?.toString()] || '';
};

// Helper function to format shift value for display
const formatShiftValue = (shift: string | number) => {
  const shiftMap: { [key: string]: string } = {
    '0': '-',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': 'HC',
    '5': '-'
  };
  return shiftMap[shift?.toString()] || shift;
};

const ShiftPlanTable = () => {
  const [employees, setEmployees] = useState<ShiftPlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const dates = getDatesInMonth(selectedDate);

  // Fetch employee data and shifts
  const fetchEmployeesAndShifts = async () => {
    try {
      setLoading(true);
      
      // First get all employees (since we're only using tenant 1 for now)
      const { data: allEmployees, error: allEmpError } = await supabase
        .from('employee_information')
        .select('id, employee_id, employee_name, department')
        .eq('tenant_id', 1)  // Hardcode to tenant 1 for now
        .order('employee_name');

      if (allEmpError) throw allEmpError;

      // Fetch shifts for the selected month
      const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      // Format as YYYY-MM-01 to match database format
      const monthString = format(firstDayOfMonth, 'yyyy-MM-01');
      console.log('Fetching shifts for month:', monthString); // Debug log
      
      const { data: shiftData, error: shiftError } = await supabase
        .from('shift_plan')
        .select('*')
        .eq('tenant_id', 1)  // Hardcode to tenant 1 for now
        .eq('month', monthString);

      if (shiftError) {
        console.error('Shift data fetch error:', shiftError); // Debug log
        throw shiftError;
      }

      console.log('Retrieved shift data:', shiftData); // Debug log

      // Transform data to include shifts
      const employeesWithShifts = allEmployees.map(emp => {
        const employeeShifts: ShiftPlanData = {
          id: emp.id,
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          department: emp.department,
        };

        // Find the employee's shift data for this month
        const employeeShiftData = shiftData?.find(s => s.employee_id === emp.employee_id);
        console.log(`Shifts for employee ${emp.employee_id}:`, employeeShiftData?.shifts); // Debug log
        
        // Add shift slots for each date
        dates.forEach(date => {
          const dateKey = format(date, "yyyy-MM-dd");
          const dayOfMonth = date.getDate().toString();
          
          // Get shift value from JSONB shifts object
          const shiftValue = employeeShiftData?.shifts?.[dayOfMonth];
          employeeShifts[dateKey] = shiftValue || "0"; // Use "0" for no shift
        });

        return employeeShifts;
      });

      setEmployees(employeesWithShifts);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load employee and shift data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchEmployeesAndShifts();
  }, [selectedDate]);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      console.log('Starting file upload process...');

      // Validate file extension
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        throw new Error('Please upload a valid Excel file (.xlsx or .xls)');
      }

      console.log('Parsing shift data from file...');
      const shifts = await parseShiftUpload(file);
      console.log(`Found ${shifts.length} shifts to upload`);

      // Upload shifts in batches to avoid payload size limits
      const batchSize = 100;
      const batches = [];
      for (let i = 0; i < shifts.length; i += batchSize) {
        batches.push(shifts.slice(i, i + batchSize));
      }

      console.log(`Processing ${batches.length} batches...`);
      let uploadedCount = 0;

      for (const [index, batch] of batches.entries()) {
        console.log(`Processing batch ${index + 1}/${batches.length}...`);
        
        // Group shifts by employee and month
        const shiftsByEmployeeMonth = new Map<string, ShiftData>();
        
        for (const shift of batch) {
          const year = shift.date.substring(0, 4);
          const month = shift.date.substring(4, 6);
          const monthDate = `${year}-${month}-01`;
          const key = `${shift.employee_id}-${monthDate}`;
          
          if (!shiftsByEmployeeMonth.has(key)) {
            shiftsByEmployeeMonth.set(key, {
              tenant_id: 1,  // Hardcode to tenant 1 for now
              employee_id: shift.employee_id,
              month: monthDate,
              shifts: {}
            });
          }
          
          const shiftData = shiftsByEmployeeMonth.get(key)!;
          const dayOfMonth = parseInt(shift.date.substring(6, 8)).toString();
          shiftData.shifts[dayOfMonth] = shift.shift.toString();
        }

        // Upsert the grouped shifts
        const { error } = await supabase
          .from('shift_plan')
          .upsert(Array.from(shiftsByEmployeeMonth.values()), {
            onConflict: 'employee_id,month',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Record upload error:', error);
          throw new Error(`Failed to upload record: ${error.message || 'Unknown error'}`);
        }

        uploadedCount += batch.length;
        console.log(`Successfully uploaded ${uploadedCount}/${shifts.length} shifts`);
      }

      toast({
        title: "Success",
        description: `Successfully uploaded ${uploadedCount} shifts`,
      });

      // Refresh the data
      await fetchEmployeesAndShifts();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload shifts",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    try {
      const wb = generateShiftTemplate(employees, dates);
      XLSX.writeFile(wb, 'shift_plan_template.xlsx');
      
      toast({
        title: "Success",
        description: "Template downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Error",
        description: "Failed to generate template",
        variant: "destructive",
      });
    }
  };

  // Define columns
  const fixedColumns: ShiftPlanColumn[] = [
    {
      id: "employee_id",
      label: "ID",
      accessor: "employee_id",
      minWidth: 60,
      maxWidth: 60,
    },
    {
      id: "employee_info",
      label: "Employee",
      accessor: "employee_name",
      minWidth: 200,
      maxWidth: 250,
      format: (value: any, employee: ShiftPlanData) => (
        <div className="flex flex-col">
          <div className="font-medium">{employee.employee_name}</div>
          <div className="text-sm text-gray-500">{employee.department}</div>
        </div>
      ),
    },
  ];

  const dateColumns: ShiftPlanColumn[] = dates.map((date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const isSunday = date.getDay() === 0;
    return {
      id: dateKey,
      label: (
        <div className={cn(
          "text-center flex flex-col items-center justify-center",
          isSunday && "text-red-600"  // Only header text in red for Sunday
        )}>
          <div className="text-xs font-medium">{format(date, "EEE")}</div>
          <div className="text-xs">{format(date, "dd")}</div>
        </div>
      ),
      accessor: dateKey as keyof ShiftPlanData,
      minWidth: 50,
      maxWidth: 50,
      format: (value: any, _employee: ShiftPlanData) => (
        <div className="text-center min-h-[24px] flex items-center justify-center">
          {formatShiftValue(value)}
        </div>
      ),
      isSunday,
    };
  });

  return (
    <Card className="pt-2">
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Shift Plan</h2>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {format(selectedDate, "MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      // Ensure we're always setting to the first day of the month
                      const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                      setSelectedDate(firstOfMonth);
                    }
                  }}
                  initialFocus
                  disabled={(date) => 
                    date.getDate() !== 1 // Only allow selecting first day of month
                  }
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="h-8" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-1" />
              Template
            </Button>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <Button
                variant="default"
                size="sm"
                className="h-8 bg-primary hover:bg-primary/90"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-1" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-md">
          <div className="relative">
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
                <Table>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-20 bg-white">
                      {fixedColumns.map((column) => (
                        <TableHead 
                          key={column.id}
                          className="bg-white border-b sticky left-0 z-30"
                          style={{ 
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                          }}
                        >
                          {column.label}
                        </TableHead>
                      ))}
                      {dateColumns.map((column) => (
                        <TableHead 
                          key={column.id}
                          className={cn(
                            "bg-white border-b border-r p-0 h-12",
                            column.isSunday && "bg-gray-100"
                          )}
                          style={{ 
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                          }}
                        >
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell 
                          colSpan={fixedColumns.length + dateColumns.length}
                          className="text-center py-6 text-gray-500"
                        >
                          Loading shift plan...
                        </TableCell>
                      </TableRow>
                    ) : employees.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={fixedColumns.length + dateColumns.length}
                          className="text-center py-6 text-gray-500"
                        >
                          No employees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((employee) => (
                        <TableRow key={employee.id}>
                          {fixedColumns.map((column) => (
                            <TableCell 
                              key={`${employee.id}-${column.id}`}
                              className="sticky left-0 bg-white"
                              style={{ 
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                              }}
                            >
                              {column.format 
                                ? column.format(employee[column.accessor], employee)
                                : employee[column.accessor]}
                            </TableCell>
                          ))}
                          {dateColumns.map((column) => (
                            <TableCell 
                              key={`${employee.id}-${column.id}`}
                              className={cn(
                                "p-2 border-r",
                                column.isSunday && "bg-gray-100"
                              )}
                              style={{ 
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                              }}
                            >
                              {column.format 
                                ? column.format(employee[column.accessor], employee)
                                : employee[column.accessor]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end text-sm text-gray-500 pb-2">
          1: Morning | 2: Afternoon | 3: Night | HC: Holiday Cover | Blank: Off Day
        </div>
      </div>
    </Card>
  );
};

const AttendancePlaceholder = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Present Today</h3>
            <p className="text-2xl">24/30</p>
            <p className="text-sm text-gray-500">80% attendance rate</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-2">Late</h3>
            <p className="text-2xl">3</p>
            <p className="text-sm text-gray-500">10% of present employees</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-2">Absent</h3>
            <p className="text-2xl">6</p>
            <p className="text-sm text-gray-500">20% of total employees</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-2">On Leave</h3>
            <p className="text-2xl">2</p>
            <p className="text-sm text-gray-500">Approved leaves</p>
          </Card>
        </div>
        <Card className="p-4">
          <h3 className="font-medium mb-4">Attendance Chart Placeholder</h3>
          <div className="h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500">
            Attendance trends visualization will be displayed here
          </div>
        </Card>
      </div>
    </Card>
  );
};

// Raw Attendance Types
interface RawAttendanceRecord {
  device_sn: string;
  employee_id: number;
  timestamp: string;
  employee_name?: string;
  department?: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Format timestamp helper function
const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString();
  return { date: dateStr, time: timeStr };
};

const TimestampTab = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<RawAttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<RawAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const { toast } = useToast();

  // Load raw attendance data
  useEffect(() => {
    const loadRawAttendance = async () => {
      try {
        setLoading(true);
        
        const { data: rawAttendanceData, error: rawError } = await supabase
          .from("raw_attendance")
          .select("*")
          .order("timestamp", { ascending: false });

        if (rawError) throw rawError;

        const { data: employeeData, error: empError } = await supabase
          .from("employee_information")
          .select("employee_id, employee_name, department");

        if (empError) throw empError;

        const mergedData = rawAttendanceData.map(record => {
          const employee = employeeData.find(emp => emp.employee_id === record.employee_id);
          return {
            ...record,
            employee_name: employee?.employee_name || "Unknown",
            department: employee?.department || "Unknown"
          };
        });

        setAttendanceRecords(mergedData);
        setFilteredRecords(mergedData);
      } catch (error) {
        console.error("Failed to load raw attendance data:", error);
        toast({
          title: "Error",
          description: "Failed to load raw attendance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRawAttendance();
  }, [toast]);

  // Handle quick date filter selection from dropdown
  const handleQuickFilter = (filterType: string) => {
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (filterType) {
      case "this-week":
        from = startOfWeek(today);
        to = endOfWeek(today);
        break;
      case "this-month":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "this-year":
        from = startOfYear(today);
        to = endOfYear(today);
        break;
      default:
        from = undefined;
        to = undefined;
    }

    setDateRange({ from, to });
    handleSearch(searchTerm, searchField, { from, to });
  };

  // Handle search with date range
  const handleSearch = (term: string, field: string, dates?: DateRange) => {
    setSearchTerm(term);
    setSearchField(field);
    
    let filtered = [...attendanceRecords];
    
    // Apply search filter
    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(record => {
        switch (field) {
          case "employee_id":
            return record.employee_id.toString().includes(searchLower);
          case "employee_name":
            return record.employee_name.toLowerCase().includes(searchLower);
          case "department":
            return record.department.toLowerCase().includes(searchLower);
          case "device":
            return record.device_sn.toLowerCase().includes(searchLower);
          default:
            return (
              record.employee_id.toString().includes(searchLower) ||
              record.employee_name.toLowerCase().includes(searchLower) ||
              record.department.toLowerCase().includes(searchLower) ||
              record.device_sn.toLowerCase().includes(searchLower)
            );
        }
      });
    }

    // Apply date range filter
    const dateRangeToUse = dates || dateRange;
    if (dateRangeToUse.from || dateRangeToUse.to) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        if (dateRangeToUse.from && dateRangeToUse.to) {
          return recordDate >= dateRangeToUse.from && recordDate <= dateRangeToUse.to;
        }
        if (dateRangeToUse.from) {
          return recordDate >= dateRangeToUse.from;
        }
        if (dateRangeToUse.to) {
          return recordDate <= dateRangeToUse.to;
        }
        return true;
      });
    }

    setFilteredRecords(filtered);
  };

  // Handle export
  const handleExport = () => {
    try {
      const exportData = filteredRecords.map(record => {
        const { date, time } = formatDateTime(record.timestamp);
        return {
          'Employee ID': record.employee_id,
          'Employee Name': record.employee_name,
          'Department': record.department,
          'Date': date,
          'Time': time,
          'Device SN': record.device_sn
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Records');
      XLSX.writeFile(wb, `attendance_records_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);

      toast({
        title: "Success",
        description: "Records exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export records",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={searchField}
              onValueChange={(value) => {
                setSearchField(value);
                handleSearch(searchTerm, value);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="employee_id">Employee ID</SelectItem>
                <SelectItem value="employee_name">Employee Name</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="device">Device SN</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value, searchField)}
              className="w-[200px]"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(
                "gap-2",
                (dateRange.from || dateRange.to) && "bg-gray-100 text-gray-900"
              )}>
                <CalendarRange className="h-4 w-4" />
                {dateRange.from || dateRange.to ? format(
                  dateRange.from || dateRange.to || new Date(),
                  "MMM dd, yyyy"
                ) + (dateRange.to ? ` - ${format(dateRange.to, "MMM dd, yyyy")}` : "") : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("this-week")}
                  >
                    This Week
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("this-month")}
                  >
                    This Month
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("this-year")}
                  >
                    This Year
                  </Button>
                  {(dateRange.from || dateRange.to) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        setDateRange({ from: undefined, to: undefined });
                        handleSearch(searchTerm, searchField);
                      }}
                    >
                      Clear Dates
                    </Button>
                  )}
                </div>
              </div>
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  setDateRange({ 
                    from: range?.from, 
                    to: range?.to 
                  });
                  handleSearch(searchTerm, searchField);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <div className="flex-1 text-sm text-gray-500 text-right">
            {filteredRecords.length} records found
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                <TableRow>
                  <TableHead className="bg-white border-b w-[100px]">Employee ID</TableHead>
                  <TableHead className="bg-white border-b w-[200px]">Employee Name</TableHead>
                  <TableHead className="bg-white border-b w-[200px]">Department</TableHead>
                  <TableHead className="bg-white border-b w-[120px]">Date</TableHead>
                  <TableHead className="bg-white border-b w-[120px]">Time</TableHead>
                  <TableHead className="bg-white border-b w-[150px]">Device SN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell 
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      Loading attendance records...
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record, index) => {
                    const { date, time } = formatDateTime(record.timestamp);
                    return (
                      <TableRow key={`${record.device_sn}-${record.timestamp}-${index}`}>
                        <TableCell>{record.employee_id}</TableCell>
                        <TableCell>{record.employee_name}</TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{time}</TableCell>
                        <TableCell>{record.device_sn}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};

// Update the generateShiftTemplate function
const generateShiftTemplate = (employees: ShiftPlanData[], dates: Date[]) => {
  // Create headers
  const headers = ['tenant_id', 'employee_id', 'employee_type', ...dates.map(date => format(date, 'yyyyMMdd'))];
  
  // Create rows
  const rows = employees.map(emp => {
    const row: (string | number)[] = [1, emp.employee_id, '']; // Default tenant_id to 1, employee_type to be filled by user
    dates.forEach(() => row.push('')); // Empty cells for shifts
    return row;
  });

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Add data validation for employee_type column
  const dataValidation = {
    type: 'list',
    allowBlank: false,
    formula1: '"1,2"', // Only allow 1 or 2
    showErrorMessage: true,
    errorTitle: 'Invalid Employee Type',
    error: 'Please select either 1 or 2',
    prompt: 'Select 1 for shift workers, 2 for office workers'
  };

  // Set column widths
  const wscols = [
    { wch: 10 }, // tenant_id
    { wch: 12 }, // employee_id
    { wch: 12 }, // employee_type
    ...dates.map(() => ({ wch: 8 })) // date columns
  ];

  ws['!cols'] = wscols;
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Shift Plan');
  
  return wb;
};

// Update the parseShiftUpload function to handle employee types
const parseShiftUpload = async (file: File): Promise<{ tenant_id: number; employee_id: number; date: string; shift: number; }[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        if (rows.length < 2) {
          throw new Error('Template is empty');
        }

        const headers = rows[0];
        if (!headers[0] || headers[0].toString().toLowerCase() !== 'tenant_id' ||
            !headers[1] || headers[1].toString().toLowerCase() !== 'employee_id' ||
            !headers[2] || headers[2].toString().toLowerCase() !== 'employee_type') {
          throw new Error('Invalid template format: First columns must be tenant_id, employee_id, and employee_type');
        }

        const shifts: { tenant_id: number; employee_id: number; date: string; shift: number; }[] = [];
        const errors: string[] = [];

        // Process each row starting from row 2 (index 1)
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !row.length) continue; // Skip empty rows

          const tenant_id = parseInt(row[0]);
          if (isNaN(tenant_id) || tenant_id <= 0) {
            errors.push(`Row ${i + 1}: Invalid tenant ID (must be a positive number)`);
            continue;
          }

          const employee_id = parseInt(row[1]);
          if (isNaN(employee_id) || employee_id <= 0) {
            errors.push(`Row ${i + 1}: Invalid employee ID (must be a positive number)`);
            continue;
          }

          const employee_type = parseInt(row[2]);
          if (![1, 2].includes(employee_type)) {
            errors.push(`Row ${i + 1}: Invalid employee type (must be 1 or 2)`);
            continue;
          }

          // Process each date column starting from index 3 (after tenant_id, employee_id, and employee_type)
          for (let j = 3; j < headers.length; j++) {
            const date = headers[j]?.toString();
            if (!date || !/^\d{8}$/.test(date)) {
              errors.push(`Column ${j + 1}: Invalid date format (expected YYYYMMDD)`);
              continue;
            }

            const shiftValue = row[j]?.toString().trim().toUpperCase();
            
            // Convert shift values based on employee type
            let normalizedShift: number;
            
            if (employee_type === 1) {
              // Type 1 employee (shift worker)
              if (shiftValue === '' || shiftValue === '0') {
                normalizedShift = 0; // Day-off for Type 1
              } else {
                const shift = parseInt(shiftValue);
                if (![1, 2, 3].includes(shift)) {
                  errors.push(`Row ${i + 1}, Column ${j + 1}: Invalid shift value for Type 1 employee (expected 0-3)`);
                  continue;
                }
                normalizedShift = shift;
              }
            } else {
              // Type 2 employee (office worker)
              if (shiftValue === '' || shiftValue === '0') {
                normalizedShift = 5; // Convert to Type 2 day-off
              } else if (shiftValue === 'HC') {
                normalizedShift = 4; // Convert HC to 4
              } else {
                errors.push(`Row ${i + 1}, Column ${j + 1}: Invalid shift value for Type 2 employee (expected 0 or HC)`);
                continue;
              }
            }

            shifts.push({
              tenant_id,
              employee_id,
              date,
              shift: normalizedShift
            });
          }
        }

        if (errors.length > 0) {
          throw new Error(`Validation errors:\n${errors.join('\n')}`);
        }

        if (shifts.length === 0) {
          throw new Error('No valid shifts found in the template');
        }

        resolve(shifts);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

const AttendanceLeaveManagement = () => {
  return (
    <div className="pt-0 min-h-screen bg-secondary">
      <Tabs defaultValue="attendance" className="space-y-2">
        <TabsList className="bg-background sticky top-0 z-30 w-full">
          <TabsTrigger 
            value="attendance"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger 
            value="timestamp"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Timestamp
          </TabsTrigger>
          <TabsTrigger 
            value="shift"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Shift
          </TabsTrigger>
          <TabsTrigger 
            value="leave"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Leave
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="m-0">
          <AttendancePlaceholder />
        </TabsContent>

        <TabsContent value="timestamp" className="m-0">
          <TimestampTab />
        </TabsContent>

        <TabsContent value="shift" className="m-0">
          <ShiftPlanTable />
        </TabsContent>
        
        <TabsContent value="leave" className="m-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Leave Management</h2>
            <p className="text-gray-500 mt-2">Hello World - Leave management placeholder</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceLeaveManagement;
