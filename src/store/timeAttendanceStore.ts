
import { create } from 'zustand';

interface TimeRecord {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'leave';
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

export const useTimeAttendanceStore = create<TimeAttendanceState>((set, get) => ({
  records: [],
  currentMonth: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
  isLoading: false,
  error: null,
  
  fetchRecords: async (month) => {
    set({ isLoading: true, error: null, currentMonth: month });
    
    try {
      // This would be a real API call in a production app
      const today = new Date();
      const mockRecords = Array.from({ length: 20 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const clockIn = `${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        const clockOutHour = 17 + Math.floor(Math.random() * 2);
        const clockOut = `${clockOutHour}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        
        const totalHours = clockOutHour - parseInt(clockIn.split(':')[0]) - (Math.random() > 0.7 ? 1 : 0);
        
        return {
          id: `record-${i}`,
          date: date.toISOString().split('T')[0],
          clockIn,
          clockOut,
          totalHours,
          status: Math.random() > 0.8 ? 'late' : 'present',
          notes: '',
        };
      });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set({ records: mockRecords, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch time records', isLoading: false });
    }
  },
  
  clockIn: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const clockInTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      set((state) => {
        const existingRecordIndex = state.records.findIndex(record => record.date === today);
        
        if (existingRecordIndex !== -1) {
          const updatedRecords = [...state.records];
          updatedRecords[existingRecordIndex] = {
            ...updatedRecords[existingRecordIndex],
            clockIn: clockInTime,
          };
          return { records: updatedRecords, isLoading: false };
        } else {
          const newRecord = {
            id: `record-${Date.now()}`,
            date: today,
            clockIn: clockInTime,
            clockOut: '',
            totalHours: 0,
            status: 'present',
            notes: '',
          };
          return { records: [newRecord, ...state.records], isLoading: false };
        }
      });
    } catch (error) {
      set({ error: 'Failed to clock in', isLoading: false });
    }
  },
  
  clockOut: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const clockOutTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      set((state) => {
        const existingRecordIndex = state.records.findIndex(record => record.date === today);
        
        if (existingRecordIndex !== -1) {
          const updatedRecords = [...state.records];
          const record = updatedRecords[existingRecordIndex];
          
          if (record.clockIn) {
            const clockInHour = parseInt(record.clockIn.split(':')[0]);
            const totalHours = now.getHours() - clockInHour;
            
            updatedRecords[existingRecordIndex] = {
              ...record,
              clockOut: clockOutTime,
              totalHours,
            };
          }
          
          return { records: updatedRecords, isLoading: false };
        }
        
        return { isLoading: false };
      });
    } catch (error) {
      set({ error: 'Failed to clock out', isLoading: false });
    }
  },
  
  requestLeave: async (startDate, endDate, reason) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      set((state) => {
        // Create leave records for each day in the range
        const start = new Date(startDate);
        const end = new Date(endDate);
        const newRecords = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const date = d.toISOString().split('T')[0];
          newRecords.push({
            id: `leave-${Date.now()}-${date}`,
            date,
            clockIn: '',
            clockOut: '',
            totalHours: 0,
            status: 'leave',
            notes: reason,
          });
        }
        
        return {
          records: [...newRecords, ...state.records],
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: 'Failed to request leave', isLoading: false });
    }
  },
}));
