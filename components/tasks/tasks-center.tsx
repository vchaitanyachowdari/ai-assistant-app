"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Circle, Clock, Zap, History, Plus, ArrowRight, Calendar, Mail, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Task } from "@/lib/database.types"
import { useAuth } from "@/hooks/use-auth"
import { TaskForm } from "./task-form"

export function TasksCenter() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("suggested")

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user.id)
        if (error) {
          console.error("Error fetching tasks:", error)
        } else {
          setTasks(data)
        }
      }
    }

    fetchTasks()
  }, [user])

  const handleTaskAction = async (taskId: string, action: "approve" | "edit" | "complete" | "delete") => {
    if (!user) return

    switch (action) {
      case "approve":
        const { error: approveError } = await supabase
          .from("tasks")
          .update({ type: "user-created" })
          .eq("id", taskId)
        if (approveError) {
          console.error("Error approving task:", approveError)
        }
        break
      case "complete":
        const { error: completeError } = await supabase
          .from("tasks")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", taskId)
        if (completeError) {
          console.error("Error completing task:", completeError)
        }
        break
      case "delete":
        const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId)
        if (deleteError) {
          console.error("Error deleting task:", deleteError)
        }
        break
      default:
        break
    }

    // Refresh tasks
    const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user.id)
    if (error) {
      console.error("Error fetching tasks:", error)
    } else {
      setTasks(data)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "Gmail":
        return Mail
      case "Calendar":
        return Calendar
      case "GitHub":
        return FileText
      default:
        return Circle
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

  const filteredTasks = {
    suggested: tasks.filter((task) => task.type === "ai-suggested"),
    confirmed: tasks.filter((task) => task.type === "user-created" && task.status !== "completed"),
    history: tasks.filter((task) => task.status === "completed"),
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks & Actions</h1>
          <p className="text-gray-600 dark:text-gray-400">AI-powered task management and suggestions</p>
        </div>
        <TaskForm>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </TaskForm>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">AI Suggested</p>
                <p className="text-2xl font-bold">{filteredTasks.suggested.length}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">In Progress</p>
                <p className="text-2xl font-bold">{filteredTasks.confirmed.length}</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">{filteredTasks.history.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tasks Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggested" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Suggested
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggested" className="space-y-4 mt-6">
            <AnimatePresence>
              {filteredTasks.suggested.map((task, index) => {
                const SourceIcon = getSourceIcon(task.source)
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg">
                            <SourceIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                                {task.source && (
                                  <Badge variant="outline" className="text-xs">
                                    {task.source}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {task.estimated_time_minutes} min
                                </span>
                                {task.due_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(task.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <TaskForm task={task}>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </TaskForm>
                                <Button
                                  size="sm"
                                  onClick={() => handleTaskAction(task.id, "approve")}
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                >
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4 mt-6">
            <AnimatePresence>
              {filteredTasks.confirmed.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskAction(task.id, "complete")}
                          className="p-0 h-auto"
                        >
                          <Circle className="w-6 h-6 text-gray-400 hover:text-green-500" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                            <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.estimated_time_minutes} min
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            <AnimatePresence>
              {filteredTasks.history.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white line-through">{task.title}</h3>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
