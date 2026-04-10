import { Suspense } from "react";
import { getProductIdsForParams } from "@/lib/products/product-select";
import { getProductBySlug } from "@/lib/products/product-queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon, Globe, CalendarIcon, UserIcon, StarIcon, AwardIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VotingButtons from "@/components/products/voting-buttons";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewSection from "@/components/products/review-section";

export const generateStaticParams = async () => {
    const ids = await getProductIdsForParams();
    return ids.map((id) => ({ slug: id.toString() }));
}

async function ProductDetails({ 
    slug, 
    searchParams 
}: { 
    slug: string; 
    searchParams: Promise<{ admin?: string }> 
}) {
    const { admin } = await searchParams;
    const adminPreview = admin === "true";
    const product = await getProductBySlug(slug, adminPreview);

    if (!product) {
        notFound();
    }

    const { 
        name, 
        description, 
        tagline,
        websiteUrl, 
        tags, 
        voteCount, 
        submittedBy, 
        createdAt,
        hasVoted,
        submitterDisplayName
    } = product;

    // Check if product is featured (100+ votes)
    const isFeatured = voteCount >= 100;

    const launchDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : null;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header with title and voting */}
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-6 md:gap-8 mb-8 md:mb-12">
                {/* Title section with featured badge */}
                <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground flex items-center gap-2">
                            <StarIcon className="size-6 md:size-8 text-primary shrink-0" />
                            <span className="truncate">{name}</span>
                        </h1>
                        {isFeatured && (
                            <Badge 
                                variant="secondary"
                                className="bg-primary text-primary-foreground py-1 text-sm font-medium"
                            >
                                <StarIcon className="size-3.5 mr-1 text-primary-foreground fill-current" />
                                Featured
                            </Badge>
                        )}
                    </div>
                    {tagline && (
                        <p className="text-xl text-muted-foreground">
                            {tagline}
                        </p>
                    )}
                </div>
                
                {/* Voting section with support text */}
                <div className="flex-shrink-0 w-full sm:w-fit md:w-auto mt-4 md:mt-0">
                    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 md:sticky top-8 w-full sm:w-[120px] md:w-[100px] mx-auto sm:mx-0">
                        <VotingButtons 
                            productId={product.id}
                            voteCount={voteCount}
                            hasVoted={hasVoted}
                        />
                        <p className="text-xs text-center text-muted-foreground font-medium">
                            Support this product
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <Card className="border border-border bg-card rounded-2xl p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                {/* Description */}
                {description && (
                    <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                        {description}
                    </p>
                )}

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge 
                                key={tag} 
                                variant="secondary"
                                className="bg-secondary text-secondary-foreground px-3 py-1 text-xs font-normal"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    {submittedBy && (
                        <div className="flex items-center gap-2">
                            <UserIcon className="size-4" />
                            <span className="capitalize">{submitterDisplayName}</span>
                        </div>
                    )}

                    {launchDate && (
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-4" />
                            <span>{launchDate}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <span>{voteCount} votes</span>
                        {isFeatured && (
                            <AwardIcon className="size-3.5 text-primary" />
                        )}
                    </div>

                    {websiteUrl && (
                        <Link 
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group ml-auto"
                        >
                            <Globe className="size-4" />
                            <span>Visit website</span>
                            <ArrowUpRightIcon className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    )}
                </div>
            </Card>

            {/* Reviews & Comments */}
            <ReviewSection productId={product.id} />
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-6 md:gap-8 mb-8 md:mb-12">
                <div className="flex-1 w-full space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-2/3" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-1/2" />
                </div>
                <Skeleton className="h-28 w-full sm:w-[120px] md:w-[100px] rounded-2xl mt-4 md:mt-0" />
            </div>

            <Card className="border border-border bg-card rounded-2xl p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="border-t border-border" />
                <div className="flex flex-wrap items-center gap-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                </div>
            </Card>
        </div>
    );
}

export default async function Product(
    { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ admin?: string }> }
) {
    const { slug } = await params;

    return (
        <div className="min-h-screen bg-background py-6 sm:py-8 lg:py-12">
            <div className="wrapper py-4 sm:py-8 px-4 sm:px-6 lg:px-12">
                <Link 
                    href="/explore"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-8 md:mb-12"
                >
                    <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Explore</span>
                </Link>

                <Suspense fallback={<ProductSkeleton />}>
                    <ProductDetails slug={slug} searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}