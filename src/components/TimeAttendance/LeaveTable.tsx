
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TimeRecord } from '@/store/timeAttendanceStore';

interface LeaveTableProps {
  records: TimeRecord[];
}

const LeaveTable = ({ records }: LeaveTableProps) => {
  const leaveRecords = records.filter((record) => record.status === 'leave');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave History</CardTitle>
        <CardDescription>View your leave requests and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>Leave</TableCell>
                <TableCell>
                  <Badge>Approved</Badge>
                </TableCell>
                <TableCell>1 day</TableCell>
                <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
              </TableRow>
            ))}
            {leaveRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No leave records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaveTable;
