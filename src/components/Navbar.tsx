import { Share2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import drGrannyAvatar from "@/assets/dr-granny-avatar.png"

interface NavbarProps {
  onMenuToggle: () => void
  isMobile: boolean
}

export function Navbar({ onMenuToggle, isMobile }: NavbarProps) {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="touch-target interactive-button"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            <img 
              src={drGrannyAvatar} 
              alt="Dr. Granny"
              className="h-8 w-8 object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Dr. Granny</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Healthcare Assistant</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="touch-target interactive-button flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share Chat</span>
      </Button>
    </header>
  )
}