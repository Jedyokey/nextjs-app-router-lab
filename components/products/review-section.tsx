import { Suspense } from "react";
import { getReviewsByProductId, getReviewCountForProduct } from "@/lib/products/review-queries";
import { MessageCircleIcon, StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewForm from "./review-form";
import LiveReviewList from "./live-review-list";
import StarRating from "./star-rating";

interface ReviewSectionProps {
    productId: number;
}

async function ReviewContent({ productId }: { productId: number }) {
    const [reviews, totalCount] = await Promise.all([
        getReviewsByProductId(productId),
        getReviewCountForProduct(productId),
    ]);

    // Calculate average rating from top-level reviews that have ratings
    const ratedReviews = reviews.filter((r) => r.rating !== null && r.rating > 0);
    const averageRating =
        ratedReviews.length > 0
            ? ratedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedReviews.length
            : 0;

    return (
        <div className="space-y-6">
            {/* Header with stats */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <MessageCircleIcon className="size-5 text-primary" />
                        <h2 className="text-xl font-bold text-foreground">
                            Reviews & Comments
                        </h2>
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted/30 px-2.5 py-0.5 rounded-full font-medium">
                        {totalCount}
                    </span>
                </div>

                {averageRating > 0 && (
                    <div className="flex items-center gap-2">
                        <StarRating
                            value={Math.round(averageRating * 10) / 10}
                            readonly
                            size="sm"
                            showAverage
                            count={ratedReviews.length}
                        />
                    </div>
                )}
            </div>

            {/* Review form */}
            <ReviewForm productId={productId} />

            {/* Reviews list */}
            <LiveReviewList initialReviews={reviews} productId={productId} />
        </div>
    );
}

function ReviewSectionSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-8 rounded-full" />
            </div>

            <Skeleton className="h-32 w-full rounded-xl" />

            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 py-4">
                    <Skeleton className="size-7 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    return (
        <div className="mt-10">
            <Suspense fallback={<ReviewSectionSkeleton />}>
                <ReviewContent productId={productId} />
            </Suspense>
        </div>
    );
}
