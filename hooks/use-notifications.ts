"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./use-auth"
import { supabaseService } from "@/services/supabase-service"
import type { UserSettings } from "@/lib/supabase"

export function useNotifications() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    notifications_enabled: true,
    push_enabled: true,
    whatsapp_enabled: false,
    email_summaries: true,
    smart_reminders: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
  })

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return

      const userSettings = await supabaseService.getUserSettings(user.id)
      if (userSettings) {
        setSettings({
          notifications_enabled: userSettings.notifications_enabled,
          push_enabled: userSettings.push_enabled,
          whatsapp_enabled: userSettings.whatsapp_enabled,
          email_summaries: userSettings.email_summaries,
          smart_reminders: userSettings.smart_reminders,
          quiet_hours_start: userSettings.quiet_hours_start,
          quiet_hours_end: userSettings.quiet_hours_end,
        })
      }
    }

    loadSettings()
  }, [user])

  const updateSettings = useCallback(
    async (updates: Partial<UserSettings>) => {
      if (!user) return

      const newSettings = { ...settings, ...updates }
      setSettings(newSettings)

      await supabaseService.updateUserSettings(user.id, newSettings)
    },
    [user, settings],
  )

  return { settings, updateSettings }
}