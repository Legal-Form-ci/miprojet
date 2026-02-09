export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          message: string | null
          project_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          project_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      backup_settings: {
        Row: {
          external_storage_config: Json | null
          external_storage_type: string | null
          frequency: string | null
          id: string
          is_enabled: boolean | null
          last_backup_at: string | null
          next_backup_at: string | null
          retention_days: number | null
          tables_to_backup: string[] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          external_storage_config?: Json | null
          external_storage_type?: string | null
          frequency?: string | null
          id?: string
          is_enabled?: boolean | null
          last_backup_at?: string | null
          next_backup_at?: string | null
          retention_days?: number | null
          tables_to_backup?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          external_storage_config?: Json | null
          external_storage_type?: string | null
          frequency?: string | null
          id?: string
          is_enabled?: boolean | null
          last_backup_at?: string | null
          next_backup_at?: string | null
          retention_days?: number | null
          tables_to_backup?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_ar: string | null
          name_en: string | null
          parent_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar?: string | null
          name_en?: string | null
          parent_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string | null
          name_en?: string | null
          parent_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          amount: number
          created_at: string
          id: string
          project_id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          project_id: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          project_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      database_backups: {
        Row: {
          backup_name: string
          backup_type: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          format: string | null
          id: string
          status: string | null
          tables_included: string[] | null
        }
        Insert: {
          backup_name: string
          backup_type?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          format?: string | null
          id?: string
          status?: string | null
          tables_included?: string[] | null
        }
        Update: {
          backup_name?: string
          backup_type?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          format?: string | null
          id?: string
          status?: string | null
          tables_included?: string[] | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      form_progress: {
        Row: {
          created_at: string
          current_step: number | null
          data: Json | null
          form_type: string
          id: string
          is_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_step?: number | null
          data?: Json | null
          form_type: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_step?: number | null
          data?: Json | null
          form_type?: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          items: Json
          notes: string | null
          paid_at: string | null
          project_id: string | null
          service_request_id: string | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          items?: Json
          notes?: string | null
          paid_at?: string | null
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          items?: Json
          notes?: string | null
          paid_at?: string | null
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          archived_at: string | null
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          published_at: string | null
          status: string | null
          title: string
          updated_at: string
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          archived_at?: string | null
          author_id: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          archived_at?: string | null
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          author_id: string
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          content: string
          created_at: string
          currency: string | null
          deadline: string | null
          description: string | null
          eligibility: string | null
          external_link: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          opportunity_type: string
          published_at: string | null
          status: string | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          author_id: string
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          content: string
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          opportunity_type: string
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          author_id?: string
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          content?: string
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          opportunity_type?: string
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          access_count: number | null
          amount: number
          created_at: string
          currency: string | null
          encrypted_metadata: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          payment_method: string
          payment_reference: string | null
          project_id: string | null
          service_request_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_count?: number | null
          amount: number
          created_at?: string
          currency?: string | null
          encrypted_metadata?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          payment_method: string
          payment_reference?: string | null
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_count?: number | null
          amount?: number
          created_at?: string
          currency?: string | null
          encrypted_metadata?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          payment_method?: string
          payment_reference?: string | null
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          category: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          total_commissions: number | null
          total_referrals: number | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          total_commissions?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          total_commissions?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      project_evaluations: {
        Row: {
          actions_structuration: Json | null
          certified_at: string | null
          certified_by: string | null
          created_at: string
          evaluated_by: string | null
          evaluation_data: Json | null
          faiblesses: Json | null
          forces: Json | null
          id: string
          is_active: boolean | null
          is_certified: boolean | null
          messages_strategiques: Json | null
          niveau: string | null
          project_id: string
          recommandations: Json | null
          resume: string | null
          score_equipe: number | null
          score_financier: number | null
          score_global: number | null
          score_impact: number | null
          score_maturite: number | null
          score_porteur: number | null
          score_projet: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actions_structuration?: Json | null
          certified_at?: string | null
          certified_by?: string | null
          created_at?: string
          evaluated_by?: string | null
          evaluation_data?: Json | null
          faiblesses?: Json | null
          forces?: Json | null
          id?: string
          is_active?: boolean | null
          is_certified?: boolean | null
          messages_strategiques?: Json | null
          niveau?: string | null
          project_id: string
          recommandations?: Json | null
          resume?: string | null
          score_equipe?: number | null
          score_financier?: number | null
          score_global?: number | null
          score_impact?: number | null
          score_maturite?: number | null
          score_porteur?: number | null
          score_projet?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actions_structuration?: Json | null
          certified_at?: string | null
          certified_by?: string | null
          created_at?: string
          evaluated_by?: string | null
          evaluation_data?: Json | null
          faiblesses?: Json | null
          forces?: Json | null
          id?: string
          is_active?: boolean | null
          is_certified?: boolean | null
          messages_strategiques?: Json | null
          niveau?: string | null
          project_id?: string
          recommandations?: Json | null
          resume?: string | null
          score_equipe?: number | null
          score_financier?: number | null
          score_global?: number | null
          score_impact?: number | null
          score_maturite?: number | null
          score_porteur?: number | null
          score_projet?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_evaluations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          content: string | null
          created_at: string
          id: string
          project_id: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          project_id: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          end_date: string | null
          fonds_disponibles: string | null
          funding_goal: number | null
          funds_raised: number
          id: string
          image_url: string | null
          owner_id: string
          risk_score: string | null
          sector: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          fonds_disponibles?: string | null
          funding_goal?: number | null
          funds_raised?: number
          id?: string
          image_url?: string | null
          owner_id: string
          risk_score?: string | null
          sector?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          fonds_disponibles?: string | null
          funding_goal?: number | null
          funds_raised?: number
          id?: string
          image_url?: string | null
          owner_id?: string
          risk_score?: string | null
          sector?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_amount: number | null
          commission_rate: number | null
          completed_at: string | null
          created_at: string
          id: string
          paid_at: string | null
          payment_id: string | null
          referee_id: string | null
          referral_code: string
          referral_link: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          referee_id?: string | null
          referral_code: string
          referral_link: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          referee_id?: string | null
          referral_code?: string
          referral_link?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_ar: string | null
          name_en: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar?: string | null
          name_en?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string | null
          name_en?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          annual_revenue: number | null
          audit_trail: Json | null
          company_name: string | null
          company_type: string | null
          created_at: string
          description: string | null
          documents: Json | null
          financial_data_encrypted: boolean | null
          funding_needed: number | null
          has_business_plan: boolean | null
          has_financial_statements: boolean | null
          id: string
          project_stage: string | null
          sector: string | null
          service_type: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_revenue?: number | null
          audit_trail?: Json | null
          company_name?: string | null
          company_type?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          financial_data_encrypted?: boolean | null
          funding_needed?: number | null
          has_business_plan?: boolean | null
          has_financial_statements?: boolean | null
          id?: string
          project_stage?: string | null
          sector?: string | null
          service_type: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_revenue?: number | null
          audit_trail?: Json | null
          company_name?: string | null
          company_type?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          financial_data_encrypted?: boolean | null
          funding_needed?: number | null
          has_business_plan?: boolean | null
          has_financial_statements?: boolean | null
          id?: string
          project_stage?: string | null
          sector?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          duration_days: number
          duration_type: string
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days: number
          duration_type: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days?: number
          duration_type?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          expires_at: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_reference: string | null
          plan_id: string | null
          started_at: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments_secure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      payment_history: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string | null
          payment_method: string | null
          payment_reference: string | null
          project_title: string | null
          service_type: string | null
          status: string | null
          user_id: string | null
        }
        Relationships: []
      }
      payments_secure: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string | null
          payment_method: string | null
          payment_reference_masked: string | null
          project_id: string | null
          service_request_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          payment_method?: string | null
          payment_reference_masked?: never
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          payment_method?: string | null
          payment_reference_masked?: never
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_invoice_number: { Args: never; Returns: string }
      generate_referral_code: { Args: { user_id: string }; Returns: string }
      has_active_subscription: { Args: { user_uuid: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
