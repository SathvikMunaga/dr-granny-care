import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useChats } from "@/hooks/useChats"
import { useAuth } from "@/hooks/useAuth"
import drGrannyAvatar from "@/assets/dr-granny-avatar.png"

export function ChatArea() {
  const { messages, currentChat, loading, sendMessage, createNewChat } = useChats()
  const { user } = useAuth()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (message: string, attachmentUrl?: string) => {
    if (!user) {
      // For non-authenticated users, just send the message without saving to database
      await sendMessage(message, attachmentUrl)
      return
    }
    
    let chat = currentChat
    if (!chat) {
      chat = await createNewChat()
      if (!chat) return
    }
    
    await sendMessage(message, attachmentUrl)
  }

  const handleStartNewChat = async () => {
    if (user) {
      await createNewChat()
    } else {
      // For non-authenticated users, just clear the local messages
      window.location.reload()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            // No messages yet
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-20">
              <Avatar className="h-24 w-24">
                <AvatarImage src={drGrannyAvatar} alt="Dr. Granny" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">DG</AvatarFallback>
              </Avatar>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground">
                  Hello! I'm Dr. Granny 👩‍⚕️
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your trusted AI health assistant. Start a new conversation or select a previous chat.
                </p>
              </div>
              
              <Button onClick={handleStartNewChat} size="lg" className="gap-2">
                Start New Chat
              </Button>
            </div>
          ) : (
            // Messages when conversation exists
            <>
              {/* Messages */}
              <div className="space-y-1">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.is_user}
                    timestamp={new Date(message.created_at).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  />
                ))}
              </div>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={loading}
      />
    </div>
  )
}