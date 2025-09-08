import { useState } from "react"
import { User, Mail, Calendar, Settings, Shield, Bell, Palette, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileProps {
  onClose?: () => void
}

export function Profile({ onClose }: ProfileProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    bloodType: "",
    allergies: "",
    medications: "",
    emergencyContact: "",
    preferredLanguage: "en",
    timezone: "UTC"
  })

  const [notifications, setNotifications] = useState({
    healthReminders: true,
    appointmentAlerts: true,
    medicationReminders: false,
    healthTips: true,
    emailNotifications: true
  })

  const [privacy, setPrivacy] = useState({
    shareHealthData: false,
    allowDataAnalytics: true,
    publicProfile: false
  })

  const handleProfileSave = () => {
    // Here you would save to Supabase
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    })
  }

  const handleNotificationSave = () => {
    // Here you would save notification preferences
    toast({
      title: "Preferences Updated", 
      description: "Your notification preferences have been saved.",
    })
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
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
              Please sign in to access your profile and personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create an account to save your health information, track your progress, and get personalized recommendations.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account and health information</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Back to Chat
          </Button>
        )}
      </div>

      {/* Profile Picture & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={profile.gender} onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleProfileSave} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Basic Information
          </Button>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Health Information
          </CardTitle>
          <CardDescription>
            This information helps provide more personalized health advice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                value={profile.height}
                onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                placeholder="170"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                value={profile.weight}
                onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="70"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select value={profile.bloodType} onValueChange={(value) => setProfile(prev => ({ ...prev, bloodType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={profile.allergies}
              onChange={(e) => setProfile(prev => ({ ...prev, allergies: e.target.value }))}
              placeholder="List any known allergies..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              value={profile.medications}
              onChange={(e) => setProfile(prev => ({ ...prev, medications: e.target.value }))}
              placeholder="List current medications and dosages..."
              rows={3}
            />
          </div>

          <Button onClick={handleProfileSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Health Information
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label htmlFor={key} className="font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {key === 'healthReminders' && 'Get reminders for health checkups and screenings'}
                  {key === 'appointmentAlerts' && 'Receive alerts for upcoming appointments'}
                  {key === 'medicationReminders' && 'Reminders to take your medications'}
                  {key === 'healthTips' && 'Daily health tips and wellness advice'}
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                </p>
              </div>
              <Switch
                id={key}
                checked={value}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}

          <Button onClick={handleNotificationSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Notification Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}