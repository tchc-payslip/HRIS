
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RawAttendanceRecord {
  device_sn: string;
  employee_id: number;
  timestamp: string;
  employee_name?: string;
  department?: string;
}

interface RawAttendanceTableProps {
  loading: boolean;
  currentRecords: RawAttendanceRecord[];
}

const RawAttendanceTable: React.FC<RawAttendanceTableProps> = ({
  loading,
  currentRecords,
}) => {
  // Format timestamp to date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    return { date: dateStr, time: timeStr };
  };

  return (
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
  );
};

export default RawAttendanceTable;
