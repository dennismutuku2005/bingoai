"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  plan: "free" | "paid"
  chatsUsed: number
  maxChats: number
}

export default function HomePage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [user, setUser] = useState<User>({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/diverse-user-avatars.png",
    plan: "free",
    chatsUsed: 2,
    maxChats: 5,
  })

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("bingo-chats")
    const savedUser = localStorage.getItem("bingo-user")

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
      setChats(parsedChats)
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("bingo-chats", JSON.stringify(chats))
    }
  }, [chats])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem("bingo-user", JSON.stringify(user))
  }, [user])

  const createNewChat = () => {
    if (user.plan === "free" && user.chatsUsed >= user.maxChats) {
      return null // Will be handled in the UI
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)

    // Update user's chat count
    setUser((prev) => ({
      ...prev,
      chatsUsed: prev.chatsUsed + 1,
    }))

    return newChat.id
  }

  const updateChat = (chatId: string, messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages,
              title: messages.length > 0 ? messages[0].content.slice(0, 50) + "..." : "New Chat",
              updatedAt: new Date(),
            }
          : chat,
      ),
    )
  }

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(null)
    }
  }

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  return (
    <>
      <AppSidebar
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        user={user}
      />
      <SidebarInset>
        <Header user={user} />
        <ChatInterface chat={currentChat} onUpdateChat={updateChat} onNewChat={createNewChat} user={user} />
      </SidebarInset>
    </>
  )
}
