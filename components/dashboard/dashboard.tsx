"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Mail, MessageSquare, Github, Clock, Zap, TrendingUp, Bell, Plus, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Dashboard() {
  const { user } = useAuth()
  const [todayEvents, setTodayEvents] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      if (user) {
        const response = await fetch(`/api/integrations/google/calendar?userId=${user.id}`)
        const events = await response.json()
        setTodayEvents(events)
      }
    }

    const fetchGitHubNotifications = async () => {
      if (user) {
        const response = await fetch(`/api/integrations/github/notifications?userId=${user.id}`)
        const notifications = await response.json()
        setNotifications(notifications)
      }
    }

    fetchCalendarEvents()
    fetchGitHubNotifications()
  }, [user])

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

  const aiSuggestions = [
    { title: "Review pending emails", priority: "high", estimated: "15 min" },
    { title: "Prepare for client call", priority: "medium", estimated: "30 min" },
    { title: "Update project documentation", priority: "low", estimated: "45 min" },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Good morning, {user?.name || "User"}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening today</p>
        </div>
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Today's Events</p>
                <p className="text-2xl font-bold">{todayEvents.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Notifications</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">AI Tasks</p>
                <p className="text-2xl font-bold">{aiSuggestions.length}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Schedule */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your upcoming events and meetings</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{event.summary}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(event.start.dateTime).toLocaleTimeString()}</p>
                </div>
                <Badge variant="secondary">{event.status}</Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications Summary */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Stay updated with your connected tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{notification.repository.full_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.subject.title}</p>
                </div>
                <span className="text-xs text-gray-500">{new Date(notification.updated_at).toLocaleTimeString()}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Suggested Priorities */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI Suggested Priorities
            </CardTitle>
            <CardDescription>Smart recommendations based on your activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{suggestion.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        suggestion.priority === "high"
                          ? "destructive"
                          : suggestion.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {suggestion.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{suggestion.estimated}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Ask Assistant CTA */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-indigo-100 mb-4">Ask your AI assistant anything</p>
            <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
              Ask Assistant
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
