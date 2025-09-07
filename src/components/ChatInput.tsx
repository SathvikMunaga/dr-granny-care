import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/FileUpload"

interface ChatInputProps {
  onSendMessage: (message: string, attachmentUrl?: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null)
  const [attachmentName, setAttachmentName] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim(), attachmentUrl || undefined)
      setMessage("")
      setAttachmentUrl(null)
      setAttachmentName(null)
    }
  }

  const handleFileUploaded = (url: string, fileName: string) => {
    setAttachmentUrl(url)
    setAttachmentName(fileName)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {attachmentName && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded flex justify-between items-center">
            <span>📎 {attachmentName}</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setAttachmentUrl(null)
                setAttachmentName(null)
              }}
            >
              ×
            </Button>
          </div>
        )}
        
        <div className="flex gap-3 items-end">
          <FileUpload 
            onFileUploaded={handleFileUploaded}
            disabled={disabled}
          />

          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Dr. Granny anything about your health..."
              className="min-h-[48px] max-h-32 resize-none text-base border-border focus:border-ring"
              disabled={disabled}
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || disabled}
            className="touch-target interactive-button flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}