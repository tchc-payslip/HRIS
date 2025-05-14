
import { create } from 'zustand';

export type TimeRecordStatus = 'present' | 'absent' | 'late' | 'leave';

export interface TimeRecord {
  id: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number;
  status: TimeRecordStatus;
  notes: string;
}

interface TimeAttendanceState {
  records: TimeRecord[];
  currentMonth: string;
  isLoading: boolean;
  error: string | null;
  fetchRecords: (month: string) => Promise<void>;
  clockIn: () => Promise<void>;
  clockOut: () => Promise<void>;
  requestLeave: (startDate: string, endDate: string, reason: string) => Promise<void>;
}

export const useTimeAttendanceStore = create<TimeAttendanceState>((set) => {
  const currentDate = new Date();
  const currentMonthString = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM
  
  return {
    records: [],
    currentMonth: currentMonthString,
    isLoading: false,
    error: null,
    
    fetchRecords: async (month = currentMonthString) => {
      set({ isLoading: true, error: null, currentMonth: month });
      
      try {
        // This would be a real API call in a production app
        const mockRecords: TimeRecord[] = Array.from({ length: 20 }, (_, i) => {
          const recordDate = new Date(month + `-${(i + 1).toString().padStart(2, '0')}`);
          
          if (recordDate > currentDate) return null;
          
          // Randomize some data for the mock
          const isWeekend = [0, 6].includes(recordDate.getDay());
          const randomStatus: TimeRecordStatus = isWeekend 
            ? 'absent' 
            : Math.random() > 0.8 
              ? ['absent', 'late', 'leave'][Math.floor(Math.random() * 3)] as TimeRecordStatus
              : 'present';
              
          const clockIn = randomStatus === 'present' || randomStatus === 'late' 
            ? `${8 + (randomStatus === 'late' ? 1 : 0)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` 
            : null;
            
          const clockOut = clockIn 
            ? `${5 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM` 
            : null;
            
          const totalHours = clockIn && clockOut ? 8 + Math.random() : 0;
          
          return {
            id: `attendance-${month}-${i + 1}`,
            date: recordDate.toISOString().split('T')[0],
            clockIn,
            clockOut,
            totalHours,
            status: randomStatus,
            notes: randomStatus === 'leave' ? 'Personal leave' : '',
          };
        }).filter(Boolean) as TimeRecord[];
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set({ records: mockRecords, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to fetch attendance records', isLoading: false });
      }
    },
    
    clockIn: async () => {
      set({ isLoading: true, error: null });
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const clockInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // This would be a real API call in a production app
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          const existingRecordIndex = state.records.findIndex(
            (record) => record.date === today
          );
          
          let updatedRecords;
          
          if (existingRecordIndex >= 0) {
            updatedRecords = [...state.records];
            updatedRecords[existingRecordIndex] = {
              ...updatedRecords[existingRecordIndex],
              clockIn: clockInTime,
              status: 'present' as TimeRecordStatus,
            };
          } else {
            const newRecord: TimeRecord = {
              id: `attendance-${Date.now()}`,
              date: today,
              clockIn: clockInTime,
              clockOut: null,
              totalHours: 0,
              status: 'present',
              notes: '',
            };
            updatedRecords = [...state.records, newRecord];
          }
          
          return { records: updatedRecords, isLoading: false };
        });
      } catch (error) {
        set({ error: 'Failed to clock in', isLoading: false });
      }
    },
    
    clockOut: async () => {
      set({ isLoading: true, error: null });
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const clockOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // This would be a real API call in a production app
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          const existingRecordIndex = state.records.findIndex(
            (record) => record.date === today
          );
          
          if (existingRecordIndex < 0) {
            set({ error: 'No clock-in record found for today', isLoading: false });
            return state;
          }
          
          const updatedRecords = [...state.records];
          const clockInTime = updatedRecords[existingRecordIndex].clockIn;
          
          if (!clockInTime) {
            set({ error: 'No clock-in time found', isLoading: false });
            return state;
          }
          
          // Calculate total hours (simplified)
          const totalHours = 8; // In a real app, calculate from clockIn and clockOut
          
          updatedRecords[existingRecordIndex] = {
            ...updatedRecords[existingRecordIndex],
            clockOut: clockOutTime,
            totalHours,
          };
          
          return { records: updatedRecords, isLoading: false };
        });
      } catch (error) {
        set({ error: 'Failed to clock out', isLoading: false });
      }
    },
    
    requestLeave: async (startDate, endDate, reason) => {
      set({ isLoading: true, error: null });
      
      try {
        // This would be a real API call in a production app
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          // Create leave records for the date range
          const start = new Date(startDate);
          const end = new Date(endDate);
          const leaveRecords: TimeRecord[] = [];
          
          for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const dateString = date.toISOString().split('T')[0];
            
            leaveRecords.push({
              id: `leave-${Date.now()}-${dateString}`,
              date: dateString,
              clockIn: null,
              clockOut: null,
              totalHours: 0,
              status: 'leave',
              notes: reason,
            });
          }
          
          // Filter out any existing records for the leave dates
          const filteredRecords = state.records.filter(
            (record) => !leaveRecords.some((leave) => leave.date === record.date)
          );
          
          return { records: [...filteredRecords, ...leaveRecords], isLoading: false };
        });
      } catch (error) {
        set({ error: 'Failed to request leave', isLoading: false });
      }
    },
  };
});
