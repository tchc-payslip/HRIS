import { create } from 'zustand';
import { Employee, fetchCurrentEmployee } from '@/services/employeeService';

interface EmployeeState {
  employee: Employee | null;
  isLoading: boolean;
  error: string | null;
  setEmployee: (employee: Employee) => void;
  fetchEmployee: () => Promise<void>;
  updateEmployee: (data: Partial<Employee>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
}

const mapEmployeeData = (data: Employee) => ({
  ...data,
  firstName: data.employee_name.split(' ')[0],
  lastName: data.employee_name.split(' ').slice(1).join(' '),
  position: data.title,
  hireDate: data.contract_start_date_cv,
  phone: data.phone_number,
  dob: data.date_of_birth_cv,
  bio: `${data.title} at ${data.department}`,
  employmentType: data.contract_type,
});

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  isLoading: false,
  error: null,
  
  setEmployee: (employee) => set({ employee }),
  
  fetchEmployee: async () => {
    try {
      set({ isLoading: true, error: null });
      const employeeData = await fetchCurrentEmployee();
      const employee = mapEmployeeData(employeeData);
      set({ employee, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch employee data', 
        isLoading: false 
      });
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
