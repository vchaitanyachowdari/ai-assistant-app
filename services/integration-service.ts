"use client"

interface IntegrationConfig {
  clientId: string
  clientSecret?: string
  scopes: string[]
  redirectUri: string
}

interface SyncResult {
  success: boolean
  data?: any
  error?: string
  lastSync: Date
}

class IntegrationService {
  private configs: Record<string, IntegrationConfig> = {
    gmail: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      scopes: ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"],
      redirectUri: `${window.location.origin}/auth/callback/google`,
    },
    calendar: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      scopes: ["https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/calendar.events"],
      redirectUri: `${window.location.origin}/auth/callback/google`,
    },
    github: {
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "",
      scopes: ["repo", "notifications", "user:email"],
      redirectUri: `${window.location.origin}/auth/callback/github`,
    },
    slack: {
      clientId: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || "",
      scopes: ["channels:read", "chat:write", "users:read"],
      redirectUri: `${window.location.origin}/auth/callback/slack`,
    },
  }

  async connectIntegration(type: string): Promise<{ success: boolean; authUrl?: string; error?: string }> {
    try {
      const config = this.configs[type]
      if (!config) {
        return { success: false, error: "Integration not supported" }
      }

      // Generate OAuth URL
      const authUrl = this.generateAuthUrl(type, config)

      // In a real app, this would redirect to the OAuth provider
      // For demo purposes, we'll simulate the connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store connection status
      localStorage.setItem(
        `integration_${type}`,
        JSON.stringify({
          connected: true,
          connectedAt: new Date().toISOString(),
          accessToken: `mock_token_${type}`,
        }),
      )

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to connect integration" }
    }
  }

  async disconnectIntegration(type: string): Promise<{ success: boolean; error?: string }> {
    try {
      localStorage.removeItem(`integration_${type}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to disconnect integration" }
    }
  }

  async syncIntegration(type: string): Promise<SyncResult> {
    try {
      const connection = this.getConnection(type)
      if (!connection) {
        return { success: false, error: "Integration not connected", lastSync: new Date() }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockData = this.getMockSyncData(type)

      // Store sync result
      localStorage.setItem(
        `sync_${type}`,
        JSON.stringify({
          lastSync: new Date().toISOString(),
          data: mockData,
        }),
      )

      return { success: true, data: mockData, lastSync: new Date() }
    } catch (error) {
      return { success: false, error: "Sync failed", lastSync: new Date() }
    }
  }

  async getEmails(limit = 10): Promise<any[]> {
    const connection = this.getConnection("gmail")
    if (!connection) return []

    // Mock email data
    return [
      {
        id: "1",
        subject: "Project Update Required",
        from: "john.smith@client.com",
        snippet: "Hi, I need an update on the current project status...",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unread: true,
        important: true,
      },
      {
        id: "2",
        subject: "Meeting Reschedule Request",
        from: "sarah.johnson@company.com",
        snippet: "Can we move tomorrow's meeting to Thursday?",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000),
        unread: true,
        important: false,
      },
      {
        id: "3",
        subject: "Weekly Newsletter",
        from: "newsletter@techcompany.com",
        snippet: "This week's top tech news and updates...",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unread: false,
        important: false,
      },
    ]
  }

  async getCalendarEvents(days = 7): Promise<any[]> {
    const connection = this.getConnection("calendar")
    if (!connection) return []

    // Mock calendar events
    return [
      {
        id: "1",
        title: "Team Standup",
        start: new Date(Date.now() + 30 * 60 * 1000),
        end: new Date(Date.now() + 60 * 60 * 1000),
        location: "Conference Room A",
        attendees: ["team@company.com"],
      },
      {
        id: "2",
        title: "Client Presentation",
        start: new Date(Date.now() + 6 * 60 * 60 * 1000),
        end: new Date(Date.now() + 7 * 60 * 60 * 1000),
        location: "Zoom",
        attendees: ["client@company.com"],
      },
      {
        id: "3",
        title: "Code Review Session",
        start: new Date(Date.now() + 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 25 * 60 * 60 * 1000),
        location: "Dev Room",
        attendees: ["dev-team@company.com"],
      },
    ]
  }

  private generateAuthUrl(type: string, config: IntegrationConfig): string {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(" "),
      response_type: "code",
      state: `integration_${type}`,
    })

    const baseUrls: Record<string, string> = {
      gmail: "https://accounts.google.com/oauth2/authorize",
      calendar: "https://accounts.google.com/oauth2/authorize",
      github: "https://github.com/login/oauth/authorize",
      slack: "https://slack.com/oauth/v2/authorize",
    }

    return `${baseUrls[type]}?${params.toString()}`
  }

  private getConnection(type: string) {
    const stored = localStorage.getItem(`integration_${type}`)
    return stored ? JSON.parse(stored) : null
  }

  private getMockSyncData(type: string) {
    switch (type) {
      case "gmail":
        return { emailCount: 12, unreadCount: 5, lastEmail: "Project Update Required" }
      case "calendar":
        return { eventCount: 4, nextEvent: "Team Standup", upcomingCount: 2 }
      case "github":
        return { prCount: 3, issueCount: 7, lastActivity: "Code review completed" }
      case "slack":
        return { messageCount: 15, mentionCount: 2, lastMessage: "Great work on the presentation!" }
      default:
        return {}
    }
  }
}

export const integrationService = new IntegrationService()
