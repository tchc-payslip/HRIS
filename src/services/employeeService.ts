
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Employee = Tables<"employee_information"> & {
  id: string;
  employmentType?: string;
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from("employee_information")
    .select("*");

  if (error) {
    console.error("Error fetching employees:", error);
    throw new Error(error.message);
  }

  // Transform the data to match our expected Employee type
  return data.map(employee => ({
    ...employee,
    // Map database fields to our expected format
    // For demo purposes, we'll add some mock data for fields not in the database
    employmentType: Math.random() > 0.5 ? "Full Time" : "Part Time"
  }));
};
