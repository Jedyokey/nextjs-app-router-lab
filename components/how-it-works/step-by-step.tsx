import { CompassIcon, MessageCircleIcon, RocketIcon, ThumbsUpIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
    {
        icon: CompassIcon,
        title: "1. Discover",
        description: "Browse the homepage or explore categories to find the newest and most exciting products launched today.",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        icon: ThumbsUpIcon,
        title: "2. Vote & Review",
        description: "Upvote your favorite products to help them climb the daily leaderboard. Leave honest reviews to support makers.",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        border: "border-green-500/20"
    },
    {
        icon: MessageCircleIcon,
        title: "3. Engage",
        description: "Join the discussion! Ask makers questions, provide constructive feedback, and connect with other tech enthusiasts.",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        icon: RocketIcon,
        title: "4. Launch",
        description: "Built something cool? Submit your own project, gather feedback from early adopters, and build your audience.",
        color: "text-primary",
        bgColor: "bg-primary/10",
        border: "border-primary/20"
    }
];

export default function StepByStep() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="wrapper space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">How the Community Works</h2>
                    <p className="text-muted-foreground text-lg">
                        Our mechanics are simple but powerful. Everything is driven by community curation and engagement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <Card
                            key={index}
                            className={`p-8 border bg-card/50 backdrop-blur card-hover flex flex-col items-center text-center space-y-4 ${step.border}`}
                        >
                            <div className={`size-16 rounded-2xl flex items-center justify-center mb-2 ${step.bgColor} ${step.color}`}>
                                <step.icon className="size-8" />
                            </div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
