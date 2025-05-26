
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RawAttendanceRecord {
  device_sn: string;
  employee_id: number;
  timestamp: string;
  employee_name?: string;
  department?: string;
}

const RawAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<RawAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

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

  // Filter records based on search term
  const filteredRecords = attendanceRecords.filter(record => {
    const searchValue = searchTerm.toLowerCase();
    return (
      record.employee_id?.toString().includes(searchValue) ||
      record.employee_name?.toLowerCase().includes(searchValue) ||
      record.department?.toLowerCase().includes(searchValue) ||
      record.device_sn?.toLowerCase().includes(searchValue)
    );
  });

  // Format timestamp to date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    return { date: dateStr, time: timeStr };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Raw Attendance</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by employee ID, name, department, or device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
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
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record, index) => {
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RawAttendance;
