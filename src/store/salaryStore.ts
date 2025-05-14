
import { create } from 'zustand';

interface PaySlip {
  id: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  taxes: number;
  deductions: number;
  bonuses: number;
  payDate: string;
}

interface SalaryState {
  currentSalary: number;
  payHistory: PaySlip[];
  isLoading: boolean;
  error: string | null;
  fetchSalaryData: () => Promise<void>;
  downloadPaySlip: (id: string) => Promise<void>;
}

export const useSalaryStore = create<SalaryState>((set) => ({
  currentSalary: 0,
  payHistory: [],
  isLoading: false,
  error: null,
  
  fetchSalaryData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      const mockCurrentSalary = 85000;
      
      const mockPayHistory = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const grossSalary = mockCurrentSalary / 12;
        const taxes = grossSalary * 0.25;
        const deductions = grossSalary * 0.05;
        const bonuses = i % 3 === 0 ? grossSalary * 0.1 : 0;
        const netSalary = grossSalary - taxes - deductions + bonuses;
        
        return {
          id: `payslip-${i}`,
          period: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
          grossSalary,
          netSalary,
          taxes,
          deductions,
          bonuses,
          payDate: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-15`,
        };
      });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 700));
      
      set({
        currentSalary: mockCurrentSalary,
        payHistory: mockPayHistory,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch salary data', isLoading: false });
    }
  },
  
  downloadPaySlip: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log(`Downloading payslip with ID: ${id}`);
      
      // In a real app, this would trigger a file download
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to download pay slip', isLoading: false });
    }
  },
}));
