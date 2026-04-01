import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminSkeleton() {
    return (
        <div className="space-y-8">
            {/* Stats cards skeleton */}
            <div className="space-y-6">
                {/* First row - 3 cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="p-6 border border-border bg-card">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-xl" />
                            </div>
                        </Card>
                    ))}
                </div>
                
                {/* Second row - 3 cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i + 3} className="p-6 border border-border bg-card">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-xl" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Pending Approvals Section Skeleton */}
            <Card className="border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-full max-w-2xl" />
                                <div className="flex gap-3">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <div className="flex gap-2 md:flex-col">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* All Products Table Skeleton */}
            <Card className="border border-border bg-card p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <th key={i} className="text-left py-3 px-4">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-border/50">
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <td key={j} className="py-3 px-4">
                                            <Skeleton className="h-4 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Recent activity skeleton */}
            <Card className="border border-border bg-card p-6">
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}