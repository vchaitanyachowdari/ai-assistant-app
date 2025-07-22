"use client"

import { useState, useEffect } from "react"
import { supabase, type User } from "@/lib/supabase"
import { supabaseService } from "@/services/supabase-service"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const userData = await supabaseService.getCurrentUser()
        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)
        }
      }

      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Check if user exists in our users table
        let userData = await supabaseService.getCurrentUser()

        if (!userData) {
          // Create user record if it doesn't exist
          userData = await supabaseService.createUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split("@")[0],
            avatar_url: session.user.user_metadata?.avatar_url,
          })
        }

        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAuthenticated(false)
      }

      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split("@")[0],
          },
        },
      })

      if (error) throw error
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    }
  }

  const loginWithOAuth = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error("OAuth login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    signUp,
    loginWithOAuth,
    logout,
  }
}
