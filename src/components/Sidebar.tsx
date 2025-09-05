import { useState } from "react"
import { Plus, Search, MessageSquare, FileText, User, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChats } from "@/hooks/useChats"
import { useAuth } from "@/hooks/useAuth"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { chats, createNewChat, selectChat } = useChats()
  const { user } = useAuth()

  const handleNewChat = async () => {
    if (user) {
      await createNewChat()
      if (onClose) onClose()
    }
  }

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const previousChats = [
    { id: 1, title: "Blood pressure medication", time: "2 hours ago" },
    { id: 2, title: "Diabetes diet questions", time: "Yesterday" },
    { id: 3, title: "Joint pain symptoms", time: "2 days ago" },
    { id: 4, title: "Heart health checkup", time: "1 week ago" },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-80 bg-background border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${className}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Chats</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="md:hidden touch-target"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* New Chat Button */}
            <Button 
              className="w-full touch-target interactive-button justify-start text-left mb-2"
              variant="outline"
              onClick={handleNewChat}
              disabled={!user}
            >
              <Plus className="h-5 w-5 mr-3" />
              New Chat
            </Button>
            
            {/* Daily Health Tips Button */}
            <Button 
              className="w-full touch-target interactive-button justify-start text-left"
              variant="ghost"
            >
              <Heart className="h-5 w-5 mr-3" />
              Daily Health Tips
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 touch-target text-base"
              />
            </div>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Previous Chats</h3>
              
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors interactive-button touch-target"
                    onClick={() => {
                      selectChat(chat)
                      onClose()
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight line-clamp-2">
                          {chat.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(chat.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {user ? 'No chats yet. Start a new conversation!' : 'Sign in to view your chats'}
                </p>
              )}
            </div>
          </ScrollArea>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start touch-target interactive-button"
              >
                <FileText className="h-5 w-5 mr-3" />
                Reports
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start touch-target interactive-button"
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}