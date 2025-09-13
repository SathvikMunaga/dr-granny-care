import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, X, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CameraCaptureProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPhotoCapture: (file: File) => void
}

export function CameraCapture({ open, onOpenChange, onPhotoCapture }: CameraCaptureProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      setIsLoading(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const switchCamera = async () => {
    stopCamera()
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const file = new File([blob], `camera-photo-${timestamp}.jpg`, { 
          type: 'image/jpeg' 
        })
        onPhotoCapture(file)
        onOpenChange(false)
        toast({
          title: "Photo Captured",
          description: "Photo ready to send"
        })
      }
    }, 'image/jpeg', 0.9)
  }

  useEffect(() => {
    if (open) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [open, facingMode])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Take Photo
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative bg-black">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Starting camera...</div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-96"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={switchCamera}
            disabled={isLoading || !stream}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Flip Camera
          </Button>
          
          <Button
            onClick={capturePhoto}
            disabled={isLoading || !stream}
            className="bg-primary hover:bg-primary/90"
          >
            <Camera className="h-4 w-4 mr-2" />
            Capture Photo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}