import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Camera, FileText, Image, Paperclip } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { CameraCapture } from "./CameraCapture"

interface FileUploadProps {
  onFileUploaded: (url: string, fileName: string) => void
  disabled?: boolean
}

export function FileUpload({ onFileUploaded, disabled }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload files",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(fileName)

      onFileUploaded(publicUrl, file.name)
      setOpen(false)
      
      toast({
        title: "Success",
        description: "File uploaded successfully"
      })
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload file",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDocumentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = ".pdf,.doc,.docx,.txt,.rtf"
      fileInputRef.current.click()
    }
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.click()
    }
  }

  const handleCameraClick = () => {
    setOpen(false)
    setCameraOpen(true)
  }

  const handlePhotoCapture = (file: File) => {
    uploadFile(file)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || uploading}
            className="touch-target interactive-button flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleDocumentClick}
              disabled={uploading}
            >
              <FileText className="h-4 w-4" />
              Documents
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleImageClick}
              disabled={uploading}
            >
              <Image className="h-4 w-4" />
              Images
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleCameraClick}
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
              Camera
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <CameraCapture
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onPhotoCapture={handlePhotoCapture}
      />
    </>
  )
}