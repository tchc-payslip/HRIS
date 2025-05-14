
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimeRecord } from '@/store/timeAttendanceStore';

interface AttendanceTableProps {
  records: TimeRecord[];
  isLoading: boolean;
  currentMonth: string;
  onChangeMonth: (month: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const AttendanceTable = ({ records, isLoading, currentMonth, onChangeMonth, getStatusBadge }: AttendanceTableProps) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>View your past attendance records</CardDescription>
        </div>
        <div className="w-48">
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={currentMonth}
            onChange={(e) => onChangeMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-lg text-gray-500">Loading attendance records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">No attendance records found for this month</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.clockIn || '-'}</TableCell>
                  <TableCell>{record.clockOut || '-'}</TableCell>
                  <TableCell>{record.totalHours > 0 ? `${record.totalHours} hrs` : '-'}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
