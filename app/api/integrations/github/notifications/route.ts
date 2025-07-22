
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'No user ID provided' }, { status: 400 })
  }

  try {
    const { data: integration, error } = await supabaseAdmin
      .from('integrations')
      .select('access_token')
      .eq('user_id', userId)
      .eq('type', 'github')
      .single()

    if (error || !integration) {
      throw new Error('Could not find GitHub integration for this user')
    }

    const response = await fetch('https://api.github.com/notifications', {
      headers: {
        Authorization: `token ${integration.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub notifications')
    }

    const notifications = await response.json()

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching GitHub notifications:', error)
    return NextResponse.json({ error: 'An error occurred while fetching GitHub notifications' }, { status: 500 })
  }
}
