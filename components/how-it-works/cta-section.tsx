import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CompassIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function CtaSection() {
    return (
        <section className="py-20 mb-12">
            <div className="wrapper max-w-5xl">
                <Card className="relative overflow-hidden border-border bg-card p-12 md:p-16 text-center space-y-8 rounded-3xl">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Ready to dive in?
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Join thousands of makers and tech enthusiasts. Whether you're here to launch your next big idea or discover the future of software, there's a place for you.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <Button size="lg" className="w-full sm:w-auto min-w-48 gap-2" asChild>
                                <Link href="/explore">
                                    <CompassIcon className="size-5" />
                                    Explore Trending
                                </Link>
                            </Button>
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto min-w-48 gap-2" asChild>
                                <Link href="/submit">
                                    Submit Product 
                                    <ArrowRightIcon className="size-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}
