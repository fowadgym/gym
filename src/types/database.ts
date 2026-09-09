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
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'coach' | 'athlete'
          full_name: string
          phone_number: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'coach' | 'athlete'
          full_name: string
          phone_number?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'coach' | 'athlete'
          full_name?: string
          phone_number?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          athlete_id: string
          tier: 'basic' | 'pro' | 'vip'
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          athlete_id: string
          tier: 'basic' | 'pro' | 'vip'
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          athlete_id?: string
          tier?: 'basic' | 'pro' | 'vip'
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          title: string
          description: string | null
          targeted_muscles: string[] | null
          video_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          targeted_muscles?: string[] | null
          video_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          targeted_muscles?: string[] | null
          video_url?: string | null
          created_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          athlete_id: string
          assigned_by: string | null
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          athlete_id: string
          assigned_by?: string | null
          date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          athlete_id?: string
          assigned_by?: string | null
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          sets: number
          reps: string
          weight_target: string | null
          order_index: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          sets?: number
          reps?: string
          weight_target?: string | null
          order_index?: number
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          sets?: number
          reps?: string
          weight_target?: string | null
          order_index?: number
          completed?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      athletes_subscription_status: {
        Row: {
          id: string
          full_name: string
          tier: string | null
          end_date: string | null
          days_remaining: number | null
          is_active: boolean | null
        }
      }
    }
    Functions: {
      get_dashboard_kpis: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_active: number
          expiring_soon: number
          expired: number
          total_athletes: number
        }
      }
    }
  }
}
