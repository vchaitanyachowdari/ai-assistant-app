"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Mail, Calendar, MessageSquare, Github, CheckCircle2 } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "email" | "calendar" | "slack" | "github" | "system"
  priority: "low" | "medium" | "high"
  timestamp: Date
  read: boolean
  actionable?: boolean
  actions?: Array<{
    label: string
    action: string
    variant?: "default" | "outline" | "destructive"
  }>
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Email from Client",
      message: "John Smith sent you an important message about the project timeline",
      type: "email",
      priority: "high",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionable: true,
      actions: [
        { label: "Reply", action: "reply", variant: "default" },
        { label: "Archive", action: "archive", variant: "outline" },
      ],
    },
    {
      id: "2",
      title: "Meeting in 15 minutes",
      message: "Team standup meeting starts soon in Conference Room A",
      type: "calendar",
      priority: "high",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      actionable: true,
      actions: [
        { label: "Join", action: "join", variant: "default" },
        { label: "Reschedule", action: "reschedule", variant: "outline" },
      ],
    },
    {
      id: "3",
      title: "Slack Message",
      message: "Sarah mentioned you in #general: Can you review the latest designs?",
      type: "slack",
      priority: "medium",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
    },
    {
      id: "4",
      title: "GitHub PR Review",
      message: "Pull request #123 is ready for your review",
      type: "github",
      priority: "medium",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionable: true,
      actions: [
        { label: "Review", action: "review", variant: "default" },
        { label: "Later", action: "later", variant: "outline" },
      ],
    },
    {
      id: "5",
      title: "System Update",
      message: "Your integrations have been successfully synced",
      type: "system",
      priority: "low",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
    },
  ])

  const [filter, setFilter] = useState<"all" | "unread" | "actionable">("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail
      case "calendar":
        return Calendar
      case "slack":
        return MessageSquare
      case "github":
        return Github
      default:
        return Bell
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email":
        return "from-blue-500 to-blue-600"
      case "calendar":
        return "from-green-500 to-green-600"
      case "slack":
        return "from-purple-500 to-purple-600"
      case "github":
        return "from-gray-700 to-gray-800"
      case "system":
        return "from-indigo-500 to-indigo-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log(`Action ${action} for notification ${notificationId}`)
    // Handle different actions
    switch (action) {
      case "reply":
        // Open email composer
        break
      case "join":
        // Open meeting link
        break
      case "review":
        // Open GitHub PR
        break
      default:
        break
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case "unread":
        return !notif.read
      case "actionable":
        return notif.actionable
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with your connected tools</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex items-center gap-2"
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
          className="flex items-center gap-2"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === "actionable" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("actionable")}
          className="flex items-center gap-2"
        >
          Actionable ({notifications.filter((n) => n.actionable).length})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => {
            const IconComponent = getNotificationIcon(notification.type)

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${getTypeColor(notification.type)} rounded-lg flex-shrink-0`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-semibold ${
                                !notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <p
                          className={`text-sm mb-3 ${
                            !notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {/* Actions */}
                        {notification.actions && (
                          <div className="flex gap-2">
                            {notification.actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant={action.variant || "outline"}
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNotificationAction(notification.id, action.action)
                                }}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No notifications</p>
            <p className="text-sm">You're all caught up! 🎉</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
