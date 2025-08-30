import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CONTENT } from "@/lib/content"

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">{CONTENT.features.heading}</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">{CONTENT.features.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CONTENT.features.items.map((feature, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
