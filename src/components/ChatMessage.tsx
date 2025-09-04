import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import drGrannyAvatar from "@/assets/dr-granny-avatar.png"

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp: string
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-sm">You</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarImage src={drGrannyAvatar} alt="Dr. Granny" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">DG</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={
          isUser 
            ? "chat-bubble-user" 
            : "chat-bubble-dr-granny"
        }>
          <p className="text-base leading-relaxed">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {timestamp}
        </span>
      </div>
    </div>
  )
}