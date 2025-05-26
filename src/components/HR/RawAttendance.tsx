
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Calendar, CalendarRange } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';

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

const RawAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<RawAttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<RawAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [quickFilter, setQuickFilter] = useState<string>("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  const { toast } = useToast();

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRecords.length, rowsPerPage]);

  // Load raw attendance data from Supabase
  useEffect(() => {
    const loadRawAttendance = async () => {
      try {
        setLoading(true);
        
        // First, get raw attendance data
        const { data: rawAttendanceData, error: rawError } = await supabase
          .from("raw_attendance")
          .select("*")
          .order("timestamp", { ascending: false });

        if (rawError) {
          throw rawError;
        }

        // Get employee information
        const { data: employeeData, error: empError } = await supabase
          .from("employee_information")
          .select("employee_id, employee_name, department");

        if (empError) {
          throw empError;
        }

        // Merge the data
        const mergedData = rawAttendanceData.map(record => {
          const employee = employeeData.find(emp => emp.employee_id === record.employee_id);
          return {
            ...record,
            employee_name: employee?.employee_name || "Unknown",
            department: employee?.department || "Unknown"
          };
        });

        setAttendanceRecords(mergedData);
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

  // Apply filters when data or filters change
  useEffect(() => {
    let filtered = attendanceRecords;

    // Apply search filter
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.employee_id?.toString().includes(searchValue) ||
        record.employee_name?.toLowerCase().includes(searchValue) ||
        record.department?.toLowerCase().includes(searchValue) ||
        record.device_sn?.toLowerCase().includes(searchValue)
      );
    }

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        const from = dateRange.from;
        const to = dateRange.to;
        
        if (from && to) {
          return recordDate >= from && recordDate <= to;
        } else if (from) {
          return recordDate >= from;
        } else if (to) {
          return recordDate <= to;
        }
        return true;
      });
    }

    setFilteredRecords(filtered);
  }, [attendanceRecords, searchTerm, dateRange]);

  // Quick filter handlers
  const handleQuickFilter = (filterType: string) => {
    const now = new Date();
    let from: Date, to: Date;

    switch (filterType) {
      case "this-week":
        from = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
        to = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "this-month":
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
      case "this-year":
        from = startOfYear(now);
        to = endOfYear(now);
        break;
      default:
        return;
    }

    setDateRange({ from, to });
    setQuickFilter(filterType);
  };

  // Handle month selection from calendar
  const handleMonthSelect = (date: Date) => {
    const from = startOfMonth(date);
    const to = endOfMonth(date);
    setDateRange({ from, to });
    setQuickFilter("custom-month");
  };

  // Clear filters
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setQuickFilter("");
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ["Employee ID", "Employee Name", "Department", "Date", "Time", "Device SN"];
    const csvData = filteredRecords.map(record => {
      const { date, time } = formatDateTime(record.timestamp);
      return [
        record.employee_id || '',
        record.employee_name || '',
        record.department || '',
        date,
        time,
        record.device_sn
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `raw_attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: `Data exported to CSV successfully (${filteredRecords.length} records)`,
    });
  };

  const exportToXLSX = () => {
    const headers = ["Employee ID", "Employee Name", "Department", "Date", "Time", "Device SN"];
    const excelData = filteredRecords.map(record => {
      const { date, time } = formatDateTime(record.timestamp);
      return {
        "Employee ID": record.employee_id || '',
        "Employee Name": record.employee_name || '',
        "Department": record.department || '',
        "Date": date,
        "Time": time,
        "Device SN": record.device_sn
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Raw Attendance");
    XLSX.writeFile(workbook, `raw_attendance_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

    toast({
      title: "Success",
      description: `Data exported to Excel successfully (${filteredRecords.length} records)`,
    });
  };

  // Format timestamp to date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    return { date: dateStr, time: timeStr };
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Select date range";
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    if (dateRange.from) {
      return `From ${format(dateRange.from, "MMM dd, yyyy")}`;
    }
    if (dateRange.to) {
      return `To ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    return "Select date range";
  };

  // Pagination handlers
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Raw Attendance</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            {/* Search and Export Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by employee ID, name, department, or device..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportToCSV}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToXLSX}>
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Date Range Filters Row */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                <Button
                  variant={quickFilter === "this-week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickFilter("this-week")}
                  className={cn(
                    quickFilter === "this-week" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
                  )}
                >
                  This Week
                </Button>
                <Button
                  variant={quickFilter === "this-month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickFilter("this-month")}
                  className={cn(
                    quickFilter === "this-month" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
                  )}
                >
                  This Month
                </Button>
                <Button
                  variant={quickFilter === "this-year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickFilter("this-year")}
                  className={cn(
                    quickFilter === "this-year" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
                  )}
                >
                  This Year
                </Button>
              </div>

              {/* Custom Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "gap-2",
                      quickFilter === "custom" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
                    )}
                  >
                    <CalendarRange className="h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range) {
                        setDateRange({ from: range.from, to: range.to });
                        setQuickFilter("custom");
                      }
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {/* Month Picker for Historical Data */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "gap-2",
                      quickFilter === "custom-month" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    Pick Month
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    onSelect={(date) => {
                      if (date) {
                        handleMonthSelect(date);
                      }
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              {(dateRange.from || dateRange.to) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filter Display */}
            {(dateRange.from || dateRange.to) && (
              <div className="text-sm text-gray-600">
                Showing records for: {formatDateRange()} ({filteredRecords.length} records)
              </div>
            )}

            {/* Rows per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Device SN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell 
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      Loading raw attendance data...
                    </TableCell>
                  </TableRow>
                ) : currentRecords.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRecords.map((record, index) => {
                    const { date, time } = formatDateTime(record.timestamp);
                    return (
                      <TableRow key={`${record.device_sn}-${record.timestamp}-${index}`}>
                        <TableCell>{record.employee_id || '-'}</TableCell>
                        <TableCell>{record.employee_name || '-'}</TableCell>
                        <TableCell>{record.department || '-'}</TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{time}</TableCell>
                        <TableCell>{record.device_sn}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {generatePageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2">...</span>
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RawAttendance;
