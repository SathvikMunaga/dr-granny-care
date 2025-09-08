import { useState } from "react"
import { Heart, Lightbulb, Apple, Activity, Moon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const healthTips = [
  {
    id: 1,
    category: "Nutrition",
    icon: Apple,
    title: "Stay Hydrated",
    tip: "Drink at least 8 glasses of water daily. Your body is 60% water and needs proper hydration for optimal function.",
    benefit: "Improves energy, skin health, and kidney function"
  },
  {
    id: 2,
    category: "Exercise",
    icon: Activity,
    title: "Take the Stairs",
    tip: "Choose stairs over elevators when possible. This simple change can significantly boost your daily activity.",
    benefit: "Strengthens leg muscles and improves cardiovascular health"
  },
  {
    id: 3,
    category: "Mental Health",
    icon: Lightbulb,
    title: "Practice Deep Breathing",
    tip: "Take 5 minutes for deep breathing exercises. Inhale for 4 counts, hold for 4, exhale for 6.",
    benefit: "Reduces stress and anxiety, lowers blood pressure"
  },
  {
    id: 4,
    category: "Sleep",
    icon: Moon,
    title: "Digital Sunset",
    tip: "Turn off screens 1 hour before bedtime. Blue light can disrupt your natural sleep cycle.",
    benefit: "Improves sleep quality and duration"
  },
  {
    id: 5,
    category: "Nutrition",
    icon: Apple,
    title: "Eat the Rainbow",
    tip: "Include colorful fruits and vegetables in every meal. Different colors provide different nutrients.",
    benefit: "Boosts immune system and provides essential vitamins"
  }
]

const categoryColors = {
  "Nutrition": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Exercise": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Mental Health": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Sleep": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
}

interface DailyHealthTipsProps {
  onClose?: () => void
}

export function DailyHealthTips({ onClose }: DailyHealthTipsProps) {
  const [completedTips, setCompletedTips] = useState<number[]>([])

  const markAsCompleted = (tipId: number) => {
    setCompletedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    )
  }

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Daily Health Tips</h1>
            <p className="text-muted-foreground">{todayDate}</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Back to Chat
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {healthTips.map((tip) => {
          const IconComponent = tip.icon
          const isCompleted = completedTips.includes(tip.id)
          
          return (
            <Card 
              key={tip.id} 
              className={`transition-all hover:shadow-lg cursor-pointer ${
                isCompleted ? 'bg-muted/50 border-primary' : ''
              }`}
              onClick={() => markAsCompleted(tip.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className={`h-6 w-6 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Badge className={categoryColors[tip.category as keyof typeof categoryColors]}>
                    {tip.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm leading-relaxed">
                  {tip.tip}
                </CardDescription>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground font-medium">
                    💡 {tip.benefit}
                  </p>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <span className="text-green-500">✓</span>
                    Completed today!
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Today's Health Reminder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Small, consistent changes lead to big health improvements. You don't have to do everything at once - 
            just pick one tip to focus on today and build from there. Your future self will thank you! 🌟
          </p>
        </CardContent>
      </Card>
    </div>
  )
}