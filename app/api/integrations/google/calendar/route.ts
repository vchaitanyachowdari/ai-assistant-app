
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { google } from 'googleapis'

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
      .eq('type', 'google')
      .single()

    if (error || !integration) {
      throw new Error('Could not find Google integration for this user')
    }

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: integration.access_token })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: events } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    })

    return NextResponse.json(events?.items || [])
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error)
    return NextResponse.json({ error: 'An error occurred while fetching calendar events' }, { status: 500 })
  }
}
