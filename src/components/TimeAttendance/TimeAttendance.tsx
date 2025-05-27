
import React, { useEffect } from 'react';
import { useTimeAttendanceStore } from '@/store/timeAttendanceStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClockCard from './ClockCard';
import LeaveRequestCard from './LeaveRequestCard';
import AttendanceTable from './AttendanceTable';
import LeaveTable from './LeaveTable';
import StatusBadge from './StatusBadge';
import { toast } from '@/hooks/use-toast';

const TimeAttendance = () => {
  const { records, currentMonth, isLoading, error, fetchRecords, clockIn, clockOut, requestLeave } = useTimeAttendanceStore();
  
  useEffect(() => {
    fetchRecords(currentMonth);
  }, [fetchRecords, currentMonth]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const todayRecord = records.find(
    (record) => record.date === new Date().toISOString().split('T')[0]
  );
  
  const getStatusBadge = (status: string) => <StatusBadge status={status as any} />;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClockCard 
          todayRecord={todayRecord} 
          onClockIn={clockIn} 
          onClockOut={clockOut} 
          getStatusBadge={getStatusBadge}
        />
        
        <LeaveRequestCard onRequestLeave={requestLeave} />
      </div>
      
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="attendance">Attendance History</TabsTrigger>
          <TabsTrigger value="leaves">Leave History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="mt-0">
          <AttendanceTable 
            records={records}
            isLoading={isLoading}
            currentMonth={currentMonth}
            onChangeMonth={fetchRecords}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="leaves" className="mt-0">
          <LeaveTable records={records} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeAttendance;
