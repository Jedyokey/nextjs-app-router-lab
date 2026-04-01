'use client'

import { 
    CompassIcon, 
    HomeIcon, 
    InfoIcon, 
    SparkleIcon,
    Menu,
    X,
} from "lucide-react"
import Link from "next/link"
import { UserAuth } from "../auth/user-auth"
import { useState } from "react"

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="size-7 sm:size-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
                <SparkleIcon className="size-3.5 sm:size-4 text-primary-foreground" /> 
            </div> 
            <span className="text-base sm:text-xl font-bold">
                i<span className="text-primary">Build</span>Apps
            </span>
        </Link>
    )
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    // const isSignedIn = false;

    const navLinks = [
        { href: "/", label: "Home", icon: HomeIcon },
        { href: "/explore", label: "Explore", icon: CompassIcon },
        { href: "/how-it-works", label: "How It Works", icon: InfoIcon },
    ]

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="wrapper px-4 md:px-12">
                <div className="flex h-16 items-center justify-between gap-2">
                    <Logo />
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link 
                                    key={link.href}
                                    href={link.href} 
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/70 transition-all duration-200 active:bg-muted"
                                >
                                    <Icon className="size-4" />
                                    <span>{link.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-1 sm:gap-3">
                        {/* Hamburger Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-1.5 sm:p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="size-6" />
                            ) : (
                                <Menu className="size-6" />
                            )}
                        </button>
                        <UserAuth />
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <nav className="md:hidden pb-4 border-t">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon
                                return (
                                    <Link 
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/70 transition-all duration-200 active:bg-muted"
                                    >
                                        <Icon className="size-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}