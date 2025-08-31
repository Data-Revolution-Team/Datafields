import { Github } from "lucide-react"
import { CONTENT } from "@/lib/content"
import Image from "next/image"
import { basePath } from '../next.config'

export function Footer() {
    return (
        <footer className="bg-gradient-to-r from-background to-muted/50 py-16 border-t border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-center mb-4">
                            <Image
                                src={`${basePath}/datafields-footer-logo.svg`}
                                alt="Datafields Logo"
                                width={200}
                                height={50}
                                className="h-24 w-auto"
                            />
                        </div>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{CONTENT.footer.description}</p>
                    </div>

                    <div className="flex justify-center">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-sm font-medium">{CONTENT.footer.githubLink}</span>
                        </a>
                    </div>

                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto"></div>

                    <div className="text-sm text-muted-foreground/80">
                        <p>
                            {/* Use content constant for copyright */}
                            {CONTENT.footer.copyright}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
