import { CompassIcon, HomeIcon, InfoIcon, SparkleIcon, SparklesIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <SparkleIcon className="size-4 text-primary-foreground" /> 
            </div> 
            <span className="text-xl font-bold">
                i<span className="text-primary">Built</span>This
            </span>
        </Link>
    )
}

export default function Header() {
    const isSignedIn = false;

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="wrapper px-12">
                <div className="flex h-16 items-center justify-between">
                    <Logo />
                    <nav className="flex items-center gap-1">
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/70 transition-all duration-200 active:bg-muted"
                        >
                            <HomeIcon className="size-4" />
                            <span>Home</span>
                        </Link>
                        <Link 
                            href="/explore" 
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/70 transition-all duration-200 active:bg-muted"
                        >
                            <CompassIcon className="size-4" />
                            <span>Explore</span>
                        </Link>

                        <Link 
                            href="/how-it-works" 
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/70 transition-all duration-200 active:bg-muted"
                        >
                            <InfoIcon className="size-4" />
                            <span>How It Works</span>
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <SignedOut>
                            <SignInButton />
                            <SignUpButton>
                                <Button>Sign Up</Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Button asChild>
                                <Link href="/submit">
                                    <SparklesIcon className="size-4" /> Submit Project
                                </Link>
                            </Button>

                            {/* Clerk User */}
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    )
}