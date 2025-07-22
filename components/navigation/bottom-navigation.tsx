"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, MessageCircle, CheckSquare, Settings, Bell } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

interface BottomNavigationProps {
  activeScreen: string
  onScreenChange: (screen: string) => void
}

export function BottomNavigation({ activeScreen, onScreenChange }: BottomNavigationProps) {
  const { unreadCount } = useNotifications()

  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "assistant", label: "Assistant", icon: MessageCircle },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "notifications", label: "Alerts", icon: Bell, badge: unreadCount },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 px-4 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeScreen === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="relative">
                  <IconComponent className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </div>
              {item.id === "assistant" && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
