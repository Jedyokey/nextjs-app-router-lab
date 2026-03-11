import HeroSection from "@/components/how-it-works/hero-section";
import StepByStep from "@/components/how-it-works/step-by-step";
import FaqSection from "@/components/how-it-works/faq-section";
import CtaSection from "@/components/how-it-works/cta-section";

export const metadata = {
    title: "How It Works | iBuildApps",
    description: "Learn how to discover, discuss, and launch new products on iBuildApps.",
};

export default function HowItWorksPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero */}
            <HeroSection />

            <StepByStep />

            <FaqSection />

            <CtaSection />
        </div>
    );
}