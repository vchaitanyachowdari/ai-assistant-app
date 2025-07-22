
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  let tokenData: any

  try {
    switch (provider) {
      case 'google':
        tokenData = await exchangeGoogleCode(code)
        break
      case 'github':
        tokenData = await exchangeGitHubCode(code)
        break
      default:
        return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })
    }

    // Save the token data to the database
    const { error } = await supabaseAdmin.from('integrations').insert({
      type: provider,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      // You might want to associate this with the logged-in user
      // user_id: userId,
    })

    if (error) {
      throw error
    }

    return NextResponse.redirect(new URL('/integrations', req.url))
  } catch (error) {
    console.error(`Error during OAuth flow for ${provider}:`, error)
    return NextResponse.json({ error: 'An error occurred during the OAuth flow' }, { status: 500 })
  }
}

async function exchangeGoogleCode(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/google`,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange Google code')
  }

  return response.json()
}

async function exchangeGitHubCode(code: string) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      code,
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/github`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange GitHub code')
  }

  return response.json()
}
