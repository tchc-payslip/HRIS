
import { create } from 'zustand';

interface Shift {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'regular' | 'overtime' | 'vacation' | 'sick';
  notes: string;
}

interface ShiftsState {
  shifts: Shift[];
  currentView: 'month' | 'week' | 'day';
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
  fetchShifts: (start: string, end: string) => Promise<void>;
  addShift: (shift: Omit<Shift, 'id'>) => Promise<void>;
  updateShift: (id: string, shift: Partial<Omit<Shift, 'id'>>) => Promise<void>;
  deleteShift: (id: string) => Promise<void>;
  setCurrentView: (view: 'month' | 'week' | 'day') => void;
  setSelectedDate: (date: string) => void;
}

export const useShiftsStore = create<ShiftsState>((set) => ({
  shifts: [],
  currentView: 'month',
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  error: null,
  
  fetchShifts: async (start, end) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      const mockShifts: Shift[] = [];
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      const shiftTypes = ['regular', 'overtime', 'vacation', 'sick'] as const;
      
      // Generate some mock shifts
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Skip some days randomly
        if (Math.random() > 0.7) continue;
        
        const shiftDate = d.toISOString().split('T')[0];
        
        // Regular shift
        if (Math.random() > 0.2) {
          mockShifts.push({
            id: `shift-${mockShifts.length}`,
            title: 'Regular Shift',
            start: `${shiftDate}T09:00:00`,
            end: `${shiftDate}T17:00:00`,
            type: 'regular',
            notes: '',
          });
        }
        
        // Sometimes add an overtime shift
        if (Math.random() > 0.8) {
          mockShifts.push({
            id: `shift-${mockShifts.length}`,
            title: 'Overtime',
            start: `${shiftDate}T17:00:00`,
            end: `${shiftDate}T19:00:00`,
            type: 'overtime',
            notes: 'Project deadline',
          });
        }
        
        // Sometimes add vacation or sick time
        if (Math.random() > 0.9) {
          const type = Math.random() > 0.5 ? 'vacation' : 'sick';
          mockShifts.push({
            id: `shift-${mockShifts.length}`,
            title: type === 'vacation' ? 'Vacation' : 'Sick Leave',
            start: `${shiftDate}T09:00:00`,
            end: `${shiftDate}T17:00:00`,
            type,
            notes: type === 'vacation' ? 'Annual leave' : 'Not feeling well',
          });
        }
      }
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 700));
      
      set({ shifts: mockShifts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch shifts', isLoading: false });
    }
  },
  
  addShift: async (shift) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newShift = {
        ...shift,
        id: `shift-${Date.now()}`,
      };
      
      set((state) => ({
        shifts: [...state.shifts, newShift],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add shift', isLoading: false });
    }
  },
  
  updateShift: async (id, shiftUpdate) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        shifts: state.shifts.map((shift) =>
          shift.id === id ? { ...shift, ...shiftUpdate } : shift
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update shift', isLoading: false });
    }
  },
  
  deleteShift: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        shifts: state.shifts.filter((shift) => shift.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete shift', isLoading: false });
    }
  },
  
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
