
import { create } from 'zustand';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  description?: string;
}

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  setBudgets: (budgets: Budget[]) => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,
  error: null,

  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock data - replace with actual API call
      const mockBudgets: Budget[] = [
        {
          id: '1',
          name: 'HR Training Budget',
          amount: 50000,
          spent: 15000,
          category: 'Training',
          period: 'yearly',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          description: 'Annual training budget for HR department'
        },
        {
          id: '2',
          name: 'Office Supplies',
          amount: 5000,
          spent: 2300,
          category: 'Operations',
          period: 'monthly',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          description: 'Monthly office supplies budget'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ budgets: mockBudgets, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch budgets', isLoading: false });
    }
  },

  addBudget: async (budgetData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newBudget: Budget = {
        ...budgetData,
        id: Date.now().toString(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        budgets: [...state.budgets, newBudget],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add budget', isLoading: false });
    }
  },

  updateBudget: async (id, budgetData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        budgets: state.budgets.map(budget =>
          budget.id === id ? { ...budget, ...budgetData } : budget
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update budget', isLoading: false });
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        budgets: state.budgets.filter(budget => budget.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete budget', isLoading: false });
    }
  },

  setBudgets: (budgets) => {
    set({ budgets });
  },
}));
