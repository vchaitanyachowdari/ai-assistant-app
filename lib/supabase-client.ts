"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a singleton Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      "X-Client-Info": "ai-assistant-app@1.0.0",
    },
  },
})

// Auth helpers
export const auth = supabase.auth

// Real-time helpers
export const realtime = supabase.realtime

// Storage helpers
export const storage = supabase.storage

// Database helpers with type safety
export const db = supabase

// Connection status
export const getConnectionStatus = () => {
  return supabase.realtime.isConnected()
}

// Health check
export const healthCheck = async () => {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    return { healthy: !error, error }
  } catch (error) {
    return { healthy: false, error }
  }
}
