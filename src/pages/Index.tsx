import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"
import { ChatArea } from "@/components/ChatArea"
import { WelcomeDialog } from "@/components/WelcomeDialog"
import { DailyHealthTips } from "@/components/DailyHealthTips"
import { Reports } from "@/components/Reports"
import { Profile } from "@/components/Profile"
import { useIsMobile } from "@/hooks/use-mobile"

type ViewType = 'chat' | 'health-tips' | 'reports' | 'profile'

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>('chat')
  const isMobile = useIsMobile()

  const handleShowHealthTips = () => {
    setCurrentView('health-tips')
  }

  const handleShowReports = () => {
    setCurrentView('reports')
  }

  const handleShowProfile = () => {
    setCurrentView('profile')
  }

  const handleBackToChat = () => {
    setCurrentView('chat')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'health-tips':
        return <DailyHealthTips onClose={handleBackToChat} />
      case 'reports':
        return <Reports onClose={handleBackToChat} />
      case 'profile':
        return <Profile onClose={handleBackToChat} />
      default:
        return <ChatArea />
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <WelcomeDialog />
      <Navbar 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen || !isMobile}
          onClose={() => setSidebarOpen(false)}
          className={!isMobile ? "block" : ""}
          onShowHealthTips={handleShowHealthTips}
          onShowReports={handleShowReports}
          onShowProfile={handleShowProfile}
        />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  )
}

export default Index;
