"use client";

import { useEffect, useState } from "react";
import type { ReviewWithAuthor } from "@/lib/products/review-queries";
import ReviewCard from "./review-card";
import { fetchLiveReviewsAction } from "@/lib/products/review-actions";
import { MessageCircleIcon } from "lucide-react";

interface LiveReviewListProps {
    initialReviews: ReviewWithAuthor[];
    productId: number;
}

export default function LiveReviewList({ initialReviews, productId }: LiveReviewListProps) {
    const [reviews, setReviews] = useState<ReviewWithAuthor[]>(initialReviews);

    // Sync when Next.js revalidates the route (e.g. after YOU submit a comment)
    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    // Background polling for changes (e.g. when OTHERS submit a comment)
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const result = await fetchLiveReviewsAction(productId);
            if (result.success && result.reviews) {
                setReviews((prev) => {
                    // Avoid unnecessary React state updates by deeply comparing
                    if (JSON.stringify(prev) === JSON.stringify(result.reviews)) {
                        return prev;
                    }
                    return result.reviews;
                });
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [productId]);

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-border/50 rounded-xl">
                <MessageCircleIcon className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to share your thoughts!
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border/50">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    productId={productId}
                />
            ))}
        </div>
    );
}
