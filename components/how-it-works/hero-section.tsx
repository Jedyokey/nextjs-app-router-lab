import { Button } from "@/components/ui/button";
import { SparklesIcon, CompassIcon } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-primary/5 -z-10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />

            <div className="wrapper flex flex-col items-center text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <SparklesIcon className="size-4" />
                    <span>Welcome to iBuildApps</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
                    Discover, discuss, and launch new <span className="text-primary">products daily.</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    We are a community-driven platform where founders and makers share their latest creations with early adopters and tech enthusiasts.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
                        <Link href="/explore">
                            <CompassIcon className="size-5" />
                            Start Exploring
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" asChild>
                        <Link href="/submit">
                            <SparklesIcon className="size-5" />
                            Launch a Product
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
