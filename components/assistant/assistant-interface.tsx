"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, Sparkles, Calendar, Mail, FileText, User, Bot } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { aiService } from "@/services/ai-service"
import { supabaseService } from "@/services/supabase-service"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  cards?: Array<{
    type: "summary" | "draft" | "task" | "calendar"
    title: string
    content: string
    action?: string
  }>
}

export function AssistantInterface() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load conversation history
    const loadConversations = async () => {
      if (!user) return

      const conversations = await supabaseService.getConversations(user.id, sessionId)
      const loadedMessages: Message[] = conversations.map((conv) => ({
        id: conv.id,
        type: conv.message_type,
        content: conv.content,
        timestamp: new Date(conv.created_at),
        cards: conv.cards,
      }))

      if (loadedMessages.length === 0) {
        // Add welcome message
        const welcomeMessage: Message = {
          id: "welcome",
          type: "assistant",
          content:
            "Hi! I'm your AI assistant powered by advanced language models. I can help you with emails, calendar events, tasks, and more. What would you like to do today?",
          timestamp: new Date(),
          cards: [
            {
              type: "summary",
              title: "Getting Started",
              content:
                "I can help you manage emails, schedule meetings, organize tasks, and provide insights from your connected tools.",
              action: "Learn More",
            },
          ],
        }
        setMessages([welcomeMessage])
      } else {
        setMessages(loadedMessages)
      }
    }

    loadConversations()
  }, [user, sessionId])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Save user message to database
    await supabaseService.saveConversationMessage({
      user_id: user.id,
      session_id: sessionId,
      message_type: "user",
      content: inputValue,
      cards: [],
      suggestions: [],
      context: {},
    })

    try {
      // Get user settings for AI context
      const userSettings = await supabaseService.getUserSettings(user.id)
      const integrations = await supabaseService.getIntegrations(user.id)
      const recentTasks = await supabaseService.getTasks(user.id, { status: "pending" })

      const context = {
        userProfile: user,
        recentActivity: recentTasks.slice(0, 5),
        connectedTools: integrations.filter((i) => i.connected).map((i) => i.type),
        currentTime: new Date(),
        userSettings: userSettings
          ? {
              ai_provider: userSettings.ai_provider,
              ai_model: userSettings.ai_model,
              ai_response_style: userSettings.ai_response_style,
            }
          : undefined,
      }

      // Generate AI response
      const aiResponse = await aiService.generateResponse(inputValue, context)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse.text,
        timestamp: new Date(),
        cards: aiResponse.cards,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save assistant message to database
      await supabaseService.saveConversationMessage({
        user_id: user.id,
        session_id: sessionId,
        message_type: "assistant",
        content: aiResponse.text,
        cards: aiResponse.cards || [],
        suggestions: aiResponse.suggestions || [],
        context: context,
      })
    } catch (error) {
      console.error("Error generating AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const quickPrompts = [
    "Summarize my emails",
    "What's my next meeting?",
    "Show me today's tasks",
    "Draft a reply to the latest email",
    "Help me plan my day",
    "What are my priorities?",
  ]

  const getCardIcon = (type: string) => {
    switch (type) {
      case "summary":
        return Sparkles
      case "draft":
        return Mail
      case "task":
        return FileText
      case "calendar":
        return Calendar
      default:
        return FileText
    }
  }

  const getCardColor = (type: string) => {
    switch (type) {
      case "summary":
        return "from-purple-500 to-pink-500"
      case "draft":
        return "from-blue-500 to-cyan-500"
      case "task":
        return "from-green-500 to-emerald-500"
      case "calendar":
        return "from-orange-500 to-red-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Powered by advanced AI models</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "assistant" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : ""}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Response Cards */}
                {message.cards && (
                  <div className="mt-3 space-y-2">
                    {message.cards.map((card, index) => {
                      const IconComponent = getCardIcon(card.type)
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className={`h-1 bg-gradient-to-r ${getCardColor(card.type)}`} />
                              <div className="p-4">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${getCardColor(card.type)} rounded-lg`}
                                  >
                                    <IconComponent className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{card.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{card.content}</p>
                                    {card.action && (
                                      <Button size="sm" variant="outline">
                                        {card.action}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              {message.type === "user" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <Avatar className="w-8 h-8 mt-1">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => setInputValue(prompt)} className="text-xs">
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-12"
              disabled={isTyping}
            />
            <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
