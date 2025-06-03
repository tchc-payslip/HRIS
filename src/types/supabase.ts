export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employee_documents: {
        Row: {
          document_type: "CV" | "Academic Certificate" | "Personal Documents"
          employee_id: number
          id: number
          status: "Active" | "Inactive"
          supabase_storage_path: string
          tenant_id: number
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          document_type: "CV" | "Academic Certificate" | "Personal Documents"
          employee_id: number
          id?: number
          status?: "Active" | "Inactive"
          supabase_storage_path: string
          tenant_id: number
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          document_type?: "CV" | "Academic Certificate" | "Personal Documents"
          employee_id?: number
          id?: number
          status?: "Active" | "Inactive"
          supabase_storage_path?: string
          tenant_id?: number
          updated_at?: string
          uploaded_at?: string
        }
      }
      employee_information: {
        Row: {
          id: string
          employee_id: number
          employee_name: string
          department: string
          tenant_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: number
          employee_name: string
          department: string
          tenant_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: number
          employee_name?: string
          department?: string
          tenant_id?: number
          created_at?: string
          updated_at?: string
        }
      }
      raw_attendance: {
        Row: {
          device_sn: string
          employee_id: number
          timestamp: string
          created_at: string
          updated_at: string
        }
        Insert: {
          device_sn: string
          employee_id: number
          timestamp: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          device_sn?: string
          employee_id?: number
          timestamp?: string
          created_at?: string
          updated_at?: string
        }
      }
      shift_plan: {
        Row: {
          tenant_id: number
          employee_id: number
          month: string
          shifts: Record<string, string>
          created_at: string
          updated_at: string
        }
        Insert: {
          tenant_id: number
          employee_id: number
          month: string
          shifts: Record<string, string>
          created_at?: string
          updated_at?: string
        }
        Update: {
          tenant_id?: number
          employee_id?: number
          month?: string
          shifts?: Record<string, string>
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          created_at: string
          id: number
          name: string
          subscription_plan: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          subscription_plan?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          subscription_plan?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 