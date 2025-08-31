import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CONTENT } from "@/lib/content"
import { Play, Gamepad2 } from "lucide-react"

export function CTASection() {
    return (
        <section className="py-20 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-6">{CONTENT.cta.heading}</h2>
                <p className="text-xl text-balance mb-8 opacity-90 max-w-2xl mx-auto">{CONTENT.cta.description}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href={`${CONTENT.links.video}`}>
                        <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                            <Play className="mr-2 h-5 w-5" />
                            {CONTENT.cta.primaryButton}
                        </Button>
                    </Link>
                    <Link href={`${CONTENT.links.simulation}`}>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                        >
                            <Gamepad2 className="mr-2 h-5 w-5" />
                            {CONTENT.cta.secondaryButton}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
