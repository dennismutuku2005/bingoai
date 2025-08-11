"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Sparkles, Zap, Code, Lightbulb, MessageSquare } from "lucide-react"
import type { Chat, Message, User } from "@/app/page"
import { ChatMessage } from "@/components/chat-message"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { useToast } from "@/hooks/use-toast"

interface ChatInterfaceProps {
  chat?: Chat
  onUpdateChat: (chatId: string, messages: Message[]) => void
  onNewChat: () => string | null
  user: User
}

const templates = [
  {
    icon: Code,
    title: "Code Helper",
    description: "Get help with programming and debugging",
    prompt: "Help me write a function that...",
  },
  {
    icon: Lightbulb,
    title: "Creative Writing",
    description: "Generate creative content and ideas",
    prompt: "Write a creative story about...",
  },
  {
    icon: Zap,
    title: "Quick Question",
    description: "Ask any question you have",
    prompt: "I need help understanding...",
  },
  {
    icon: MessageSquare,
    title: "General Chat",
    description: "Have a conversation about anything",
    prompt: "Let's talk about...",
  },
]

export function ChatInterface({ chat, onUpdateChat, onNewChat, user }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const handleSubmit = async (prompt?: string) => {
    const messageText = prompt || input.trim()
    if (!messageText || isLoading) return

    // Check if user can send messages
    if (user.plan === "free" && !chat && user.chatsUsed >= user.maxChats) {
      toast({
        title: "Free trial limit reached",
        description: "Upgrade to Pro for unlimited chats",
        variant: "destructive",
      })
      return
    }

    let currentChatId = chat?.id

    // Create new chat if none exists
    if (!currentChatId) {
      currentChatId = onNewChat()
      if (!currentChatId) return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    const currentMessages = chat?.messages || []
    const updatedMessages = [...currentMessages, userMessage]

    onUpdateChat(currentChatId, updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      onUpdateChat(currentChatId, [...updatedMessages, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTemplateClick = (template: (typeof templates)[0]) => {
    setInput(template.prompt)
    textareaRef.current?.focus()
  }

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">What can I help you build?</h1>
            <p className="text-muted-foreground text-lg">Choose a template below or start typing your own message</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleTemplateClick(template)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <template.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Bingo..."
                className="min-h-[60px] pr-12 resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {user.plan === "free" && (
              <p className="text-xs text-muted-foreground text-center">
                {user.chatsUsed}/{user.maxChats} free chats used
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {chat.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <LoadingSkeleton />}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Bingo..."
              className="min-h-[60px] pr-12 resize-none border-2 focus:border-primary/50"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {user.plan === "free" && (
            <div className="flex items-center justify-center mt-2">
              <span className="text-xs text-muted-foreground">
                {user.chatsUsed}/{user.maxChats} free chats used
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
