import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { formatUsername } from "@/lib/products/format-utils";

interface RecentProduct {
    id: number;
    name: string;
    submittedBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    status: string | null;
}

export default function RecentActivity({ products }: { products: RecentProduct[] }) {
    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-xs shadow-none">
                        <CheckCircleIcon className="size-3 mr-1" />
                        Approved
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs shadow-none">
                        <ClockIcon className="size-3 mr-1" />
                        Pending
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs shadow-none">
                        <XCircleIcon className="size-3 mr-1" />
                        Rejected
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-xs">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <Card className="border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <PackageIcon className="size-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No recent activity</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                            <div className="p-2 rounded-lg bg-muted/30">
                                <PackageIcon className="size-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-foreground">{product.name}</span>
                                    {getStatusBadge(product.status)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    by {formatUsername(product.submittedBy)} • {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : 'Recently'}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}