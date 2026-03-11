import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"

export default function ProductExplorerSkeleton() {
    return (
        <div>
            {/* Search and filter skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Skeleton className="h-10 flex-1" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Results count skeleton */}
            <Skeleton className="h-5 w-48 mb-6" />

            {/* Product cards grid skeleton */}
            <div className="grid-wrapper">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="border border-gray-400 min-h-[200px]">
                        <CardHeader className="flex-1">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                                {/* Voting buttons skeleton */}
                                <div className="flex flex-col items-center gap-1">
                                    <Skeleton className="h-6 w-10" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-center gap-2 mt-12">
                <Skeleton className="h-9 w-9 rounded-md" />
                <div className="flex items-center gap-1">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-12 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
            </div>
        </div>
    )
}