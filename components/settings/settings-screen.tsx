"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, Smartphone, Moon, Sun, Trash2, Download, Upload, LogOut, Crown, Brain } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/hooks/use-notifications"
import { supabaseService } from "@/services/supabase-service"
import { aiService } from "@/services/ai-service"
import type { UserSettings } from "@/lib/supabase"

export function SettingsScreen() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { settings: notificationSettings, updateSettings } = useNotifications()
  const [userSettings, setUserSettings] = useState<Partial<UserSettings>>({
    ai_provider: "openrouter",
    ai_model: "deepseek/deepseek-chat-v3-0324:free",
    ai_response_style: "professional",
    proactive_mode: true,
    voice_enabled: false,
    data_retention_days: 30,
  })
  const [isLoading, setIsLoading] = useState(true)

  const availableModels = aiService.getAvailableModels()

  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return

      const settings = await supabaseService.getUserSettings(user.id)
      if (settings) {
        setUserSettings({
          ai_provider: settings.ai_provider,
          ai_model: settings.ai_model,
          ai_response_style: settings.ai_response_style,
          proactive_mode: settings.proactive_mode,
          voice_enabled: settings.voice_enabled,
          data_retention_days: settings.data_retention_days,
        })
      }
      setIsLoading(false)
    }

    loadUserSettings()
  }, [user])

  const updateUserSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return

    const newSettings = { ...userSettings, ...updates }
    setUserSettings(newSettings)

    await supabaseService.updateUserSettings(user.id, newSettings)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>
        <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <Crown className="w-3 h-3 mr-1" />
          Pro
        </Badge>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue={user?.timezone || "UTC"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue={user?.language || "en"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                    <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Assistant Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Assistant
            </CardTitle>
            <CardDescription>Customize your AI assistant behavior and model selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>AI Provider</Label>
                <Select
                  value={userSettings.ai_provider}
                  onValueChange={(value: "openrouter" | "gemini") => updateUserSettings({ ai_provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openrouter">OpenRouter (Multiple Models)</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select
                  value={userSettings.ai_model}
                  onValueChange={(value) => updateUserSettings({ ai_model: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userSettings.ai_provider === "openrouter"
                      ? availableModels.openrouter.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} - {model.provider}
                          </SelectItem>
                        ))
                      : availableModels.gemini.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} - {model.provider}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Response Style</Label>
                <Select
                  value={userSettings.ai_response_style}
                  onValueChange={(value: "professional" | "casual" | "concise" | "detailed") =>
                    updateUserSettings({ ai_response_style: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Proactive Mode</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI suggests actions without being asked</p>
                </div>
                <Switch
                  checked={userSettings.proactive_mode}
                  onCheckedChange={(checked) => updateUserSettings({ proactive_mode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Voice Input</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enable voice commands and responses</p>
                </div>
                <Switch
                  checked={userSettings.voice_enabled}
                  onCheckedChange={(checked) => updateUserSettings({ voice_enabled: checked })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Data Retention (days)</Label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userSettings.data_retention_days} days
                  </span>
                </div>
                <Slider
                  value={[userSettings.data_retention_days || 30]}
                  onValueChange={([value]) => updateUserSettings({ data_retention_days: value })}
                  max={365}
                  min={7}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>7 days</span>
                  <span>1 year</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications on your device</p>
                </div>
                <Switch
                  checked={notificationSettings.pushEnabled}
                  onCheckedChange={(checked) => updateSettings({ pushEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">WhatsApp Alerts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get important updates via WhatsApp</p>
                </div>
                <Switch
                  checked={notificationSettings.whatsappEnabled}
                  onCheckedChange={(checked) => updateSettings({ whatsappEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email Summaries</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily digest of your activity</p>
                </div>
                <Switch
                  checked={notificationSettings.emailSummaries}
                  onCheckedChange={(checked) => updateSettings({ emailSummaries: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Smart Reminders</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered contextual reminders</p>
                </div>
                <Switch
                  checked={notificationSettings.smartReminders}
                  onCheckedChange={(checked) => updateSettings({ smartReminders: checked })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Notification Schedule</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quiet Hours Start</Label>
                  <Input
                    type="time"
                    value={notificationSettings.quietHoursStart}
                    onChange={(e) => updateSettings({ quietHoursStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quiet Hours End</Label>
                  <Input
                    type="time"
                    value={notificationSettings.quietHoursEnd}
                    onChange={(e) => updateSettings({ quietHoursEnd: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="flex items-center gap-2"
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="flex items-center gap-2"
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    System
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Data Analytics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Help improve the app with usage data</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Crash Reports</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically send crash reports</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Personalized AI</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use your data to personalize AI responses</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Data Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Trash2 className="w-4 h-4" />
                  Clear Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Sign Out</h4>
                <p className="text-sm text-red-700 dark:text-red-300">Sign out of your account on this device</p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Delete Account</h4>
                <p className="text-sm text-red-700 dark:text-red-300">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
