import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CONTENT } from "@/lib/content"
import { Play, Gamepad2 } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-[#004d23] dark:bg-[#003318]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00843D]/20 to-[#006b32]/10"></div>
            <div className="absolute inset-0 bg-[url('/abstract-data-visualization.png')] bg-cover bg-center opacity-5"></div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 text-white">
                    {CONTENT.hero.heading.replace(CONTENT.hero.highlightWord, "")}
                    <span className="text-[#00843D]">{CONTENT.hero.highlightWord}</span>
                </h1>

                <p className="text-xl sm:text-2xl text-slate-300 text-balance mb-8 max-w-3xl mx-auto">
                    {CONTENT.hero.subheading}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        size="lg"
                        className="text-lg px-8 py-6 bg-[#00843D] hover:bg-[#006b32] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#00843D]/25"
                    >
                        <Play className="mr-2 h-5 w-5" />
                        {CONTENT.hero.primaryButton}
                    </Button>
                    <Link href="/simulation">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="text-lg px-8 py-6 bg-[#FFCD00] text-[#111D35] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FFCD00]/25 hover:bg-[#e6b800]"
                        >
                            <Gamepad2 className="mr-2 h-5 w-5" />
                            {CONTENT.hero.secondaryButton}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
