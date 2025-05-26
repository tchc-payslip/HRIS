
import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface RawAttendanceRecord {
  device_sn: string;
  employee_id: number;
  timestamp: string;
  employee_name?: string;
  department?: string;
}

interface RawAttendanceExportProps {
  filteredRecords: RawAttendanceRecord[];
}

const RawAttendanceExport: React.FC<RawAttendanceExportProps> = ({
  filteredRecords,
}) => {
  const { toast } = useToast();

  // Format timestamp to date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    return { date: dateStr, time: timeStr };
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

  return (
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
  );
};

export default RawAttendanceExport;
