"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles } from "lucide-react"

export function LoadingSkeleton() {
  return (
    <div className="flex gap-4 max-w-4xl mx-auto">
      <Avatar className="w-8 h-8 shrink-0 mt-1">
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
          <Sparkles className="w-4 h-4 text-white" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="text-xs text-muted-foreground font-medium">Bingo</div>

        <Card className="p-4 mr-12 bg-card border">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150" />
              <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
            </div>

            {/* Code block skeleton */}
            <div className="space-y-2 mt-4">
              <div className="h-6 bg-muted rounded animate-pulse w-20" />
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
