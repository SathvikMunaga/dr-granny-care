import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    )
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! This page seems to have wandered off to see another doctor.
          </p>
        </div>
        
        <Button 
          asChild
          className="touch-target interactive-button"
        >
          <a href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return to Dr. Granny
          </a>
        </Button>
      </div>
    </div>
  )
}

export default NotFound;
