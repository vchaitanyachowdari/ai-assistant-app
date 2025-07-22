"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Mail,
  Calendar,
  MessageSquare,
  Github,
  Slack,
  Phone,
  Settings,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
} from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Integration } from "@/lib/database.types"

export function IntegrationManager() {
  const [integrations, setIntegrations] = useState<Integration[]>([])

  useEffect(() => {
    const fetchIntegrations = async () => {
      const { data, error } = await supabase.from("integrations").select("*")
      if (error) {
        console.error("Error fetching integrations:", error)
      } else {
        setIntegrations(data)
      }
    }

    fetchIntegrations()
  }, [])

  const handleConnect = async (provider: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/${provider}`,
      },
    })

    if (error) {
      console.error(`Error connecting to ${provider}:`, error)
    }
  }

  const toggleIntegration = (id: string) => {
    // This will be handled by the OAuth flow
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "syncing":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle2
      case "error":
        return AlertCircle
      case "syncing":
        return Settings
      default:
        return CheckCircle2
    }
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

  const categories = {
    communication: integrations.filter((i) => i.category === "communication"),
    productivity: integrations.filter((i) => i.category === "productivity"),
    development: integrations.filter((i) => i.category === "development"),
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect your favorite tools and services</p>
        </div>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Browse More
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Connected</p>
                <p className="text-2xl font-bold">{integrations.filter((i) => i.connected).length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Available</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Issues</p>
                <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "error").length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Communication Tools */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Communication
            </CardTitle>
            <CardDescription>Email, messaging, and communication tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.communication.map((integration, index) => {
              const IconComponent = integration.icon
              const StatusIcon = getStatusIcon(integration.status)

              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                      {integration.connected && (
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(integration.status)}`} />
                          <span className={`text-xs ${getStatusColor(integration.status)}`}>{integration.status}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{integration.description}</p>
                    {integration.connected && integration.lastSync && (
                      <p className="text-xs text-gray-500">Last sync: {integration.lastSync.toLocaleTimeString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.connected && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Switch checked={integration.connected} onCheckedChange={() => handleConnect(integration.id)} />
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Productivity Tools */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Productivity
            </CardTitle>
            <CardDescription>Calendar, tasks, and productivity tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.productivity.map((integration, index) => {
              const IconComponent = integration.icon
              const StatusIcon = getStatusIcon(integration.status)

              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                      {integration.connected && (
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(integration.status)}`} />
                          <span className={`text-xs ${getStatusColor(integration.status)}`}>{integration.status}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{integration.description}</p>
                    {integration.connected && integration.lastSync && (
                      <p className="text-xs text-gray-500">Last sync: {integration.lastSync.toLocaleTimeString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.connected && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Switch checked={integration.connected} onCheckedChange={() => handleConnect(integration.id)} />
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Development Tools */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Development
            </CardTitle>
            <CardDescription>Code repositories and development tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.development.map((integration, index) => {
              const IconComponent = integration.icon
              const StatusIcon = getStatusIcon(integration.status)

              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                      {integration.connected && (
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(integration.status)}`} />
                          <span className={`text-xs ${getStatusColor(integration.status)}`}>{integration.status}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{integration.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {integration.permissions.slice(0, 2).map((permission, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {integration.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{integration.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.connected && (
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                    <Switch checked={integration.connected} onCheckedChange={() => handleConnect(integration.id)} />
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
