"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "How are the daily rankings calculated?",
        answer: "Our algorithm primarily relies on the number of upvotes a product receives. However, it also factors in community engagement, such as the quality and quantity of discussion in the comments. Early votes carry slightly more weight than late votes to encourage discovery."
    },
    {
        question: "Who can submit a product?",
        answer: "Anyone with an registered account can submit a product! We encourage founders, makers, and even enthusiastic early adopters to share new, innovative tools they've discovered or built."
    },
    {
        question: "What makes a successful launch?",
        answer: "Preparation is key. Ensure you have high-quality screenshots, a clear and concise tagline, and a detailed description. Be ready to engage in the comments section as soon as your product is live—makers who actively answer questions tend to perform significantly better."
    },
    {
        question: "How long does it take for a product to be approved?",
        answer: "Our moderation team reviews submissions to ensure they meet our quality guidelines (no spam, no duplicate submissions). This process typically takes between 1-12 hours depending on the volume of submissions."
    },
    {
        question: "Can I edit my product after it is launched?",
        answer: "Yes, you can edit certain details like your tagline, screenshots, and description. However, the product URL and core name cannot be changed once the voting period has begun to ensure fairness."
    }
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 lg:py-32">
            <div className="wrapper max-w-4xl space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to know about how the platform operates.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`border rounded-xl bg-card transition-all duration-200 overflow-hidden ${isOpen ? 'shadow-md border-primary/20' : 'hover:border-primary/20 hover:bg-muted/30'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <span className={`font-medium sm:text-lg transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDownIcon
                                        className={`size-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
