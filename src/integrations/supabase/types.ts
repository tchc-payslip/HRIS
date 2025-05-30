export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      employee_documents: {
        Row: {
          document_type: Database["public"]["Enums"]["document_type"]
          employee_id: number
          id: number
          status: Database["public"]["Enums"]["document_status"]
          supabase_storage_path: string
          tenant_id: number
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          document_type: Database["public"]["Enums"]["document_type"]
          employee_id: number
          id?: number
          status?: Database["public"]["Enums"]["document_status"]
          supabase_storage_path: string
          tenant_id: number
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          document_type?: Database["public"]["Enums"]["document_type"]
          employee_id?: number
          id?: number
          status?: Database["public"]["Enums"]["document_status"]
          supabase_storage_path?: string
          tenant_id?: number
          updated_at?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      employee_information: {
        Row: {
          auth_id: string | null
          bank: string | null
          bank_account: string | null
          bank_branch: string | null
          birth_place: string | null
          contract_end_date: string | null
          contract_end_date_cv: string | null
          contract_start_date: string | null
          contract_start_date_cv: string | null
          contract_type: string | null
          created_at: string | null
          date_of_birth: string | null
          date_of_birth_cv: string | null
          department: string | null
          duty: string | null
          education_institution: string | null
          email: string | null
          employee_id: number | null
          employee_name: string | null
          ethnic_group: string | null
          gender: string | null
          graduation_year: number | null
          highest_education: string | null
          id: string
          id_issue_date: string | null
          id_issue_date_cv: string | null
          id_issue_place: string | null
          major: string | null
          marital_status: string | null
          national_id: string | null
          nationality: string | null
          permanent_address: string | null
          phone_number: string | null
          photo_url: string | null
          pit_number: string | null
          seniority_date: string | null
          seniority_date_cv: string | null
          social_insurance_number: string | null
          sub_department: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          bank?: string | null
          bank_account?: string | null
          bank_branch?: string | null
          birth_place?: string | null
          contract_end_date?: string | null
          contract_end_date_cv?: string | null
          contract_start_date?: string | null
          contract_start_date_cv?: string | null
          contract_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          date_of_birth_cv?: string | null
          department?: string | null
          duty?: string | null
          education_institution?: string | null
          email?: string | null
          employee_id?: number | null
          employee_name?: string | null
          ethnic_group?: string | null
          gender?: string | null
          graduation_year?: number | null
          highest_education?: string | null
          id?: string
          id_issue_date?: string | null
          id_issue_date_cv?: string | null
          id_issue_place?: string | null
          major?: string | null
          marital_status?: string | null
          national_id?: string | null
          nationality?: string | null
          permanent_address?: string | null
          phone_number?: string | null
          photo_url?: string | null
          pit_number?: string | null
          seniority_date?: string | null
          seniority_date_cv?: string | null
          social_insurance_number?: string | null
          sub_department?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          bank?: string | null
          bank_account?: string | null
          bank_branch?: string | null
          birth_place?: string | null
          contract_end_date?: string | null
          contract_end_date_cv?: string | null
          contract_start_date?: string | null
          contract_start_date_cv?: string | null
          contract_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          date_of_birth_cv?: string | null
          department?: string | null
          duty?: string | null
          education_institution?: string | null
          email?: string | null
          employee_id?: number | null
          employee_name?: string | null
          ethnic_group?: string | null
          gender?: string | null
          graduation_year?: number | null
          highest_education?: string | null
          id?: string
          id_issue_date?: string | null
          id_issue_date_cv?: string | null
          id_issue_place?: string | null
          major?: string | null
          marital_status?: string | null
          national_id?: string | null
          nationality?: string | null
          permanent_address?: string | null
          phone_number?: string | null
          photo_url?: string | null
          pit_number?: string | null
          seniority_date?: string | null
          seniority_date_cv?: string | null
          social_insurance_number?: string | null
          sub_department?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      raw_attendance: {
        Row: {
          device_sn: string
          employee_id: number | null
          timestamp: string
        }
        Insert: {
          device_sn: string
          employee_id?: number | null
          timestamp: string
        }
        Update: {
          device_sn?: string
          employee_id?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_information"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: number
          name: string
          subscription_plan: Json
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          subscription_plan?: Json
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          subscription_plan?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_status: "Active" | "Inactive"
      document_type: "CV" | "Academic Certificate" | "Personal Documents"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_status: ["Active", "Inactive"],
      document_type: ["CV", "Academic Certificate", "Personal Documents"],
    },
  },
} as const
