
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TimeRecord } from '@/store/timeAttendanceStore';

interface LeaveTableProps {
  records: TimeRecord[];
}

const LeaveTable = ({ records }: LeaveTableProps) => {
  const leaveRecords = records.filter((record) => record.status === 'leave');

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        {leaveRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">No leave records found</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="bg-white border-b">Date</TableHead>
                    <TableHead className="bg-white border-b">Type</TableHead>
                    <TableHead className="bg-white border-b">Status</TableHead>
                    <TableHead className="bg-white border-b">Duration</TableHead>
                    <TableHead className="bg-white border-b">Reason</TableHead>
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
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveTable;
