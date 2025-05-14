
import { create } from 'zustand';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  phone: string;
  address: string;
  bio: string;
  profileImage: string;
  // New fields
  dob?: string;
  emergencyContact?: string;
  employmentType?: string;
  skills?: string[];
  qualifications?: string[];
  certifications?: string[];
  customFields?: Record<string, string>;
}

interface EmployeeState {
  employee: Employee | null;
  isLoading: boolean;
  error: string | null;
  setEmployee: (employee: Employee) => void;
  fetchEmployee: () => Promise<void>;
  updateEmployee: (data: Partial<Employee>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  isLoading: false,
  error: null,
  
  setEmployee: (employee) => set({ employee }),
  
  fetchEmployee: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      const mockEmployee = {
        id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@company.com',
        position: 'HR Manager',
        department: 'Human Resources',
        hireDate: '2020-06-15',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, ST 12345',
        bio: 'Experienced HR professional with 10+ years in talent management and employee relations.',
        profileImage: '/placeholder.svg',
        dob: '1985-03-12',
        employmentType: 'Full Time',
        emergencyContact: 'John Doe, Spouse, (555) 987-6543',
        skills: ['Employee Relations', 'Talent Acquisition', 'Performance Management', 'Training & Development'],
        qualifications: ['SHRM-CP Certification', 'MBA Human Resources'],
        certifications: ['SHRM Certified Professional', 'Diversity & Inclusion Certificate'],
        customFields: {
          'Preferred Name': 'Jane',
          'Pronouns': 'She/Her',
          'Remote Status': 'Hybrid',
        }
      };
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set({ employee: mockEmployee, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch employee data', isLoading: false });
    }
  },
  
  updateEmployee: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        employee: state.employee ? { ...state.employee, ...data } : null,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update employee data', isLoading: false });
    }
  },
  
  uploadProfileImage: async (file) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be replaced with actual Cloudinary upload logic
      // when connected to backend
      const fileReader = new FileReader();
      
      await new Promise<void>((resolve, reject) => {
        fileReader.onload = () => {
          if (typeof fileReader.result === 'string') {
            // Here we would upload to Cloudinary, but for now we'll just use the file
            set((state) => ({
              employee: state.employee 
                ? { ...state.employee, profileImage: fileReader.result as string } 
                : null,
            }));
            resolve();
          } else {
            reject(new Error('Failed to read image file'));
          }
        };
        fileReader.onerror = () => reject(fileReader.error);
        fileReader.readAsDataURL(file);
      });
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to upload profile image', isLoading: false });
    }
  }
}));
