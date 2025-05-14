
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';
import { TimeRecord } from '@/store/timeAttendanceStore';
import { toast } from '@/hooks/use-toast';

interface ClockCardProps {
  todayRecord: TimeRecord | undefined;
  onClockIn: () => Promise<void>;
  onClockOut: () => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

const ClockCard = ({ todayRecord, onClockIn, onClockOut, getStatusBadge }: ClockCardProps) => {
  const handleClockIn = async () => {
    try {
      await onClockIn();
      toast({
        title: "Clock-in successful",
        description: `You clocked in at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      toast({
        title: "Clock-in failed",
        description: "Failed to record your clock-in time.",
        variant: "destructive",
      });
    }
  };
  
  const handleClockOut = async () => {
    try {
      await onClockOut();
      toast({
        title: "Clock-out successful",
        description: `You clocked out at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      toast({
        title: "Clock-out failed",
        description: "Failed to record your clock-out time.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Today's Status
        </CardTitle>
        <CardDescription>Track your working hours for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <h2 className="text-3xl font-bold mb-2">{new Date().toLocaleDateString()}</h2>
          <p className="text-lg text-gray-500 mb-6">{new Date().toLocaleString('en-US', { weekday: 'long' })}</p>
          
          {todayRecord ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Clock In</p>
                  <p className="text-xl font-semibold">{todayRecord.clockIn || 'Not clocked in'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Clock Out</p>
                  <p className="text-xl font-semibold">{todayRecord.clockOut || 'Not clocked out'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div>{getStatusBadge(todayRecord.status)}</div>
              </div>
              {todayRecord.status === 'present' && todayRecord.clockIn && !todayRecord.clockOut && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Working Hours</p>
                  <p className="text-xl font-semibold">In Progress</p>
                </div>
              )}
              {todayRecord.status === 'present' && todayRecord.clockIn && todayRecord.clockOut && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Total Hours</p>
                  <p className="text-xl font-semibold">{todayRecord.totalHours} hours</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No attendance recorded for today</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleClockIn}
          disabled={!!(todayRecord?.clockIn && !todayRecord?.clockOut) || todayRecord?.status === 'leave'}
        >
          Clock In
        </Button>
        <Button
          onClick={handleClockOut}
          disabled={!(todayRecord?.clockIn && !todayRecord?.clockOut) || todayRecord?.status === 'leave'}
        >
          Clock Out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClockCard;
