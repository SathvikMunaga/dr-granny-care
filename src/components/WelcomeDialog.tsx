import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { Bot, LogIn, UserPlus, ArrowRight } from "lucide-react"

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signInWithGoogle } = useAuth()

  useEffect(() => {
    // Show dialog if user is not logged in and hasn't dismissed it before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!user && !hasSeenWelcome) {
      setIsOpen(true)
    }
  }, [user])

  const handleContinueWithoutLogin = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setIsOpen(false)
  }

  const handleSignUp = () => {
    signInWithGoogle()
    setIsOpen(false)
  }

  const handleLogin = () => {
    signInWithGoogle()
    setIsOpen(false)
  }

  if (user) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Welcome to Dr. Granny
          </DialogTitle>
          <p className="text-muted-foreground">
            Your AI healthcare companion. Get personalized health advice and lifestyle tips.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <Button 
            onClick={handleSignUp}
            className="w-full gap-2 h-12"
            size="lg"
          >
            <UserPlus className="w-4 h-4" />
            Sign Up with Google
          </Button>
          
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full gap-2 h-12"
            size="lg"
          >
            <LogIn className="w-4 h-4" />
            Login with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleContinueWithoutLogin}
            variant="ghost"
            className="w-full gap-2 h-12"
            size="lg"
          >
            <ArrowRight className="w-4 h-4" />
            Continue without login
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Create an account to save your chat history and personalize your experience.
        </p>
      </DialogContent>
    </Dialog>
  )
}