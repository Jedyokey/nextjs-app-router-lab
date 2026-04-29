"use client";

import Link from "next/link";
import { 
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { StarIcon, ArrowRightIcon } from "lucide-react"
import VotingButtons from "./voting-buttons";
import { useState } from "react";

type ProductCardProps = {
    product: {
        id: number;
        name: string;
        slug: string;
        tagline: string | null;
        description: string | null;
        websiteUrl: string | null;
        tags: string[] | null;
        voteCount: number;
        featured?: boolean | null;
        status: string | null;
        createdAt: Date | null;
        hasVoted: boolean;
        userId?: string | null;
        approvedAt?: Date | null;
        submittedBy?: string | null;
        organizationId?: string | null;
    };
};

// Maximum characters before truncation (110 chars)
const MAX_DESCRIPTION_LENGTH = 110;

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    const description = product.description || "";
    const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
    
    // Show truncated description to maintain consistent height
    const displayDescription = description.slice(0, MAX_DESCRIPTION_LENGTH) + (description.length > MAX_DESCRIPTION_LENGTH ? "..." : "");

    return (
        <Link href={`/products/${product.slug}`}>
            <Card 
                className="group card-hover hover:bg-primary-foreground/10 border-solid border-gray-400 min-h-[200px] relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardHeader className="flex-1">
                    <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {product.name}
                                </CardTitle>
                                {product.featured && (
                                    <Badge className="gap-1 bg-primary text-primary-foreground">
                                        <StarIcon className="size-3 fill-current" />
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            
                            {/* Description with show more overlay */}
                            <div className="relative">
                                <CardDescription>
                                    {displayDescription}
                                </CardDescription>
                                
                                {/* Show More Overlay - only appears on hover for long descriptions */}
                                {isLongDescription && isHovered && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-card via-card/80 to-transparent">
                                        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 hover:bg-primary/90 transition-colors">
                                            Show More
                                            <ArrowRightIcon className="size-3" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <VotingButtons 
                            hasVoted={product.hasVoted} 
                            voteCount={product.voteCount} 
                            productId={product.id} 
                        />
                    </div>
                </CardHeader>
                <CardFooter>
                    <div className="flex items-center gap-2">
                        {product.tags?.map((tag) => (
                            <Badge variant="secondary" key={tag}>{tag}</Badge>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}