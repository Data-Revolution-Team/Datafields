"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { CONTENT } from "@/lib/content"
import { basePath } from '../next.config'

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 900)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="select-none flex items-center space-x-1 hover:opacity-80 transition-opacity">
                            <Image
                                src={`${basePath}/datafields-symbol.svg"`}
                                alt={CONTENT.brand.name}
                                width={40}
                                height={40}
                                className="h-16 w-16 cursor-pointer"
                                priority
                            />
                            <span className={`text-xl font-semibold ${isScrolled ? "text-[#00843D]" : "text-[#FFCD00]"} cursor-pointer`}>Datafields</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {/* Example navigation items - uncomment and modify as needed:
              <Link href="/features" className="text-foreground/80 hover:text-primary transition-colors">
                {CONTENT.nav.features}
              </Link>
              <Link href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">
                {CONTENT.nav.pricing}
              </Link>
              <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors">
                {CONTENT.nav.about}
              </Link>
              */}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">{/* Auth buttons can be added here when needed */}</div>
                </div>
            </div>
        </nav>
    )
}
