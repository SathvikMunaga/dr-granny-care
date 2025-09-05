import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: string
}

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Dr. Granny, your friendly healthcare assistant. How can I help you with your health today?",
      isUser: false,
      timestamp: "Just now"
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Simulate Dr. Granny's response
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me help you with that. Have you been experiencing any other symptoms?",
        "That's a good question! Based on what you've told me, I'd recommend consulting with your doctor for a proper examination.",
        "Thank you for sharing that with me. It's important to monitor your symptoms. Can you tell me more about when this started?",
        "I'm here to help! For any serious concerns, please don't hesitate to contact your healthcare provider immediately.",
        "That sounds concerning. While I can provide general guidance, I strongly recommend speaking with your doctor about this."
      ]

      const drGrannyResponse: Message = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, drGrannyResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          {messages.length === 1 && (
            <div className="mb-8">
              <div className="bg-muted/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-3">Welcome to Dr. Granny!</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  I'm here to help answer your health questions and provide general wellness guidance. 
                  Please remember that I cannot replace professional medical advice, and for any serious 
                  concerns, you should always consult with your healthcare provider.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p><strong>What I can help with:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>General health questions</li>
                    <li>Wellness tips and lifestyle advice</li>
                    <li>Medication reminders and information</li>
                    <li>Symptom guidance and when to seek care</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 mb-6">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">DG</span>
                  </div>
                </div>
                <div className="chat-bubble-dr-granny">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping}
      />
    </div>
  )
}