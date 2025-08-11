"use client"

import { MessageSquare, Plus, Search, Trash2, Sparkles } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Chat, User } from "@/app/page"
import { useState } from "react"

interface AppSidebarProps {
  chats: Chat[]
  currentChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => string | null
  onDeleteChat: (chatId: string) => void
  user: User
}

export function AppSidebar({ chats, currentChatId, onChatSelect, onNewChat, onDeleteChat, user }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleNewChat = () => {
    if (user.plan === "free" && user.chatsUsed >= user.maxChats) {
      // Could show a toast or modal here
      return
    }
    onNewChat()
  }

  const canCreateNewChat = user.plan === "paid" || user.chatsUsed < user.maxChats

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Bingo</span>
          </div>
          <Badge variant={user.plan === "free" ? "secondary" : "default"} className="ml-auto">
            {user.plan === "free" ? "Free" : "Pro"}
          </Badge>
        </div>

        <Button
          onClick={handleNewChat}
          className="mx-2 justify-start gap-2 bg-transparent"
          variant="outline"
          disabled={!canCreateNewChat}
        >
          <Plus className="w-4 h-4" />
          New Chat
          {user.plan === "free" && (
            <span className="ml-auto text-xs text-muted-foreground">
              {user.chatsUsed}/{user.maxChats}
            </span>
          )}
        </Button>

        <div className="px-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredChats.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  {searchQuery ? "No chats found" : "No chats yet"}
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      onClick={() => onChatSelect(chat.id)}
                      isActive={currentChatId === chat.id}
                      className="w-full justify-start"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="truncate">{chat.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => onDeleteChat(chat.id)}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.plan === "free" ? `${user.chatsUsed}/${user.maxChats} chats used` : "Unlimited"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
