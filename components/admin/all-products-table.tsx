"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    EyeIcon, 
    Trash2Icon, 
    StarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    RotateCcwIcon
} from "lucide-react";
import Link from "next/link";
import { 
    deleteProduct, 
    toggleFeatured,
    approveRejectedProduct,
    rejectApprovedProduct 
} from "@/app/admin/actions";
import { useTransition, useState } from "react";
import { formatUsername } from "@/lib/products/format-utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Product {
    id: number;
    slug?: string;
    name: string;
    tagline: string | null;
    description: string | null;
    submittedBy: string | null;
    createdAt: Date | null;
    voteCount: number;
    status: string | null;
}

export default function AllProductsTable({ products }: { products: Product[] }) {
    const [isPending, startTransition] = useTransition();
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productId: number | null }>({
        open: false,
        productId: null,
    });

    const handleDelete = (productId: number) => {
        setDeleteDialog({ open: true, productId });
    };

    const confirmDelete = () => {
        if (deleteDialog.productId) {
            startTransition(async () => {
                await deleteProduct(deleteDialog.productId!);
                setDeleteDialog({ open: false, productId: null });
            });
        }
    };

    const handleToggleFeatured = (productId: number, currentVoteCount: number) => {
        startTransition(async () => {
            await toggleFeatured(productId, currentVoteCount);
        });
    };

    const handleApproveRejected = (productId: number) => {
        startTransition(async () => {
            await approveRejectedProduct(productId);
        });
    };

    const handleRejectApproved = (productId: number) => {
        startTransition(async () => {
            await rejectApprovedProduct(productId);
        });
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircleIcon className="size-3 mr-1" />Approved</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><ClockIcon className="size-3 mr-1" />Pending</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircleIcon className="size-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Card className="border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">All Products</h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Submitted By</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Votes</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium text-foreground">{product.name}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                        {formatUsername(product.submittedBy)}
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1">
                                            <span className={product.voteCount > 100 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                                                {product.voteCount}
                                            </span>
                                            {product.voteCount > 100 && (
                                                <StarIcon className="size-3 text-primary fill-primary" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(product.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
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
                                            
                                            {/* Approve button for rejected products */}
                                            {product.status === 'rejected' && (
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleApproveRejected(product.id)}
                                                    disabled={isPending}
                                                    title="Approve product"
                                                >
                                                    <CheckCircleIcon className="size-4" />
                                                </Button>
                                            )}
                                            
                                            {/* Reject button for approved products */}
                                            {product.status === 'approved' && (
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleRejectApproved(product.id)}
                                                    disabled={isPending}
                                                    title="Reject product"
                                                >
                                                    <XCircleIcon className="size-4" />
                                                </Button>
                                            )}
                                            
                                            {/* Featured toggle for all products */}
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                                                onClick={() => handleToggleFeatured(product.id, product.voteCount)}
                                                disabled={isPending}
                                                title={product.voteCount > 100 ? "Remove featured" : "Make featured"}
                                            >
                                                <StarIcon className={`size-4 ${product.voteCount > 100 ? 'fill-primary' : ''}`} />
                                            </Button>
                                            
                                            {/* Delete button for all products */}
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(product.id)}
                                                disabled={isPending}
                                                title="Delete product"
                                            >
                                                <Trash2Icon className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, productId: null })}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Delete Product</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialog({ open: false, productId: null })}
                            className="border-border hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmDelete}
                            disabled={isPending}
                        >
                            {isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}