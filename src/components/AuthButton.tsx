import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { LogIn, LogOut } from "lucide-react"

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={signOut}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={signInWithGoogle}
      className="gap-2"
    >
      <LogIn className="h-4 w-4" />
      Login / Signup
    </Button>
  )
}