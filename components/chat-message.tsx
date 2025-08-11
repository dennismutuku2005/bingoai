"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import type { Message } from "@/app/page"
import { Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "./markdown-renderer"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-4 max-w-4xl mx-auto", isUser && "flex-row-reverse")}>
      <Avatar className="w-8 h-8 shrink-0 mt-1">
        {isUser ? (
          <>
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="bg-blue-500">
              <User className="w-4 h-4 text-white" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="w-4 h-4 text-white" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn("flex-1 space-y-2", isUser && "flex flex-col items-end")}>
        <div className="text-xs text-muted-foreground font-medium">{isUser ? "You" : "Bingo"}</div>

        <Card
          className={cn("p-4 max-w-none", isUser ? "bg-primary text-primary-foreground ml-12" : "bg-card border mr-12")}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </Card>
      </div>
    </div>
  )
}
