export const aiService = {
  async generateResponse(prompt: string, context: any) {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate AI response')
    }

    return response.json()
  },
}