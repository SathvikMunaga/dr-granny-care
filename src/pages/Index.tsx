import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"
import { ChatArea } from "@/components/ChatArea"
import { useIsMobile } from "@/hooks/use-mobile"

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navbar 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen || !isMobile}
          onClose={() => setSidebarOpen(false)}
          className={!isMobile ? "block" : ""}
        />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ChatArea />
        </main>
      </div>
    </div>
  )
}

export default Index;
