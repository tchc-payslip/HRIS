
import { create } from 'zustand';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: ExpenseStatus;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

interface BudgetState {
  totalBudget: number;
  totalSpent: number;
  categories: BudgetCategory[];
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchBudget: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'status'>) => Promise<void>;
  updateExpenseStatus: (id: string, status: ExpenseStatus) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  totalBudget: 0,
  totalSpent: 0,
  categories: [],
  expenses: [],
  isLoading: false,
  error: null,
  
  fetchBudget: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      const mockCategories: BudgetCategory[] = [
        { id: '1', name: 'Equipment', allocated: 25000, spent: 18500 },
        { id: '2', name: 'Training', allocated: 15000, spent: 8200 },
        { id: '3', name: 'Office Supplies', allocated: 5000, spent: 3700 },
        { id: '4', name: 'Software Subscriptions', allocated: 12000, spent: 10800 },
        { id: '5', name: 'Travel', allocated: 8000, spent: 2100 },
      ];
      
      const totalBudget = mockCategories.reduce((sum, category) => sum + category.allocated, 0);
      const totalSpent = mockCategories.reduce((sum, category) => sum + category.spent, 0);
      
      const mockExpenses: Expense[] = [
        {
          id: '1',
          date: '2023-04-15',
          category: 'Equipment',
          description: 'New monitors for design team',
          amount: 3500,
          status: 'approved',
        },
        {
          id: '2',
          date: '2023-04-20',
          category: 'Training',
          description: 'React conference tickets',
          amount: 2200,
          status: 'approved',
        },
        {
          id: '3',
          date: '2023-04-25',
          category: 'Software Subscriptions',
          description: 'Adobe Creative Cloud annual',
          amount: 4800,
          status: 'approved',
        },
        {
          id: '4',
          date: '2023-05-02',
          category: 'Equipment',
          description: 'Ergonomic office chairs',
          amount: 2800,
          status: 'pending',
        },
        {
          id: '5',
          date: '2023-05-10',
          category: 'Travel',
          description: 'Client meeting in Boston',
          amount: 1200,
          status: 'pending',
        },
        {
          id: '6',
          date: '2023-05-15',
          category: 'Office Supplies',
          description: 'Quarterly office supplies',
          amount: 950,
          status: 'rejected',
        },
      ];
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set({
        totalBudget,
        totalSpent,
        categories: mockCategories,
        expenses: mockExpenses,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch budget data', isLoading: false });
    }
  },
  
  addExpense: async (expense) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newExpense: Expense = {
        ...expense,
        id: Math.random().toString(36).substring(2, 11),
        status: 'pending',
      };
      
      set((state) => {
        // Find the category of this expense
        const categoryIndex = state.categories.findIndex(
          (cat) => cat.name === expense.category
        );
        
        if (categoryIndex >= 0) {
          // Update the spent amount for this category
          const updatedCategories = [...state.categories];
          updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            spent: updatedCategories[categoryIndex].spent + expense.amount,
          };
          
          const updatedTotalSpent = state.totalSpent + expense.amount;
          
          return {
            expenses: [...state.expenses, newExpense],
            categories: updatedCategories,
            totalSpent: updatedTotalSpent,
            isLoading: false,
          };
        }
        
        return {
          expenses: [...state.expenses, newExpense],
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: 'Failed to add expense', isLoading: false });
    }
  },
  
  updateExpenseStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => {
        const updatedExpenses = state.expenses.map((expense) =>
          expense.id === id ? { ...expense, status } : expense
        );
        
        return {
          expenses: updatedExpenses,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: 'Failed to update expense status', isLoading: false });
    }
  },
}));
