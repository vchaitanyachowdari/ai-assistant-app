export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          timezone: string | null
          language: string | null
          subscription_tier: "free" | "pro" | "business" | null
          subscription_expires_at: string | null
          last_active_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          timezone?: string | null
          language?: string | null
          subscription_tier?: "free" | "pro" | "business" | null
          subscription_expires_at?: string | null
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          timezone?: string | null
          language?: string | null
          subscription_tier?: "free" | "pro" | "business" | null
          subscription_expires_at?: string | null
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: "light" | "dark" | "system"
          notifications_enabled: boolean
          push_enabled: boolean
          whatsapp_enabled: boolean
          email_summaries: boolean
          smart_reminders: boolean
          quiet_hours_start: string | null
          quiet_hours_end: string | null
          ai_provider: "openrouter" | "gemini"
          ai_model: string
          ai_response_style: "professional" | "casual" | "concise" | "detailed"
          proactive_mode: boolean
          voice_enabled: boolean
          data_retention_days: number
          auto_archive_completed_tasks: boolean
          task_reminder_minutes: number
          meeting_reminder_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: "light" | "dark" | "system"
          notifications_enabled?: boolean
          push_enabled?: boolean
          whatsapp_enabled?: boolean
          email_summaries?: boolean
          smart_reminders?: boolean
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          ai_provider?: "openrouter" | "gemini"
          ai_model?: string
          ai_response_style?: "professional" | "casual" | "concise" | "detailed"
          proactive_mode?: boolean
          voice_enabled?: boolean
          data_retention_days?: number
          auto_archive_completed_tasks?: boolean
          task_reminder_minutes?: number
          meeting_reminder_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: "light" | "dark" | "system"
          notifications_enabled?: boolean
          push_enabled?: boolean
          whatsapp_enabled?: boolean
          email_summaries?: boolean
          smart_reminders?: boolean
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          ai_provider?: "openrouter" | "gemini"
          ai_model?: string
          ai_response_style?: "professional" | "casual" | "concise" | "detailed"
          proactive_mode?: boolean
          voice_enabled?: boolean
          data_retention_days?: number
          auto_archive_completed_tasks?: boolean
          task_reminder_minutes?: number
          meeting_reminder_minutes?: number
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          type: "google" | "slack" | "github" | "discord"
          name: string
          connected: boolean
          access_token: string | null
          refresh_token: string | null
          expires_at: string | null
          last_sync: string | null
          sync_status: "active" | "error" | "syncing"
          sync_frequency_minutes: number
          permissions: Json | null
          settings: Json | null
          error_count: number
          last_error: string | null
          webhook_url: string | null
          webhook_secret: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "google" | "slack" | "github" | "discord"
          name: string
          connected?: boolean
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          last_sync?: string | null
          sync_status?: "active" | "error" | "syncing"
          sync_frequency_minutes?: number
          permissions?: Json | null
          settings?: Json | null
          error_count?: number
          last_error?: string | null
          webhook_url?: string | null
          webhook_secret?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "google" | "slack" | "github" | "discord"
          name?: string
          connected?: boolean
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          last_sync?: string | null
          sync_status?: "active" | "error" | "syncing"
          sync_frequency_minutes?: number
          permissions?: Json | null
          settings?: Json | null
          error_count?: number
          last_error?: string | null
          webhook_url?: string | null
          webhook_secret?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: "ai-suggested" | "user-created" | "completed"
          priority: "high" | "medium" | "low"
          status: "pending" | "in-progress" | "completed" | "cancelled"
          source: string | null
          source_id: string | null
          estimated_time_minutes: number | null
          actual_time_minutes: number | null
          due_date: string | null
          reminder_at: string | null
          completed_at: string | null
          archived_at: string | null
          ai_generated: boolean
          ai_confidence: number | null
          tags: Json | null
          metadata: Json | null
          parent_task_id: string | null
          recurring_pattern: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type?: "ai-suggested" | "user-created" | "completed"
          priority?: "high" | "medium" | "low"
          status?: "pending" | "in-progress" | "completed" | "cancelled"
          source?: string | null
          source_id?: string | null
          estimated_time_minutes?: number | null
          actual_time_minutes?: number | null
          due_date?: string | null
          reminder_at?: string | null
          completed_at?: string | null
          archived_at?: string | null
          ai_generated?: boolean
          ai_confidence?: number | null
          tags?: Json | null
          metadata?: Json | null
          parent_task_id?: string | null
          recurring_pattern?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: "ai-suggested" | "user-created" | "completed"
          priority?: "high" | "medium" | "low"
          status?: "pending" | "in-progress" | "completed" | "cancelled"
          source?: string | null
          source_id?: string | null
          estimated_time_minutes?: number | null
          actual_time_minutes?: number | null
          due_date?: string | null
          reminder_at?: string | null
          completed_at?: string | null
          archived_at?: string | null
          ai_generated?: boolean
          ai_confidence?: number | null
          tags?: Json | null
          metadata?: Json | null
          parent_task_id?: string | null
          recurring_pattern?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "email" | "calendar" | "slack" | "github" | "system"
          priority: "high" | "medium" | "low"
          read: boolean
          actionable: boolean
          actions: Json | null
          source_id: string | null
          source_type: string | null
          metadata: Json | null
          expires_at: string | null
          delivered_at: string | null
          delivery_channels: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: "email" | "calendar" | "slack" | "github" | "system"
          priority?: "high" | "medium" | "low"
          read?: boolean
          actionable?: boolean
          actions?: Json | null
          source_id?: string | null
          source_type?: string | null
          metadata?: Json | null
          expires_at?: string | null
          delivered_at?: string | null
          delivery_channels?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: "email" | "calendar" | "slack" | "github" | "system"
          priority?: "high" | "medium" | "low"
          read?: boolean
          actionable?: boolean
          actions?: Json | null
          source_id?: string | null
          source_type?: string | null
          metadata?: Json | null
          expires_at?: string | null
          delivered_at?: string | null
          delivery_channels?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          message_type: "user" | "assistant"
          content: string
          cards: Json | null
          suggestions: Json | null
          context: Json | null
          ai_provider: "openrouter" | "gemini"
          ai_model: string
          tokens_used: number | null
          response_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          message_type: "user" | "assistant"
          content: string
          cards?: Json | null
          suggestions?: Json | null
          context?: Json | null
          ai_provider?: "openrouter" | "gemini"
          ai_model?: string
          tokens_used?: number | null
          response_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          message_type?: "user" | "assistant"
          content?: string
          cards?: Json | null
          suggestions?: Json | null
          context?: Json | null
          ai_provider?: "openrouter" | "gemini"
          ai_model?: string
          tokens_used?: number | null
          response_time_ms?: number | null
          created_at?: string
        }
      }
      sync_logs: {
        Row: {
          id: string
          user_id: string
          integration_type: "google" | "slack" | "github" | "discord"
          status: "success" | "failed" | "in_progress"
          records_processed: number | null
          records_created: number | null
          records_updated: number | null
          records_deleted: number | null
          error_message: string | null
          error_details: Json | null
          started_at: string | null
          completed_at: string | null
          duration_ms: number | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          integration_type: "google" | "slack" | "github" | "discord"
          status: "success" | "failed" | "in_progress"
          records_processed?: number | null
          records_created?: number | null
          records_updated?: number | null
          records_deleted?: number | null
          error_message?: string | null
          error_details?: Json | null
          started_at?: string | null
          completed_at?: string | null
          duration_ms?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          integration_type?: "google" | "slack" | "github" | "discord"
          status?: "success" | "failed" | "in_progress"
          records_processed?: number | null
          records_created?: number | null
          records_updated?: number | null
          records_deleted?: number | null
          error_message?: string | null
          error_details?: Json | null
          started_at?: string | null
          completed_at?: string | null
          duration_ms?: number | null
          metadata?: Json | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          ip_address: string | null
          user_agent: string | null
          device_type: string | null
          browser: string | null
          os: string | null
          location: Json | null
          expires_at: string
          last_activity_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          location?: Json | null
          expires_at: string
          last_activity_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          location?: Json | null
          expires_at?: string
          last_activity_at?: string | null
          created_at?: string
        }
      }
      api_usage: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          method: string
          status_code: number | null
          response_time_ms: number | null
          tokens_used: number | null
          cost_cents: number | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          method: string
          status_code?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          cost_cents?: number | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          method?: string
          status_code?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          cost_cents?: number | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      webhooks: {
        Row: {
          id: string
          user_id: string
          integration_type: "google" | "slack" | "github" | "discord"
          event_type: string
          payload: Json
          processed: boolean
          processed_at: string | null
          error_message: string | null
          retry_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          integration_.type: "google" | "slack" | "github" | "discord"
          event_type: string
          payload: Json
          processed?: boolean
          processed_at?: string | null
          error_message?: string | null
          retry_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          integration_type?: "google" | "slack" | "github" | "discord"
          event_type?: string
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          error_message?: string | null
          retry_count?: number
          created_at?: string
        }
      }
      email_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          subject: string
          body: string
          variables: Json | null
          category: string | null
          usage_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          subject: string
          body: string
          variables?: Json | null
          category?: string | null
          usage_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          subject?: string
          body?: string
          variables?: Json | null
          category?: string | null
          usage_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          external_id: string
          integration_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          all_day: boolean
          location: string | null
          attendees: Json | null
          meeting_url: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          external_id: string
          integration_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          all_day?: boolean
          location?: string | null
          attendees?: Json | null
          meeting_url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          external_id?: string
          integration_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          all_day?: boolean
          location?: string | null
          attendees?: Json | null
          meeting_url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      emails: {
        Row: {
          id: string
          user_id: string
          external_id: string
          integration_id: string
          thread_id: string | null
          subject: string | null
          sender_email: string | null
          sender_name: string | null
          recipient_emails: Json | null
          cc_emails: Json | null
          bcc_emails: Json | null
          body_text: string | null
          body_html: string | null
          snippet: string | null
          labels: Json | null
          is_read: boolean
          is_important: boolean
          is_starred: boolean
          has_attachments: boolean
          attachments: Json | null
          received_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          external_id: string
          integration_id: string
          thread_id?: string | null
          subject?: string | null
          sender_email?: string | null
          sender_name?: string | null
          recipient_emails?: Json | null
          cc_emails?: Json | null
          bcc_emails?: Json | null
          body_text?: string | null
          body_html?: string | null
          snippet?: string | null
          labels?: Json | null
          is_read?: boolean
          is_important?: boolean
          is_starred?: boolean
          has_attachments?: boolean
          attachments?: Json | null
          received_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          external_id?: string
          integration_id?: string
          thread_id?: string | null
          subject?: string | null
          sender_email?: string | null
          sender_name?: string | null
          recipient_emails?: Json | null
          cc_emails?: Json | null
          bcc_emails?: Json | null
          body_text?: string | null
          body_html?: string | null
          snippet?: string | null
          labels?: Json | null
          is_read?: boolean
          is_important?: boolean
          is_starred?: boolean
          has_attachments?: boolean
          attachments?: Json | null
          received_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_notifications: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      archive_old_completed_tasks: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      calculate_user_activity_score: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}