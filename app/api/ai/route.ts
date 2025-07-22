import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google-generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  const { prompt, context } = await req.json()

  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: `You are a helpful AI assistant. Here is some context about the user:\n${JSON.stringify(context, null, 2)}`,
        },
        {
          role: 'model',
          parts: 'OK, I understand. I will use this context to provide more relevant and personalized responses.',
        },
      ],
    })

    const result = await chat.sendMessage(prompt)
    const response = await result.response
    const text = response.text()

    // TODO: Implement card generation based on the response
    const cards = []

    return NextResponse.json({ text, cards })
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json({ error: 'An error occurred while generating the AI response' }, { status: 500 })
  }
}
