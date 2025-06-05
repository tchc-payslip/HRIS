import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
  address: string;
};

export type Employee = Omit<Tables<"employee_information">, "emergency_contact"> & {
  id: string;
  employmentType?: string;
  profile_image?: string;
  emergency_contact?: EmergencyContact;
  firstName?: string;
  lastName?: string;
  position?: string;
  hireDate?: string;
  address?: string;
  bio?: string;
  customFields?: Record<string, any>;
};

export const fetchCurrentEmployee = async (): Promise<Employee> => {
  try {
    // Get the current user's ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');

    // For development, use the test email
    const testEmail = 'tchc.payslip@gmail.com';

    // Fetch employee information
    const { data, error } = await supabase
      .from('employee_information')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Employee not found');

    // Map the data to include computed fields and placeholder values
    const employee: Employee = {
      ...data,
      firstName: data.employee_name?.split(' ')[0] || '',
      lastName: data.employee_name?.split(' ').slice(1).join(' ') || '',
      position: data.title || '',
      hireDate: data.contract_start_date_cv || '',
      address: data.permanent_address || '',
      bio: `${data.title || ''} at ${data.department || ''}`,
      profile_image: data.photo_url || '',
      // Use placeholder emergency contact data
      emergency_contact: {
        name: data.employee_name || 'Emergency Contact',
        relationship: 'Family',
        phone: data.phone_number || 'No phone number',
        address: data.permanent_address || 'No address'
      }
    };

    return employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const { data, error } = await supabase
      .from('employee_information')
      .select('*')
      .order('employee_name');

    if (error) throw error;
    
    // Map the data to include computed fields and placeholder values
    const employees: Employee[] = data.map(emp => ({
      ...emp,
      firstName: emp.employee_name?.split(' ')[0] || '',
      lastName: emp.employee_name?.split(' ').slice(1).join(' ') || '',
      position: emp.title || '',
      hireDate: emp.contract_start_date_cv || '',
      address: emp.permanent_address || '',
      bio: `${emp.title || ''} at ${emp.department || ''}`,
      profile_image: emp.photo_url || '',
      // Use placeholder emergency contact data
      emergency_contact: {
        name: emp.employee_name || 'Emergency Contact',
        relationship: 'Family',
        phone: emp.phone_number || 'No phone number',
        address: emp.permanent_address || 'No address'
      }
    }));

    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};
