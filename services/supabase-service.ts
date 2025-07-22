import { supabase } from '@/lib/supabase-client'
import { User, UserSettings, Integration, Task, AIConversation } from '@/lib/database.types'

export const supabaseService = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    return data
  },

  async createUser(user: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase.from('users').insert(user).select().single()
    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    return data
  },

  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).single()
    if (error) {
      console.error('Error fetching user settings:', error)
      return null
    }
    return data
  },

  async getIntegrations(userId: string): Promise<Integration[]> {
    const { data, error } = await supabase.from('integrations').select('*').eq('user_id', userId)
    if (error) {
      console.error('Error fetching integrations:', error)
      return []
    }
    return data
  },

  async getTasks(userId: string, options: { status?: string } = {}): Promise<Task[]> {
    let query = supabase.from('tasks').select('*').eq('user_id', userId)
    if (options.status) {
      query = query.eq('status', options.status)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
    return data
  },

  async getConversations(userId: string, sessionId: string): Promise<AIConversation[]> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
    return data
  },

  async saveConversationMessage(message: Partial<AIConversation>): Promise<void> {
    const { error } = await supabase.from('ai_conversations').insert(message)
    if (error) {
      console.error('Error saving conversation message:', error)
    }
  },
}