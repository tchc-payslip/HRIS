import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ExcelJS from 'exceljs';

interface RawAttendanceRecord {
  device_sn: string;
  employee_id: number;
  timestamp: string;
  employee_name?: string;
  department?: string;
}

interface RawAttendanceExportProps {
  records: RawAttendanceRecord[];
  filteredRecords: RawAttendanceRecord[];
}

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: format(date, 'yyyy-MM-dd'),
    time: format(date, 'HH:mm:ss')
  };
};

const RawAttendanceExport: React.FC<RawAttendanceExportProps> = ({
  records,
  filteredRecords
}) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    const headers = ["Employee ID", "Employee Name", "Department", "Date", "Time", "Device SN"];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => {
        const { date, time } = formatDateTime(record.timestamp);
        return [
          record.employee_id,
          `"${record.employee_name || ''}"`,
          `"${record.department || ''}"`,
          date,
          time,
          record.device_sn
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raw_attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast({
      title: "Success",
      description: `Data exported to CSV successfully (${filteredRecords.length} records)`,
    });
  };

  const exportToXLSX = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Raw Attendance');

    // Add headers with styling
    worksheet.columns = [
      { header: 'Employee ID', key: 'employeeId', width: 12 },
      { header: 'Employee Name', key: 'employeeName', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Time', key: 'time', width: 10 },
      { header: 'Device SN', key: 'deviceSn', width: 15 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data
    filteredRecords.forEach(record => {
      const { date, time } = formatDateTime(record.timestamp);
      worksheet.addRow({
        employeeId: record.employee_id,
        employeeName: record.employee_name || '',
        department: record.department || '',
        date,
        time,
        deviceSn: record.device_sn
      });
    });

    // Generate blob and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raw_attendance_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);

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
