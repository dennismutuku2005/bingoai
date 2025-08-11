import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyDiYnOOd6EfORHH2VVVX5ccmHMfwYdY220"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Convert messages to Gemini format
    const contents = messages.map((message: any) => ({
      parts: [{ text: message.content }],
      role: message.role === "assistant" ? "model" : "user",
    }))

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to get response from Gemini API" }, { status: response.status })
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json({ error: "Invalid response from Gemini API" }, { status: 500 })
    }

    const content = data.candidates[0].content.parts[0].text

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
