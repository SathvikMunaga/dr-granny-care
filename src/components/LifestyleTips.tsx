import { Heart, Activity, Utensils } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LifestyleTips() {
  const tips = [
    {
      icon: Heart,
      title: "Heart Health",
      tip: "Take a 10-minute walk after each meal to help with digestion and blood sugar."
    },
    {
      icon: Activity,
      title: "Stay Active",
      tip: "Simple stretching exercises can help reduce joint stiffness and improve mobility."
    },
    {
      icon: Utensils,
      title: "Nutrition",
      tip: "Include colorful vegetables in your meals - aim for at least 3 different colors daily."
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Daily Health Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0 p-2 bg-primary rounded-full">
              <tip.icon className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip.tip}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}