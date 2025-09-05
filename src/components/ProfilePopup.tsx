import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Settings } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useChats } from "@/hooks/useChats"

export function ProfilePopup() {
  const { user, signOut } = useAuth()
  const { chats } = useChats()

  if (!user) return null

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 hover:bg-accent"
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.user_metadata?.full_name || "User"} 
              />
              <AvatarFallback className="text-lg">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {user.user_metadata?.full_name || 'User'}
              </h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1 justify-center">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{chats.length}</p>
              <p className="text-xs text-muted-foreground">Total Chats</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {chats.filter(chat => {
                  const chatDate = new Date(chat.created_at)
                  const today = new Date()
                  return chatDate.toDateString() === today.toDateString()
                }).length}
              </p>
              <p className="text-xs text-muted-foreground">Today's Chats</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Joined
              </span>
              <Badge variant="secondary">{joinDate}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Account Type</span>
              <Badge variant="default">Free Plan</Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button variant="outline" className="w-full gap-2">
              <Settings className="h-4 w-4" />
              Account Settings
            </Button>
            <Button 
              variant="destructive" 
              onClick={signOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}