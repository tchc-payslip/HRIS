
import { create } from 'zustand';

interface Request {
  id: string;
  type: 'leave' | 'equipment' | 'certificate' | 'training' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface SelfServiceState {
  requests: Request[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchRequests: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  submitRequest: (request: Omit<Request, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  cancelRequest: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

export const useSelfServiceStore = create<SelfServiceState>((set) => ({
  requests: [],
  notifications: [],
  isLoading: false,
  error: null,
  
  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      const mockRequests = Array.from({ length: 5 }, (_, i) => {
        const types = ['leave', 'equipment', 'certificate', 'training', 'other'] as const;
        const statuses = ['pending', 'approved', 'rejected'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        
        const titles = {
          leave: ['Vacation Request', 'Sick Leave', 'Personal Day'],
          equipment: ['New Laptop Request', 'Monitor Request', 'Keyboard and Mouse'],
          certificate: ['Certificate of Employment', 'Income Certificate', 'Work Experience Certificate'],
          training: ['React Training', 'Leadership Workshop', 'Communication Skills'],
          other: ['Parking Permit', 'Office Relocation', 'Flexible Hours'],
        };
        
        const title = titles[type][Math.floor(Math.random() * titles[type].length)];
        
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
        
        const updatedDate = new Date(createdDate);
        updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 5) + 1);
        
        return {
          id: `request-${i}`,
          type,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          title,
          description: `This is a sample ${type} request for demonstration purposes.`,
          createdAt: createdDate.toISOString(),
          updatedAt: updatedDate.toISOString(),
        };
      });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      set({ requests: mockRequests, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch requests', isLoading: false });
    }
  },
  
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      const mockNotifications = Array.from({ length: 8 }, (_, i) => {
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 14));
        
        const titles = [
          'Leave Request Approved',
          'New Company Policy',
          'Upcoming Team Meeting',
          'Payslip Available',
          'Benefits Enrollment Period',
          'Training Opportunity',
          'Office Closure Notice',
          'Performance Review Scheduled',
        ];
        
        return {
          id: `notification-${i}`,
          title: titles[i % titles.length],
          message: `This is a sample notification about ${titles[i % titles.length].toLowerCase()}.`,
          read: Math.random() > 0.6,
          createdAt: createdDate.toISOString(),
        };
      });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set({ notifications: mockNotifications, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch notifications', isLoading: false });
    }
  },
  
  submitRequest: async (request) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const now = new Date().toISOString();
      
      const newRequest: Request = {
        ...request,
        id: `request-${Date.now()}`,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        requests: [newRequest, ...state.requests],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to submit request', isLoading: false });
    }
  },
  
  cancelRequest: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        requests: state.requests.filter((request) => request.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel request', isLoading: false });
    }
  },
  
  markNotificationAsRead: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to mark notification as read', isLoading: false });
    }
  },
}));
