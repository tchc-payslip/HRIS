
import { create } from 'zustand';

interface BudgetItem {
  id: string;
  category: string;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  fiscalYear: string;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface BudgetState {
  budgetItems: BudgetItem[];
  expenses: Expense[];
  fiscalYear: string;
  totalBudget: number;
  totalSpent: number;
  isLoading: boolean;
  error: string | null;
  fetchBudgetData: (year: string) => Promise<void>;
  submitExpense: (expense: Omit<Expense, 'id' | 'status'>) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgetItems: [],
  expenses: [],
  fiscalYear: new Date().getFullYear().toString(),
  totalBudget: 0,
  totalSpent: 0,
  isLoading: false,
  error: null,
  
  fetchBudgetData: async (year) => {
    set({ isLoading: true, error: null, fiscalYear: year });
    
    try {
      // This would be a real API call in a production app
      const mockBudgetItems = [
        {
          id: '1',
          category: 'Training',
          name: 'Professional Development',
          amount: 50000,
          spent: 28500,
          remaining: 21500,
          fiscalYear: year,
        },
        {
          id: '2',
          category: 'Equipment',
          name: 'Office Equipment',
          amount: 75000,
          spent: 42000,
          remaining: 33000,
          fiscalYear: year,
        },
        {
          id: '3',
          category: 'Travel',
          name: 'Business Travel',
          amount: 45000,
          spent: 31200,
          remaining: 13800,
          fiscalYear: year,
        },
        {
          id: '4',
          category: 'Software',
          name: 'Software Licenses',
          amount: 60000,
          spent: 48500,
          remaining: 11500,
          fiscalYear: year,
        },
      ];
      
      const mockExpenses = Array.from({ length: 15 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        
        const categories = ['Training', 'Equipment', 'Travel', 'Software'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        const descriptions = [
          'Team workshop',
          'New laptops',
          'Conference attendance',
          'Software subscription',
          'Client meeting travel',
        ];
        
        const status = Math.random() > 0.7 ? 'pending' : (Math.random() > 0.5 ? 'approved' : 'rejected');
        
        return {
          id: `expense-${i}`,
          date: date.toISOString().split('T')[0],
          category,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          amount: Math.floor(Math.random() * 5000) + 500,
          status,
        };
      });
      
      const totalBudget = mockBudgetItems.reduce((sum, item) => sum + item.amount, 0);
      const totalSpent = mockBudgetItems.reduce((sum, item) => sum + item.spent, 0);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      set({
        budgetItems: mockBudgetItems,
        expenses: mockExpenses,
        totalBudget,
        totalSpent,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch budget data', isLoading: false });
    }
  },
  
  submitExpense: async (expense) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newExpense = {
        ...expense,
        id: `expense-${Date.now()}`,
        status: 'pending',
      };
      
      set((state) => ({
        expenses: [newExpense, ...state.expenses],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to submit expense', isLoading: false });
    }
  },
}));
