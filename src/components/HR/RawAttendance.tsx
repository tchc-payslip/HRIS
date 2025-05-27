
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import RawAttendanceFilters from "./RawAttendanceFilters";
import RawAttendanceTable from "./RawAttendanceTable";
import RawAttendancePagination from "./RawAttendancePagination";
import RawAttendanceExport from "./RawAttendanceExport";

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

  // Pagination handlers
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Raw Attendance</h1>
      </div>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex flex-col gap-4">
            {/* Search and Export Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <RawAttendanceFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  quickFilter={quickFilter}
                  setQuickFilter={setQuickFilter}
                  onQuickFilter={handleQuickFilter}
                  onMonthSelect={handleMonthSelect}
                  onClearFilters={clearFilters}
                  filteredRecordsCount={filteredRecords.length}
                />
              </div>
              
              <RawAttendanceExport filteredRecords={filteredRecords} />
            </div>

            {/* Inline Pagination and Rows Per Page */}
            <RawAttendancePagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              filteredRecordsCount={filteredRecords.length}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              variant="inline"
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Scrollable Table Container */}
          <div className="flex-1 overflow-hidden border rounded-md">
            <div className="h-full overflow-auto">
              <RawAttendanceTable
                loading={loading}
                currentRecords={currentRecords}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RawAttendance;
