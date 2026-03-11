"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { approveProduct, rejectProduct } from "@/app/admin/actions";
import { useTransition } from "react";
import { formatUsername } from "@/lib/products/format-utils";
import EmptyState from "@/components/common/empty-state";

interface PendingProduct {
    id: number;
    slug?: string;
    name: string;
    tagline: string | null;
    description: string | null;
    submittedBy: string | null;
    createdAt: Date | null;
    voteCount: number;
}

export default function PendingApprovals({ products }: { products: PendingProduct[] }) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = (productId: number) => {
        startTransition(async () => {
            await approveProduct(productId);
        });
    };

    const handleReject = (productId: number) => {
        startTransition(async () => {
            await rejectProduct(productId);
        });
    };

    return (
        <Card className="border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Pending Approvals</h2>
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                    {products.length} waiting
                </Badge>
            </div>

            <div className="space-y-4">
                {products.length === 0 ? (
                    <EmptyState
                        message="All caught up! No pending approvals."
                        icon={CheckCircleIcon}
                    />
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-foreground">{product.name}</h3>
                                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                                        <ClockIcon className="size-3 mr-1" />
                                        Pending
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {product.tagline || product.description}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>by {formatUsername(product.submittedBy)}</span>
                                    <span>•</span>
                                    <span>{product.voteCount} votes</span>
                                    <span>•</span>
                                    <span>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Recently'}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    asChild
                                    title="View product"
                                >
                                    <Link href={`/products/${product.slug ?? product.id}?admin=true`} target="_blank">
                                        <EyeIcon className="size-4" />
                                    </Link>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleApprove(product.id)}
                                    disabled={isPending}
                                    title="Approve product"
                                >
                                    <CheckCircleIcon className="size-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleReject(product.id)}
                                    disabled={isPending}
                                    title="Reject product"
                                >
                                    <XCircleIcon className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}