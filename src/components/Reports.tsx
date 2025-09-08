import { useState } from "react"
import { FileText, Upload, Download, Calendar, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { FileUpload } from "./FileUpload"
import { useToast } from "@/hooks/use-toast"

interface Report {
  id: string
  name: string
  type: string
  uploadDate: string
  size: string
  url: string
}

interface ReportsProps {
  onClose?: () => void
}

export function Reports({ onClose }: ReportsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([
    // Mock data for demonstration
    {
      id: "1",
      name: "Blood Test Results - Jan 2025",
      type: "lab-report",
      uploadDate: "2025-01-15",
      size: "2.3 MB",
      url: "#"
    },
    {
      id: "2", 
      name: "X-Ray Chest - Dec 2024",
      type: "imaging",
      uploadDate: "2024-12-20",
      size: "5.1 MB", 
      url: "#"
    }
  ])

  const handleFileUploaded = (url: string, fileName: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: fileName,
      type: getFileType(fileName),
      uploadDate: new Date().toISOString().split('T')[0],
      size: "Unknown",
      url: url
    }
    
    setReports(prev => [newReport, ...prev])
    
    toast({
      title: "Success",
      description: "Report uploaded successfully!",
    })
  }

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'document'
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'imaging'
      case 'doc':
      case 'docx':
        return 'document'
      default:
        return 'other'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab-report':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'imaging':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'document':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lab-report':
        return 'Lab Report'
      case 'imaging':
        return 'Imaging'
      case 'document':
        return 'Document'
      default:
        return 'Other'
    }
  }

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId))
    toast({
      title: "Deleted",
      description: "Report has been deleted.",
    })
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Medical Reports</h1>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Back to Chat
            </Button>
          )}
        </div>

        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-xl">Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view and manage your medical reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your medical reports are securely stored and only accessible when you're logged in.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Medical Reports</h1>
            <p className="text-muted-foreground">Upload and manage your medical documents</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Back to Chat
          </Button>
        )}
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Report
          </CardTitle>
          <CardDescription>
            Upload your medical reports, lab results, or imaging files for easy access during consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            onFileUploaded={handleFileUploaded}
          />
        </CardContent>
      </Card>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-xl">No Reports Found</CardTitle>
            <CardDescription>
              You haven't uploaded any medical reports yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload your medical documents to keep them organized and easily accessible.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Reports ({reports.length})</h2>
          
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{report.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.uploadDate).toLocaleDateString()}
                          </span>
                          <span>{report.size}</span>
                          <Badge className={getTypeColor(report.type)}>
                            {getTypeLabel(report.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteReport(report.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}