
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TimeRecordStatus } from '@/store/timeAttendanceStore';

interface StatusBadgeProps {
  status: TimeRecordStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'present':
      return <Badge className="bg-green-500">Present</Badge>;
    case 'absent':
      return <Badge variant="destructive">Absent</Badge>;
    case 'late':
      return <Badge className="bg-yellow-500">Late</Badge>;
    case 'leave':
      return <Badge className="bg-blue-500">Leave</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

export default StatusBadge;
